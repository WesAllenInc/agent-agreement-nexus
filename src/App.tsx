import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Invitations from "./pages/admin/Invitations";
import Agreements from "./pages/admin/Agreements";
import AgreementDetails from "./pages/admin/AgreementDetails";
import Agreement from "./pages/agent/Agreement";
import AcceptInvitation from "./pages/AcceptInvitation";
import Agents from "./pages/admin/Agents";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentDocuments from "./pages/agent/AgentDocuments";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/auth/Auth";
import Index from "./pages/Index"; 
import { TestAgreementUpload } from "./pages/TestAgreementUpload";
import { ThemeProvider } from "@/providers/theme-provider";
import { useEffect } from "react";

function App() {
  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} /> {/* Change root path to Index */}
              <Route path="/invitation/accept" element={<AcceptInvitation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agreements" element={<Agreements />} />
              <Route path="/agreements/:id" element={<AgreementDetails />} />
              <Route path="/agent/agreement" element={<Agreement />} />
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/agent/documents" element={<AgentDocuments />} />
              <Route path="/auth" element={<Auth />} />  
              <Route path="/test-upload" element={<TestAgreementUpload />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
