
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

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    
    try {
      // Mock invitation - would be replaced with Supabase function call
      setTimeout(() => {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
        setIsSending(false);
      }, 1000);
      
      // In real implementation with Supabase:
      // 1. Call edge function to create invitation
      // 2. Function generates token and sends email
      // 3. Store invitation in database
      
    } catch (error: any) {
      toast.error("Failed to send invitation: " + (error.message || "Please try again"));
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite New Sales Agent</CardTitle>
        <CardDescription>
          Send an email invitation to a new sales agent to join the platform.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleInvite}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="sales.agent@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSending}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isSending ? "Sending..." : "Send Invitation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
