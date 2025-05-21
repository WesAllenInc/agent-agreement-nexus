import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

export function OfflineNotification() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    // Function to update online status
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        toast({
          title: "You're offline",
          description: "Some features may be unavailable until you reconnect",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "You're back online",
          description: "All features are now available",
          duration: 3000,
        });
      }
    };

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [toast]);

  // Only render the alert when offline
  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md z-50 shadow-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>You're offline</AlertTitle>
      <AlertDescription>
        You're currently offline. Some features may be unavailable until you reconnect to the internet.
        The app will continue to work with cached data.
      </AlertDescription>
    </Alert>
  );
}
