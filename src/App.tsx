
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Invitations from "./pages/admin/Invitations";
import Agreements from "./pages/admin/Agreements";
import AgreementDetails from "./pages/admin/AgreementDetails";
import Agreement from "./pages/agent/Agreement";
import AcceptInvitation from "./pages/AcceptInvitation";
import { ReactNode } from "react";
import Agents from "./pages/admin/Agents";
// Import correct paths for agent dashboard and documents
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentDocuments from "./pages/agent/AgentDocuments";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AcceptInvitation />} />
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
    </Routes>
  );
}

export default App;
