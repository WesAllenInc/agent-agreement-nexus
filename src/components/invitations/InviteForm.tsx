
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Mail, Percent } from "lucide-react";

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [residualPercent, setResidualPercent] = useState(25);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (residualPercent < 0 || residualPercent > 100) {
      toast.error("Residual percentage must be between 0 and 100");
      return;
    }
    
    setIsSending(true);
    
    try {
      // Create invitation record in the database
      const { data: invitation, error: invitationError } = await supabase
        .from('invitations')
        .insert([
          { 
            email, 
            residual_percent: residualPercent,
            created_by: user?.id,
            // token and expires_at will be set by the database trigger
          }
        ])
        .select('id, token')
        .single();
      
      if (invitationError) {
        throw new Error(invitationError.message);
      }
      
      if (!invitation) {
        throw new Error("Failed to create invitation");
      }
      
      // Generate invitation link
      const inviteLink = `${window.location.origin}/invitation/accept?token=${invitation.token}&email=${encodeURIComponent(email)}`;
      
      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('sendInvitationEmail', {
        body: { 
          email, 
          inviteLink,
          residualPercent,
          token: invitation.token
        }
      });
      
      if (emailError) {
        throw new Error(emailError.message);
      }
      
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      setResidualPercent(25);
    } catch (error: any) {
      toast.error("Failed to send invitation: " + (error.message || "Please try again"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-navy-100 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-navy-600">
          Invite New Sales Agent
        </CardTitle>
        <CardDescription className="text-gray-600">
          Send an email invitation to a new sales agent to join the platform.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleInvite}>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-700">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="sales.agent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-200 focus:border-brand-600 focus:ring-brand-600 pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="residual-percent" className="text-navy-700">
                  Residual Percentage
                </Label>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                  <Percent className="h-3 w-3 mr-1 text-gray-500" />
                  <span>{residualPercent}%</span>
                </div>
              </div>
              <Slider
                id="residual-percent"
                defaultValue={[25]}
                max={100}
                step={1}
                value={[residualPercent]}
                onValueChange={(values) => setResidualPercent(values[0])}
                className="py-2"
              />
              <p className="text-xs text-gray-500">
                This is the percentage of commission the agent will receive from their sales.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSending}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

