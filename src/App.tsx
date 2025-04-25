
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Invitations from "./pages/admin/Invitations";
import Agreements from "./pages/admin/Agreements";
import AgreementDetails from "./pages/admin/AgreementDetails";
import Agreement from "./pages/agent/Agreement";
import AcceptInvitation from "./pages/AcceptInvitation";
import { ReactNode } from "react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AcceptInvitation />} />
      <Route path="/invitation/accept" element={<AcceptInvitation />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/invitations" element={<Invitations />} />
      <Route path="/agreements" element={<Agreements />} />
      <Route path="/agreements/:id" element={<AgreementDetails />} />
      <Route path="/agent/agreement" element={<Agreement />} />
      <Route path="/agent/dashboard" element={<AgentDashboard />} />
      <Route path="/agent/documents" element={<AgentDocuments />} />
    </Routes>
  );
}

export default App;
