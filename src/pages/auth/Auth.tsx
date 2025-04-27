
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const formVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-transparent to-primary-600/20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-auto p-6 space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <img 
              src="/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
              alt="Ireland Pay Logo" 
              className="h-24 mb-4 drop-shadow-lg"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-primary-800"
          >
            Welcome to Ireland Pay
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 border-primary-100/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary-800">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' 
                  ? "Sign in to access your account" 
                  : "Join IrelandPay as a sales agent"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <LoginForm />
                      <p className="text-center text-sm">
                        Don't have an account?{" "}
                        <button 
                          onClick={() => setMode('signup')}
                          className="text-primary hover:text-primary-600 font-medium transition-colors"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <SignUpForm />
                      <p className="text-center text-sm">
                        Already have an account?{" "}
                        <button 
                          onClick={() => setMode('login')}
                          className="text-primary hover:text-primary-600 font-medium transition-colors"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
