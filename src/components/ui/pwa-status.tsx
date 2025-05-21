import { Info, Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { usePWA } from '@/hooks/usePWA';

/**
 * Component that displays the PWA status and installation options
 */
export function PWAStatus() {
  const { isPWA, canInstall, deferredPrompt, promptInstall, isOnline } = usePWA();
  const { toast } = useToast();

  // Handle install button click
  const handleInstallClick = async () => {
    try {
      const installed = await promptInstall();
      if (installed) {
        toast({
          title: "Thank you for installing our app!",
          description: "You can now use the app offline.",
        });
      } else {
        toast({
          title: "Installation declined",
          description: "You can install the app later from the settings menu.",
        });
      }
    } catch (error) {
      toast({
        title: "Installation not available",
        description: "The app cannot be installed at this time.",
        variant: "destructive",
      });
    }
  };

  // If running as PWA, don't show the component
  if (isPWA) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
          PWA Status
        </CardTitle>
        <CardDescription>
          {isOnline 
            ? "You're currently online. The app will cache content for offline use." 
            : "You're currently offline. Some features may be limited."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span>
              {isPWA 
                ? "You're using the installed app version." 
                : canInstall && deferredPrompt 
                  ? "This app can be installed on your device for offline use." 
                  : "This app supports offline use through your browser."}
            </span>
          </div>
        </div>
      </CardContent>
      {canInstall && deferredPrompt && (
        <CardFooter>
          <Button 
            onClick={handleInstallClick}
            className="w-full"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
