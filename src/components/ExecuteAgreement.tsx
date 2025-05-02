import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ExecuteAgreementParams } from '../types/agreement';
import { Check, Pen, X } from 'lucide-react';

interface ExecuteAgreementProps {
  agreementId: string;
  agreementName: string;
  onExecute: (params: ExecuteAgreementParams) => void;
  isExecuting: boolean;
}

export function ExecuteAgreement({ 
  agreementId, 
  agreementName,
  onExecute, 
  isExecuting 
}: ExecuteAgreementProps) {
  const [open, setOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const validateForm = () => {
    const isNameValid = agentName.trim().length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentEmail);
    const isSignatureValid = signatureRef.current && !signatureRef.current.isEmpty();
    
    setIsValid(isNameValid && isEmailValid && isSignatureValid);
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      validateForm();
    }
  };

  const handleSubmit = () => {
    if (!signatureRef.current || !isValid) return;
    
    const signatureData = signatureRef.current.toDataURL();
    
    onExecute({
      agreementId,
      agentName,
      agentEmail,
      signatureData
    });
    
    // Close the dialog after submission
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => {
            setAgentName('');
            setAgentEmail('');
            setTimeout(() => {
              if (signatureRef.current) {
                signatureRef.current.clear();
              }
            }, 100);
          }}
        >
          <Pen className="h-4 w-4" />
          Execute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Execute Sales Agent Agreement</DialogTitle>
          <DialogDescription>
            Complete the form below to execute the agreement: {agreementName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="agent-name" className="col-span-4">
              Agent Name
            </Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => {
                setAgentName(e.target.value);
                validateForm();
              }}
              className="col-span-4"
              placeholder="Enter agent's full name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="agent-email" className="col-span-4">
              Agent Email
            </Label>
            <Input
              id="agent-email"
              type="email"
              value={agentEmail}
              onChange={(e) => {
                setAgentEmail(e.target.value);
                validateForm();
              }}
              className="col-span-4"
              placeholder="Enter agent's email address"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="col-span-4">
              Agent Signature
            </Label>
            <Card className="col-span-4 p-1 border-2 border-dashed">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: 'signature-canvas w-full h-[150px]',
                }}
                onEnd={validateForm}
              />
            </Card>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSignature}
              className="col-span-4"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Signature
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isValid || isExecuting}
            className="flex items-center gap-2"
          >
            {isExecuting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Execute Agreement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
