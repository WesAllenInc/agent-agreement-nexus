
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWizard } from "../WizardContext";
import SignatureCanvas from "../SignatureCanvas";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAgreementSignature } from "@/hooks/useAgreementSignature";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function SignatureStep() {
  const { formData, setFormData, goToPreviousStep, setIsComplete } = useWizard();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [signatureDate, setSignatureDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [error, setError] = useState<string | null>(null);
  // Create a mock agreement ID for demonstration purposes
  // In a real implementation, this would come from the URL params or context
  const [agreementId, setAgreementId] = useState<string>(
    `mock-agreement-${Date.now()}`
  );
  
  // Use the agreement signature hook
  const { signature, loading, fetchSignature, saveSignature } = useAgreementSignature(agreementId);
  
  // Fetch any existing signature when the component loads
  useEffect(() => {
    const getExistingSignature = async () => {
      try {
        const existingSignature = await fetchSignature();
        if (existingSignature) {
          // If we have an existing signature, update the form data
          toast.info("This agreement has already been signed");
        }
      } catch (err) {
        console.error("Error fetching existing signature:", err);
      }
    };
    
    if (agreementId) {
      getExistingSignature();
    }
  }, [agreementId, fetchSignature]);

  const handleSaveSignature = (signatureData: string) => {
    setFormData({
      ...formData,
      signature_data: signatureData,
    });
    toast.success("Signature saved locally");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignatureDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.signature_data) {
      toast.error("Please sign the agreement before submitting");
      return;
    }
    
    setError(null);
    
    try {
      // Use the saveSignature method from the hook to save to Supabase
      const result = await saveSignature(formData.signature_data);
      
      if (result) {
        setIsComplete(true);
        toast.success("Agreement signed successfully!");
        navigate("/agent/confirmation");
      } else {
        throw new Error("Failed to save signature");
      }
    } catch (error: any) {
      console.error("Error submitting signature:", error);
      setError("Failed to submit agreement: " + (error.message || "Please try again"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-semibold mb-6">Review & Sign</div>

          <div className="space-y-8">
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-2">Partner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {formData.partner_info.first_name} {formData.partner_info.middle_name} {formData.partner_info.last_name}
                </div>
                <div>
                  <span className="font-medium">Business:</span>{" "}
                  {formData.partner_info.legal_business_name}
                </div>
                <div>
                  <span className="font-medium">Business Type:</span>{" "}
                  {formData.partner_info.business_type}
                </div>
                <div>
                  <span className="font-medium">Tax ID:</span> {formData.partner_info.tax_id}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {formData.partner_info.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  {formData.partner_info.business_phone}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Address:</span>{" "}
                  {formData.partner_info.business_address}, {formData.partner_info.business_city}, {formData.partner_info.business_state} {formData.partner_info.business_zip}
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-2">Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Bank Name:</span>{" "}
                  {formData.bank_info.bank_name}
                </div>
                <div>
                  <span className="font-medium">Account Type:</span>{" "}
                  {formData.bank_info.account_type}
                </div>
                <div>
                  <span className="font-medium">Account #:</span>{" "}
                  {formData.bank_info.account_number.replace(/\d(?=\d{4})/g, "*")}
                </div>
                <div>
                  <span className="font-medium">Routing #:</span>{" "}
                  {formData.bank_info.routing_number}
                </div>
                <div>
                  <span className="font-medium">Account Holder:</span>{" "}
                  {formData.bank_info.account_holder_name}
                </div>
                <div>
                  <span className="font-medium">Bank Contact:</span>{" "}
                  {formData.bank_info.bank_contact_name}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-lg font-semibold mb-4">Agreement Signature</div>
              <p className="text-sm mb-4">
                By signing below, I acknowledge that I have read and agree to the terms and conditions of the Sales Agent Agreement, Partner Application, and ACH Authorization Form.
              </p>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => setError(null)}
                  >
                    Try Again
                  </Button>
                </Alert>
              )}
              
              {signature ? (
                <Alert className="mb-4 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Agreement Already Signed</AlertTitle>
                  <AlertDescription>
                    This agreement was signed on {format(new Date(signature.signed_at), "PPP")}.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="signature_date">Date</Label>
                    <Input
                      id="signature_date"
                      type="date"
                      value={signatureDate}
                      onChange={handleDateChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Signature</Label>
                    <div className="mt-2">
                      {loading ? (
                        <div className="flex items-center justify-center h-40 border rounded-md">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : (
                        <SignatureCanvas
                          onSave={handleSaveSignature}
                          existingSignature={formData.signature_data}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>
          {signature ? (
            <Button type="button" onClick={() => navigate("/agent/confirmation")}>
              Continue
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={loading || !formData.signature_data}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Agreement"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

