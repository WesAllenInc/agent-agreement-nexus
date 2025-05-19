import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function PendingApproval() {
  const { userStatus, signOut } = useAuth();
  
  const getStatusInfo = () => {
    switch (userStatus) {
      case 'pending':
        return {
          icon: <Clock className="h-12 w-12 text-amber-500 mb-4" />,
          title: 'Account Pending Approval',
          description: 'Your account is currently pending approval by an administrator.',
          message: 'Please check back later or contact your administrator for more information.'
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500 mb-4" />,
          title: 'Account Rejected',
          description: 'Your account application has been rejected.',
          message: 'Please contact your administrator for more information or to appeal this decision.'
        };
      case 'review':
        return {
          icon: <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />,
          title: 'Account Under Review',
          description: 'Your account is currently under review by an administrator.',
          message: 'This typically happens when additional verification is needed. Please check back later or contact your administrator.'
        };
      default:
        return {
          icon: <Clock className="h-12 w-12 text-amber-500 mb-4" />,
          title: 'Account Status Pending',
          description: 'Your account status is being processed.',
          message: 'Please check back later or contact your administrator for more information.'
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            {statusInfo.icon}
          </div>
          <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
          <CardDescription>{statusInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600">
            <p className="mb-4">{statusInfo.message}</p>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Next Steps:</h3>
              <ul className="list-disc list-inside text-left space-y-2">
                <li>Ensure you have completed all required training modules</li>
                <li>Make sure you have signed all required agreements</li>
                <li>Contact your administrator if this status persists for more than 48 hours</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
