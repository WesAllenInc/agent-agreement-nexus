import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWizard } from "../WizardContext";
import { toast } from "sonner";
import { useAutoSave } from "@/hooks/useAutoSave";

export default function ACHAuthorizationForm() {
  const { formData, setFormData, goToNextStep, goToPreviousStep } = useWizard();
  const { bank_info } = formData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useAutoSave('ach-authorization');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      bank_info: {
        ...bank_info,
        [name]: value,
      },
    });
  };

  const handleAccountTypeChange = (value: string) => {
    setFormData({
      ...formData,
      bank_info: {
        ...bank_info,
        account_type: value as "Checking" | "Savings",
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.success("Check uploaded successfully");

    setFormData({
      ...formData,
      bank_info: {
        ...bank_info,
        check_attachment: URL.createObjectURL(file),
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-semibold mb-6">ACH Authorization Form</div>

          <div className="space-y-6">
            <div>
              <Label>Type of Account</Label>
              <RadioGroup
                value={bank_info.account_type}
                onValueChange={handleAccountTypeChange}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Checking" id="checking" />
                  <Label htmlFor="checking">Checking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Savings" id="savings" />
                  <Label htmlFor="savings">Savings</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={bank_info.bank_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  value={bank_info.account_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="routing_number">Routing#</Label>
                <Input
                  id="routing_number"
                  name="routing_number"
                  value={bank_info.routing_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="bank_phone">Bank Phone #</Label>
                <Input
                  id="bank_phone"
                  name="bank_phone"
                  value={bank_info.bank_phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bank_contact_name">Bank Contact Name</Label>
                <Input
                  id="bank_contact_name"
                  name="bank_contact_name"
                  value={bank_info.bank_contact_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="check_attachment" className="block mb-2">
                ATTACH VOIDED CHECK
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Check
                </Button>
                <input
                  ref={fileInputRef}
                  id="check_attachment"
                  name="check_attachment"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {bank_info.check_attachment && (
                  <span className="text-sm text-green-600">
                    Check uploaded
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-lg font-medium mb-4">
                Authorization
              </div>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p>
                  I authorize the WLJ Innovations LLC, DBA Ireland Pay, Service Provider, and/or bank to electronically credit or debit the bank account listed above which I am an authorized signor as identified above to the terms stated here and if necessary to electronically credit or debit the bank account to correct erroneous payments.
                </p>
                <p className="mt-2">
                  ACH Debits will include, but not be limited to (Cost of equipment, deployment, shipping, etc.) or ACH credits (commissions, residual payments and bonuses). This authorization shall remain in effect until the Business or Person identified above receives written notification from me of my intent to terminate and revoke this authorization at such time and in such manner as to afford the Business identified above, the Service Provider, and/or the bank reasonable opportunity to act (Minimum 30 days).
                </p>
              </div>

              <div className="mt-4">
                <Label htmlFor="account_holder_name">Account Holder Name</Label>
                <Input
                  id="account_holder_name"
                  name="account_holder_name"
                  value={bank_info.account_holder_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

