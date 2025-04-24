
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import AcceptInvitation from "@/pages/AcceptInvitation";
import Agreement from "@/pages/agent/Agreement";
import Confirmation from "@/pages/agent/Confirmation";
import Dashboard from "@/pages/admin/Dashboard";
import Invitations from "@/pages/admin/Invitations";
import Agreements from "@/pages/admin/Agreements";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          
          {/* Agent Routes */}
          <Route path="/agent/agreement" element={<Agreement />} />
          <Route path="/agent/confirmation" element={<Confirmation />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invitations" element={<Invitations />} />
          <Route path="/agreements" element={<Agreements />} />
          <Route path="/agents" element={<Agreements />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
