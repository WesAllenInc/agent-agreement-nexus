
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWizard } from "../WizardContext";
import SignatureCanvas from "../SignatureCanvas";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function SignatureStep() {
  const { formData, setFormData, goToPreviousStep, setIsComplete } = useWizard();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureDate, setSignatureDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const handleSaveSignature = (signatureData: string) => {
    setFormData({
      ...formData,
      signature_data: signatureData,
    });
    toast.success("Signature saved");
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
    
    setIsSubmitting(true);
    
    try {
      // Mock submission - would be replaced with Supabase call
      // This is just for demo purposes
      setTimeout(() => {
        setIsComplete(true);
        setIsSubmitting(false);
        toast.success("Agreement signed successfully!");
        navigate("/agent/confirmation");
      }, 1500);
      
      // In real implementation with Supabase:
      // 1. Save agreement data to database
      // 2. Upload signature image to storage
      // 3. Update agreement status to 'signed'
      // 4. Navigate to confirmation page
      
    } catch (error: any) {
      toast.error("Failed to submit agreement: " + (error.message || "Please try again"));
      setIsSubmitting(false);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="signature_date">Date</Label>
                  <Input
                    id="signature_date"
                    type="date"
                    value={signatureDate}
                    onChange={handleDateChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Signature</Label>
                  <div className="mt-2">
                    <SignatureCanvas
                      onSave={handleSaveSignature}
                      existingSignature={formData.signature_data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.signature_data}>
            {isSubmitting ? "Submitting..." : "Submit Agreement"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
