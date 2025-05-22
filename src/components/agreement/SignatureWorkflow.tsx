import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAgreementSignature } from '@/hooks/useAgreementSignature';
import { CheckCircle, Info, AlertTriangle, Loader2, Download, Pen } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { useStore } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';

interface SignatureWorkflowProps {
  agreementId: string;
  agreementTitle: string;
  onComplete?: () => void;
}

export const SignatureWorkflow: React.FC<SignatureWorkflowProps> = ({
  agreementId,
  agreementTitle,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState('review');
  const [hasRead, setHasRead] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { addNotification } = useStore();
  const navigate = useNavigate();
  
  const { 
    saveSignature, 
    getSignatureUrl, 
    signatureExists, 
    isLoading: signatureLoading 
  } = useAgreementSignature(agreementId);

  // Check if signature already exists on load
  useEffect(() => {
    const checkExistingSignature = async () => {
      const exists = await signatureExists();
      if (exists) {
        setActiveTab('complete');
        setProgress(100);
      }
    };
    
    checkExistingSignature();
  }, [agreementId, signatureExists]);

  // Update progress based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'review':
        setProgress(hasRead ? 33 : 0);
        break;
      case 'sign':
        setProgress(66);
        break;
      case 'complete':
        setProgress(100);
        break;
      default:
        setProgress(0);
    }
  }, [activeTab, hasRead]);

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSubmitSignature = async () => {
    if (!signatureRef.current) return;
    
    if (signatureRef.current.isEmpty()) {
      toast.error('Please provide a signature before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert signature to data URL
      const signatureDataUrl = signatureRef.current.toDataURL('image/png');
      
      // Save signature
      await saveSignature(signatureDataUrl);
      
      // Move to complete tab
      setActiveTab('complete');
      
      // Show success notification
      toast.success('Agreement signed successfully');
      
      // Add to global notifications
      addNotification({
        message: `You have signed the agreement: ${agreementTitle}`,
        type: 'success'
      });
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error(`Failed to save signature: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSigned = async () => {
    try {
      // Call getSignatureUrl without parameters, it will fetch the signature path internally
      const signatureUrl = await getSignatureUrl();
      if (signatureUrl) {
        window.open(signatureUrl, '_blank');
      } else {
        toast.error('Signed agreement not found');
      }
    } catch (error) {
      toast.error(`Failed to download signed agreement: ${error.message}`);
    }
  };

  if (signatureLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading signature information...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agreement Signature Process</CardTitle>
        <CardDescription>
          Complete the following steps to sign the agreement
        </CardDescription>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review" disabled={activeTab === 'complete'}>
            1. Review
          </TabsTrigger>
          <TabsTrigger value="sign" disabled={!hasRead || activeTab === 'complete'}>
            2. Sign
          </TabsTrigger>
          <TabsTrigger value="complete" disabled={activeTab !== 'complete'}>
            3. Complete
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="review">
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Please review the agreement carefully before proceeding to sign.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox 
                id="agreement-read" 
                checked={hasRead} 
                onCheckedChange={(checked) => setHasRead(checked === true)}
              />
              <Label htmlFor="agreement-read" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have read and understood the agreement
              </Label>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={() => setActiveTab('sign')} 
              disabled={!hasRead}
              className="ml-auto"
            >
              Continue to Sign
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="sign">
          <CardContent>
            <Alert className="mb-4" variant="default">
              <Pen className="h-4 w-4" />
              <AlertTitle>Electronic Signature</AlertTitle>
              <AlertDescription>
                Draw your signature in the box below. This electronic signature will be legally binding.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 border rounded-md p-1 bg-background">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: 'signature-canvas w-full h-40 border border-input rounded-sm',
                  style: { backgroundColor: 'white' }
                }}
                backgroundColor="white"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSignature}
              className="mt-2"
            >
              Clear
            </Button>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('review')}
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmitSignature} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Signature'
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="complete">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Agreement Signed Successfully</h3>
              <p className="text-muted-foreground">
                Thank you for signing the agreement. You can download a copy of the signed document for your records.
              </p>
              
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={handleDownloadSigned}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Signed Agreement
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/agreements')}
              variant="ghost"
            >
              Return to Agreements
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SignatureWorkflow;
