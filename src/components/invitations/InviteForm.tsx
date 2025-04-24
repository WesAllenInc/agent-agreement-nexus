
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
import { sendInviteEmail } from "@/api/mockEdgeFunctions";

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
      // Call the sendInviteEmail function (mock in development, real in production)
      const result = await sendInviteEmail(email);
      
      if (result.success) {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
      } else {
        throw new Error(result.error || "Failed to send invitation");
      }
    } catch (error: any) {
      toast.error("Failed to send invitation: " + (error.message || "Please try again"));
    } finally {
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
