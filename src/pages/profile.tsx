import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Then try to get role data from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', user?.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }

      // Combine the data
      const combinedData: ProfileData = {
        id: user?.id || '',
        full_name: profileData?.full_name || profileData?.first_name + ' ' + profileData?.last_name || '',
        email: profileData?.email || user?.email || '',
        phone_number: profileData?.phone_number || profileData?.phone || '',
        role: roleData?.role || profileData?.role || 'agent',
        status: roleData?.status || 'pending',
        created_at: profileData?.created_at || new Date().toISOString()
      };

      setProfileData(combinedData);
      setFormData({
        full_name: combinedData.full_name,
        email: combinedData.email,
        phone_number: combinedData.phone_number
      });
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      setError(error.message || 'Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      fetchProfileData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading profile data...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              View and update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
                <Button 
                  variant="link" 
                  className="p-0 ml-2 text-red-700 underline"
                  onClick={fetchProfileData}
                >
                  Try again
                </Button>
              </div>
            )}

            <div className="mb-6 p-4 bg-muted rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Account Status</span>
                  <div className="mt-1">{profileData?.status && getStatusBadge(profileData.status)}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Role</span>
                  <div className="mt-1 capitalize">{profileData?.role || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">User ID</span>
                  <div className="mt-1 text-sm text-muted-foreground truncate">{profileData?.id || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
