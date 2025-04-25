
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import AcceptInvitation from "@/pages/AcceptInvitation";
import Agreement from "@/pages/agent/Agreement";
import Confirmation from "@/pages/agent/Confirmation";
import Dashboard from "@/pages/admin/Dashboard";
import Invitations from "@/pages/admin/Invitations";
import Agreements from "@/pages/admin/Agreements";
import UsersManagement from "@/pages/admin/Users";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/agent/Profile";
import Auth from "@/pages/Auth";
import AgentDashboard from "@/pages/agent/Dashboard";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { session, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/agent/agreement" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
            
            {/* Agent Routes */}
            <Route 
              path="/agent/dashboard" 
              element={
                <ProtectedRoute>
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/agreement" 
              element={
                <ProtectedRoute>
                  <Agreement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/confirmation" 
              element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute adminOnly>
                  <UsersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/invitations" 
              element={
                <ProtectedRoute adminOnly>
                  <Invitations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agreements" 
              element={
                <ProtectedRoute adminOnly>
                  <Agreements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agents" 
              element={
                <ProtectedRoute adminOnly>
                  <Agreements />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
