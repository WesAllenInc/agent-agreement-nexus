import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendInviteEmail } from "@/api/mockEdgeFunctions";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function SeniorAgentInviteForm() {
  const [email, setEmail] = useState("");
  const [residualPercentage, setResidualPercentage] = useState(25); // Default to 25%
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    
    try {
      // Create a token and expiration date
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      
      // Insert invitation into the database
      const { error } = await supabase
        .from('invitations')
        .insert({
          email,
          token,
          expires_at: expiresAt.toISOString(),
          created_by: user?.id,
          status: 'pending',
          residual_percentage: residualPercentage,
          metadata: { 
            role: 'agent',
            inviteLink: `${window.location.origin}/invitation/accept?token=${token}&email=${encodeURIComponent(email)}`
          }
        });
        
      if (error) throw error;
      
      // Send the invitation email with residual percentage info
      const result = await sendInviteEmail(email, {
        residualPercentage,
        token,
        inviteLink: `${window.location.origin}/invitation/accept?token=${token}&email=${encodeURIComponent(email)}`
      });
      
      if (result.success) {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
      } else {
        throw new Error(result.message || "Failed to send invitation");
      }
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
          Invite New Agent
        </CardTitle>
        <CardDescription className="text-gray-600">
          Send an email invitation to a new agent to join your team.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleInvite}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-200 focus:border-brand-600 focus:ring-brand-600"
              />
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="residual" className="text-navy-700">
                  Residual Percentage
                </Label>
                <span className="text-sm font-medium">{residualPercentage}%</span>
              </div>
              <Slider
                id="residual"
                min={0}
                max={100}
                step={0.5}
                value={[residualPercentage]}
                onValueChange={(values) => setResidualPercentage(values[0])}
                className="py-4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set the preset residual percentage for this agent.
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
            {isSending ? "Sending..." : "Send Invitation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
