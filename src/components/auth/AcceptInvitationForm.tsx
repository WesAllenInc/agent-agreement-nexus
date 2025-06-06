import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createUserFromInvitation } from "@/api/mockEdgeFunctions";
import { Loader2, Eye, EyeOff, Lock, Mail, Percent } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFormValidation } from "@/hooks/useFormValidation";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { motion, AnimatePresence } from "framer-motion";

interface AcceptInvitationFormProps {
  token: string;
  email: string;
  residualPercent?: number;
  metadata?: Record<string, any>;
}

export default function AcceptInvitationForm({ token, email, residualPercent = 0, metadata = {} }: AcceptInvitationFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { validatePassword, validatePasswordMatch } = useFormValidation();
  const [passwordStrength, setPasswordStrength] = useState({ 
    score: 0, 
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasNumber: false,
      hasSymbol: false,
    }
  });
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validation = validatePassword(newPassword);
    setPasswordStrength(validation.strength);
    setPasswordError(validation.message);
    
    if (confirmPassword) {
      const match = validatePasswordMatch(newPassword, confirmPassword);
      setConfirmPasswordError(match.message);
    }
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    const match = validatePasswordMatch(password, newConfirmPassword);
    setConfirmPasswordError(match.message);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Debug: Starting form submission", { email, token });
    
    e.preventDefault();
    
    if (passwordError || confirmPasswordError) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Debug: Creating user account...");
      
      // Validate passwords match
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      const result = await createUserFromInvitation(token, email, password);
      
      console.log("Debug: Create user response:", { result });
      
      if (result.success) {
        console.log("Debug: Account created successfully");
        
        toast.success("Account created successfully! Redirecting to dashboard...");
        navigate("/agent/agreement");
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error("Debug: Error in form submission:", error);
      const errorMessage = error instanceof Error ? error.message : "Please try again";
      toast.error("Failed to create account: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-[400px]">
      {/* Invitation Details Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Invitation Details</CardTitle>
          <CardDescription>You've been invited with the following terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-medium">Residual Percentage</span>
              </div>
              <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
                {residualPercent}%
              </Badge>
            </div>
            
            {metadata?.role && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-brand-600" />
                  <span className="text-sm font-medium">Role</span>
                </div>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {metadata.role}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-muted pl-10"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="pl-10"
            placeholder="Create a secure password"
            required
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {passwordError && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-sm text-red-500"
            >
              {passwordError}
            </motion.p>
          )}
        </AnimatePresence>
        <PasswordStrengthMeter score={passwordStrength.score} requirements={passwordStrength.requirements} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="pl-10"
            placeholder="Confirm your password"
            required
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {confirmPasswordError && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-sm text-red-500"
            >
              {confirmPasswordError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !!passwordError || !!confirmPasswordError}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
      </form>
    </div>
  );
}

