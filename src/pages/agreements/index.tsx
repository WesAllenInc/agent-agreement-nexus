import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Agreement } from '@/hooks/useAgreement';
import { toast } from 'sonner';

export default function AgreementsList() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to view agreements');
      navigate('/login');
      return;
    }

    const fetchAgreements = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('agreements')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAgreements(data || []);
      } catch (err: any) {
        console.error('Error fetching agreements:', err);
        toast.error(`Error: ${err.message || 'Failed to load agreements'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'viewed':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Signed';
      case 'viewed':
        return 'Viewed';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading agreements...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Agreements</h1>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {agreements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Agreements Found</h2>
            <p className="text-muted-foreground text-center mb-6">
              You don't have any agreements assigned to you yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {agreements.map((agreement) => (
            <Card key={agreement.id} className="overflow-hidden">
              <div className="flex items-center p-6">
                <div className="mr-4">
                  {getStatusIcon(agreement.status)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{agreement.file_name}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Uploaded on {format(new Date(agreement.created_at), 'PPP')}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-muted">
                        {getStatusText(agreement.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link to={`/agreements/${agreement.id}`}>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
