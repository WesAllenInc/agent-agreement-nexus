import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, AlertCircle, CheckCircle, LockIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema with validation
const achFormSchema = z.object({
  bankName: z.string().min(2, {
    message: "Bank name must be at least 2 characters.",
  }),
  routingNumber: z
    .string()
    .length(9, { message: "Routing number must be exactly 9 digits." })
    .regex(/^[0-9]+$/, { message: "Routing number must contain only digits." }),
  accountNumber: z
    .string()
    .min(4, { message: "Account number must be at least 4 digits." })
    .max(17, { message: "Account number must be at most 17 digits." })
    .regex(/^[0-9]+$/, { message: "Account number must contain only digits." }),
  confirmAccountNumber: z.string(),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

type AchFormValues = z.infer<typeof achFormSchema>;

export default function AchInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Define form with validation
  const form = useForm<AchFormValues>({
    resolver: zodResolver(achFormSchema),
    defaultValues: {
      bankName: "",
      routingNumber: "",
      accountNumber: "",
      confirmAccountNumber: "",
    },
  });

  const onSubmit = async (values: AchFormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit ACH information");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert ACH info into the database
      const { error } = await supabase.from("ach_info").insert({
        user_id: user.id,
        bank_name: values.bankName,
        routing_number: values.routingNumber,
        account_number: values.accountNumber,
      });

      if (error) {
        throw error;
      }

      // Show success message
      setIsSuccess(true);
      toast.success("Banking information saved successfully");

      // Reset form
      form.reset();

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/agent/dashboard");
      }, 3000);
    } catch (error: any) {
      console.error("Error saving ACH info:", error);
      toast.error(error.message || "Failed to save banking information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Banking Information
        </CardTitle>
        <CardDescription className="text-center">
          Please provide your ACH information for commission payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Information Saved</AlertTitle>
            <AlertDescription className="text-green-700">
              Your banking information has been securely saved. You will be redirected shortly.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="9-digit routing number"
                          {...field}
                          maxLength={9}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The 9-digit number on the bottom left of your check
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Account number"
                          {...field}
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={17}
                        />
                        <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The account number on the bottom of your check (4-17 digits)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Account Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm account number"
                          {...field}
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={17}
                        />
                        <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Secure Storage</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Your banking information is encrypted and stored securely. Only authorized personnel can access this information.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Banking Information"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
