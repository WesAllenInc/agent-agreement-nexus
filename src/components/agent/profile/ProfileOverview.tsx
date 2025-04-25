
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function ProfileOverview() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        
        <div className="grid gap-2 text-sm">
          <div>
            <span className="font-medium">Phone: </span>
            {profile?.phone || 'Not provided'}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => navigate('/agent/profile')}>
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
