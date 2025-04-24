
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardStatsCards from "@/components/dashboard/DashboardStats";
import InvitationChart from "@/components/dashboard/InvitationChart";
import AgreementStatusChart from "@/components/dashboard/AgreementStatusChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { DashboardStats, ChartData, TimelineEvent } from "@/types";

// Sample data
const sampleStats: DashboardStats = {
  totalAgents: 24,
  pendingInvitations: 7,
  submittedAgreements: 18,
  signedAgreements: 15,
  recentActivity: [
    {
      id: "1",
      title: "New agent signed up",
      description: "John Smith accepted invitation and created account",
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      type: "invitation",
    },
    {
      id: "2",
      title: "Agreement submitted",
      description: "Maria Garcia completed and signed her agreement",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "signature",
    },
    {
      id: "3",
      title: "Agreement started",
      description: "William Chen started filling out agreement forms",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: "agreement",
    },
    {
      id: "4",
      title: "Invitation sent",
      description: "New invitation sent to samantha.lee@example.com",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: "invitation",
    },
    {
      id: "5",
      title: "Agreement submitted",
      description: "Robert Johnson completed and signed his agreement",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "signature",
    },
  ],
  invitationChartData: [
    { name: "Sent", value: 35 },
    { name: "Accepted", value: 24 },
    { name: "Expired", value: 4 },
    { name: "Pending", value: 7 },
  ],
  agreementStatusData: [
    { name: "Draft", value: 3 },
    { name: "Submitted", value: 15 },
    { name: "Signed", value: 15 },
  ],
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call - would be replaced with Supabase query
    setTimeout(() => {
      setStats(sampleStats);
      setIsLoading(false);
    }, 1000);
    
    // In real implementation:
    // Fetch dashboard data from Supabase tables
    
  }, []);

  if (isLoading) {
    return (
      <MainLayout isAdmin>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!stats) {
    return (
      <MainLayout isAdmin>
        <div className="text-center">
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAdmin>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <DashboardStatsCards stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvitationChart data={stats.invitationChartData} />
          <AgreementStatusChart data={stats.agreementStatusData} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RecentActivity events={stats.recentActivity} />
        </div>
      </div>
    </MainLayout>
  );
}
