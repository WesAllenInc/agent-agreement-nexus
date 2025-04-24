
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication error params in the URL
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error') || url.hash.includes('error=');
    const errorDescription = url.searchParams.get('error_description') || 
                              url.hash.match(/error_description=([^&]*)/)?.[1];

    if (error) {
      console.error("Auth error:", error, errorDescription);
      toast.error(`Authentication error: ${decodeURIComponent(errorDescription || 'Unknown error')}`);
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("User already logged in, redirecting...");
        navigate('/agent/agreement');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-800">IrelandPay Portal</h1>
          <p className="mt-2 text-sm text-gray-600">Sales Agent Agreement Portal</p>
        </div>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-primary-800">{mode === 'login' ? 'Sign in' : 'Create account'}</CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? "Enter your credentials to access your account" 
                : "Sign up to join IrelandPay as a sales agent"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? (
              <div className="space-y-4">
                <LoginForm />
                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setMode('signup')}
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <SignUpForm />
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setMode('login')}
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
