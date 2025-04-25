import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWizard } from "../WizardContext";
import { useAutoSave } from "@/hooks/useAutoSave";

export default function PartnerApplicationForm() {
  const { formData, setFormData, goToNextStep } = useWizard();
  const { partner_info } = formData;

  // Enable auto-save for this form
  useAutoSave('partner-application');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      partner_info: {
        ...partner_info,
        [name]: value,
      },
    });
  };

  const handleBusinessTypeChange = (value: string) => {
    setFormData({
      ...formData,
      partner_info: {
        ...partner_info,
        business_type: value as "Corp" | "LLC" | "Sole Prop" | "Other",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-semibold">Partner Application</div>
            <div className="text-sm text-muted-foreground animate-fade-in">
              Auto-saving...
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={partner_info.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  value={partner_info.middle_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={partner_info.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="legal_business_name">Legal Business Name</Label>
              <Input
                id="legal_business_name"
                name="legal_business_name"
                value={partner_info.legal_business_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Business Type</Label>
              <RadioGroup
                value={partner_info.business_type}
                onValueChange={handleBusinessTypeChange}
                className="flex flex-wrap gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Corp" id="corp" />
                  <Label htmlFor="corp">Corp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LLC" id="llc" />
                  <Label htmlFor="llc">LLC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sole Prop" id="sole-prop" />
                  <Label htmlFor="sole-prop">Sole Prop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  name="tax_id"
                  value={partner_info.tax_id}
                  onChange={handleChange}
                  required={partner_info.business_type !== "Sole Prop"}
                />
              </div>
              <div>
                <Label htmlFor="ss_number">SS# (if sole prop)</Label>
                <Input
                  id="ss_number"
                  name="ss_number"
                  value={partner_info.ss_number}
                  onChange={handleChange}
                  required={partner_info.business_type === "Sole Prop"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="business_address">Business Address</Label>
              <Input
                id="business_address"
                name="business_address"
                value={partner_info.business_address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="business_city">City</Label>
                <Input
                  id="business_city"
                  name="business_city"
                  value={partner_info.business_city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_state">State</Label>
                <Input
                  id="business_state"
                  name="business_state"
                  value={partner_info.business_state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_zip">ZIP</Label>
                <Input
                  id="business_zip"
                  name="business_zip"
                  value={partner_info.business_zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="business_phone">Phone</Label>
                <Input
                  id="business_phone"
                  name="business_phone"
                  value={partner_info.business_phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_fax">FAX</Label>
                <Input
                  id="business_fax"
                  name="business_fax"
                  value={partner_info.business_fax}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={partner_info.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-lg font-medium mb-4">Home Address</div>
              <div>
                <Label htmlFor="home_address">Home Address</Label>
                <Input
                  id="home_address"
                  name="home_address"
                  value={partner_info.home_address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
                <div>
                  <Label htmlFor="home_city">City</Label>
                  <Input
                    id="home_city"
                    name="home_city"
                    value={partner_info.home_city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="home_state">State</Label>
                  <Input
                    id="home_state"
                    name="home_state"
                    value={partner_info.home_state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="home_zip">ZIP</Label>
                  <Input
                    id="home_zip"
                    name="home_zip"
                    value={partner_info.home_zip}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="home_phone">Home Phone</Label>
                <Input
                  id="home_phone"
                  name="home_phone"
                  value={partner_info.home_phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Continue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
