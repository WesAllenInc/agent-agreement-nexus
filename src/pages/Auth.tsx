
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">IrelandPay Portal</h1>
          <p className="mt-2 text-sm text-gray-600">Sales Agent Agreement Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{mode === 'login' ? 'Sign in' : 'Create account'}</CardTitle>
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
                    className="text-blue-600 hover:text-blue-500 font-medium"
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
                    className="text-blue-600 hover:text-blue-500 font-medium"
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
