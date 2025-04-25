import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Invitations from "./pages/admin/Invitations";
import Agents from "./pages/admin/Agents";
import Agreements from "./pages/admin/Agreements";
import AgreementDetails from "./pages/admin/AgreementDetails";
import AgentDashboard from "./pages/agent/AgentDashboard";
import Agreement from "./pages/agent/Agreement";
import AgentDocuments from "./pages/agent/AgentDocuments";
import InvitationAccept from "./pages/InvitationAccept";

function App() {
  return (
    <Routes>
      <Route path="/" element={<InvitationAccept />} />
      <Route path="/invitation/accept" element={<InvitationAccept />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/invitations" element={<Invitations />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/agreements" element={<Agreements />} />
      <Route path="/agreements/:id" element={<AgreementDetails />} />
      <Route path="/agent/dashboard" element={<AgentDashboard />} />
      <Route path="/agent/agreement" element={<Agreement />} />
      <Route path="/agent/documents" element={<AgentDocuments />} />
    </Routes>
  );
}

export default App;
