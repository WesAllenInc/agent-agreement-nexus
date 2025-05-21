import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateOfflineCapability, simulateOfflineMode } from '@/utils/pwa-validation';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Developer tools component for testing PWA functionality
 * Only visible in development mode
 */
export function PWADevTools() {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }
  
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateOfflineCapability();
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        success: false,
        message: `Error during validation: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const toggleOfflineMode = (checked: boolean) => {
    simulateOfflineMode(checked);
    setIsOfflineMode(checked);
  };
  
  return (
    <Card className="mt-6 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          PWA Developer Tools
        </CardTitle>
        <CardDescription>
          Tools for testing and validating PWA functionality (only visible in development)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="simulate">
          <TabsList className="mb-4">
            <TabsTrigger value="simulate">Simulate</TabsTrigger>
            <TabsTrigger value="validate">Validate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulate">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="offline-mode" 
                  checked={isOfflineMode}
                  onCheckedChange={toggleOfflineMode}
                />
                <Label htmlFor="offline-mode" className="flex items-center gap-2">
                  {isOfflineMode ? (
                    <>
                      <WifiOff className="h-4 w-4 text-red-500" />
                      Offline Mode (Simulated)
                    </>
                  ) : (
                    <>
                      <Wifi className="h-4 w-4 text-green-500" />
                      Online Mode (Normal)
                    </>
                  )}
                </Label>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {isOfflineMode ? (
                  <p>
                    Network requests are being blocked to simulate offline mode.
                    The app should use cached resources and show appropriate offline UI.
                  </p>
                ) : (
                  <p>
                    The app is operating in normal online mode.
                    Toggle the switch above to simulate offline behavior.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="validate">
            <div className="space-y-4">
              <Button 
                onClick={handleValidate} 
                disabled={isValidating}
                variant="outline"
                className="w-full"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Validate PWA Configuration
                  </>
                )}
              </Button>
              
              {validationResult && (
                <div className={`mt-4 p-4 rounded-md ${
                  validationResult.success 
                    ? 'bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                    : 'bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800'
                }`}>
                  <h3 className={`font-medium ${
                    validationResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {validationResult.success ? 'Validation Passed' : 'Validation Failed'}
                  </h3>
                  <p className="mt-1 text-sm">{validationResult.message}</p>
                  
                  {validationResult.details && (
                    <pre className="mt-2 text-xs overflow-auto p-2 bg-black/5 rounded">
                      {JSON.stringify(validationResult.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Note: These tools are only meant for development and testing purposes.
      </CardFooter>
    </Card>
  );
}
