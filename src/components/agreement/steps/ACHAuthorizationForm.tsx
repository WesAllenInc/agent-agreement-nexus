import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWizard } from "../WizardContext";
import { toast } from "sonner";
import { useAutoSave } from "@/hooks/useAutoSave";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { captureException } from "@/utils/errorTracking";
import { ErrorMessage } from "@/components/ui/error-message";

// Define the schema for ACH Authorization Form validation
const achFormSchema = z.object({
  account_type: z.enum(["Checking", "Savings"], {
    required_error: "Please select an account type",
  }),
  bank_name: z.string().min(2, "Bank name is required"),
  account_number: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .max(17, "Account number cannot exceed 17 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  routing_number: z
    .string()
    .length(9, "Routing number must be exactly 9 digits")
    .regex(/^\d+$/, "Routing number must contain only digits")
    // Add ABA routing number checksum validation
    .refine((value) => {
      if (value.length !== 9) return false;
      
      // Calculate checksum based on ABA routing number algorithm
      const digits = value.split('').map(Number);
      const sum = 
        3 * (digits[0] + digits[3] + digits[6]) +
        7 * (digits[1] + digits[4] + digits[7]) +
        (digits[2] + digits[5] + digits[8]);
      
      return sum % 10 === 0;
    }, "Invalid routing number checksum"),
  bank_phone: z
    .string()
    .regex(/^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/, "Please enter a valid phone number"),
  bank_contact_name: z.string().min(2, "Contact name is required"),
  account_holder_name: z.string().min(2, "Account holder name is required"),
  check_attachment: z.any().optional(),
});

// Define the form data type based on the schema
type ACHFormValues = z.infer<typeof achFormSchema>;

// Define the interface for bank info
interface BankInfo {
  account_type: "Checking" | "Savings";
  bank_name: string;
  account_number: string;
  routing_number: string;
  bank_phone: string;
  bank_contact_name: string;
  account_holder_name: string;
  check_attachment?: any;
}

export default function ACHAuthorizationForm() {
  const { formData, setFormData, goToNextStep, goToPreviousStep } = useWizard();
  const { bank_info = {} as BankInfo } = formData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize react-hook-form with zod validation
  const form = useForm<ACHFormValues>({
    resolver: zodResolver(achFormSchema),
    defaultValues: {
      account_type: bank_info.account_type || "Checking",
      bank_name: bank_info.bank_name || "",
      account_number: bank_info.account_number || "",
      routing_number: bank_info.routing_number || "",
      bank_phone: bank_info.bank_phone || "",
      bank_contact_name: bank_info.bank_contact_name || "",
      account_holder_name: bank_info.account_holder_name || "",
      check_attachment: bank_info.check_attachment || undefined,
    },
  });

  // Enable auto-save functionality
  useAutoSave('ach-authorization');

  // Handle file upload with proper error handling
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setUploadError(null);
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please upload a valid image or PDF file");
        return null;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return null;
      }
      
      // Upload to Supabase storage
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setUploadError("User authentication required");
        return null;
      }
      
      const filePath = `${user.id}/ach/${Date.now()}_${file.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('ach_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        setUploadError("Failed to upload file. Please try again.");
        captureException(uploadError);
        return null;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ach_documents')
        .getPublicUrl(filePath);
        
      toast.success("Check uploaded successfully");
      return { path: filePath, url: publicUrl };
    } catch (error) {
      console.error("File upload error:", error);
      setUploadError("An unexpected error occurred. Please try again.");
      captureException(error);
      return null;
    }
  }, []);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const result = await handleFileUpload(file);
    if (result) {
      form.setValue("check_attachment", result, { shouldValidate: true });
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: ACHFormValues) => {
    try {
      // Save to Supabase
      const { error } = await supabase.from('ach_info').upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        account_type: values.account_type,
        bank_name: values.bank_name,
        account_number: values.account_number,
        routing_number: values.routing_number,
        bank_phone: values.bank_phone,
        bank_contact_name: values.bank_contact_name,
        account_holder_name: values.account_holder_name,
        check_attachment_path: values.check_attachment?.path,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      if (error) {
        toast.error("Failed to save ACH information");
        captureException(error);
        return;
      }
      
      // Update wizard form data
      setFormData({
        ...formData,
        bank_info: values as BankInfo,
      });
      
      // Proceed to next step
      goToNextStep();
    } catch (error) {
      toast.error("An error occurred while saving your information");
      captureException(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold mb-6">ACH Authorization Form</div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type of Account</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" inputMode="numeric" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="routing_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" inputMode="numeric" maxLength={9} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bank_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Phone #</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(123) 456-7890" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank_contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel htmlFor="check_attachment" className="block mb-2">
                  ATTACH VOIDED CHECK
                </FormLabel>
                <div className="flex flex-col gap-2">
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
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {form.getValues("check_attachment") && (
                      <span className="text-sm text-green-600">
                        Check uploaded successfully
                      </span>
                    )}
                  </div>
                  {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}
                  <p className="text-xs text-muted-foreground">
                    Please upload a voided check image or PDF (max 5MB)
                  </p>
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
                  <FormField
                    control={form.control}
                    name="account_holder_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

