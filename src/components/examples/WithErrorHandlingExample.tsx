import React, { useState } from 'react';
import { withErrorHandling } from '@/components/hoc/withErrorHandling';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Base component that will be wrapped
function UserProfile({ user }: { user: { id: string; name: string; email: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Wrap the component with error handling
const UserProfileWithErrorHandling = withErrorHandling(UserProfile, {
  loadingText: 'Loading user profile...',
  errorTitle: 'Error Loading Profile',
});

// Example component that demonstrates the HOC usage
export function WithErrorHandlingExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  // Simulate fetching user data
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly succeed or fail to demonstrate error handling
      const random = Math.random();
      
      if (random < 0.3) {
        throw new Error('Failed to fetch user data. Please try again.');
      }
      
      setUser({
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchUser();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Profile Example</h2>
        <Button onClick={fetchUser} disabled={loading}>
          {user ? 'Refresh User' : 'Load User'}
        </Button>
      </div>
      
      {user || loading || error ? (
        <UserProfileWithErrorHandling
          user={user as any}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Click the button to load user data</p>
          </CardContent>
        </Card>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>This example demonstrates the withErrorHandling HOC.</p>
        <p>It has a 30% chance of simulating an error to show error handling.</p>
      </div>
    </div>
  );
}

export default WithErrorHandlingExample;
