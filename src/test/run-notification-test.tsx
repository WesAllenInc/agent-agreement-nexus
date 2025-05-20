import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { simulateAgreementStatusChange, runCompleteStatusChangeTest } from './notification-test';

export default function NotificationTester() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [agreementId, setAgreementId] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableAgreements, setAvailableAgreements] = useState<any[]>([]);

  useEffect(() => {
    // Fetch available agreements for the current user
    if (user) {
      fetchUserAgreements();
    }
  }, [user]);

  const fetchUserAgreements = async () => {
    try {
      const { data, error } = await supabase
        .from('agreements')
        .select('id, file_name, status')
        .eq('user_id', user?.id);

      if (error) throw error;
      setAvailableAgreements(data || []);
    } catch (error) {
      console.error('Error fetching agreements:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch agreements',
        variant: 'destructive',
      });
    }
  };

  const logResult = (message: string, success: boolean = true) => {
    setTestResults(prev => [
      {
        id: Date.now(),
        message,
        success,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const runSingleStatusChange = async (status: 'pending' | 'signed' | 'approved') => {
    if (!agreementId) {
      toast({
        title: 'Error',
        description: 'Please enter an agreement ID',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      logResult(`Starting status change to ${status}...`);
      const result = await simulateAgreementStatusChange(agreementId, status, user?.id);
      
      if (result.success) {
        logResult(`Successfully changed status to ${status}`);
        toast({
          title: 'Success',
          description: `Agreement status changed to ${status}`,
        });
      } else {
        logResult(`Failed to change status to ${status}: ${result.error?.message}`, false);
        toast({
          title: 'Error',
          description: `Failed to change status: ${result.error?.message}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      logResult(`Error changing status to ${status}: ${error.message}`, false);
      toast({
        title: 'Error',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const runFullTest = async () => {
    if (!agreementId) {
      toast({
        title: 'Error',
        description: 'Please enter an agreement ID',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      logResult('Starting full test sequence (pending → signed → approved)...');
      
      // Run the complete test
      const result = await runCompleteStatusChangeTest(agreementId, user?.id);
      
      if (result.success) {
        logResult('Full test sequence completed successfully');
        toast({
          title: 'Success',
          description: 'Full test sequence completed',
        });
      } else {
        logResult(`Full test sequence failed: ${result.error?.message}`, false);
        toast({
          title: 'Error',
          description: `Test failed: ${result.error?.message}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      logResult(`Error during full test: ${error.message}`, false);
      toast({
        title: 'Error',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Notification System Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Agreement Status Notifications</CardTitle>
            <CardDescription>
              Test the notification system by changing agreement status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agreementId">Agreement ID</Label>
                <Input
                  id="agreementId"
                  placeholder="Enter agreement ID"
                  value={agreementId}
                  onChange={(e) => setAgreementId(e.target.value)}
                />
              </div>
              
              {availableAgreements.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Agreements</Label>
                  <div className="grid gap-2">
                    {availableAgreements.map((agreement) => (
                      <Button
                        key={agreement.id}
                        variant="outline"
                        onClick={() => setAgreementId(agreement.id)}
                        className="justify-between"
                      >
                        <span className="truncate">{agreement.file_name}</span>
                        <span className="ml-2 text-xs bg-secondary px-2 py-1 rounded-full">
                          {agreement.status}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button 
                onClick={() => runSingleStatusChange('pending')} 
                disabled={loading}
                variant="outline"
              >
                Set Pending
              </Button>
              <Button 
                onClick={() => runSingleStatusChange('signed')} 
                disabled={loading}
                variant="outline"
              >
                Set Signed
              </Button>
              <Button 
                onClick={() => runSingleStatusChange('approved')} 
                disabled={loading}
                variant="outline"
              >
                Set Approved
              </Button>
            </div>
            <Button 
              onClick={runFullTest} 
              disabled={loading} 
              className="w-full"
            >
              Run Full Test Sequence
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results of notification tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No test results yet
                </p>
              ) : (
                testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-md ${
                      result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {result.success ? '✅' : '❌'} {result.message}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => setTestResults([])}
              className="w-full"
            >
              Clear Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
