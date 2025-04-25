
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="text-center flex flex-col items-center">
          <img 
            src="/ireland-pay-logo.png" 
            alt="Ireland Pay Logo" 
            className="h-12 mb-4"  // Reduced from h-16 to h-12
          />
          <p className="mt-2 text-sm text-gray-600">Sales Agent Portal</p>
        </div>

        <Card className="card-gradient shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary-800">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? (
              <div className="space-y-4">
                <LoginForm />
                <div className="text-center text-sm">
                  New to IrelandPay?{" "}
                  <button 
                    onClick={() => setMode('signup')}
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <SignUpForm />
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setMode('login')}
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
