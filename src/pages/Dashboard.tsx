import React, { useMemo } from 'react';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import './Dashboard.css';
import { useAgreements } from '../hooks/useAgreements';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../components/ui/card/DashboardCard';
import { AgreementStatus } from '../types/agreement';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { agreements, isLoading } = useAgreements(user?.id);
  const navigate = useNavigate();

  // Calculate metrics from actual data
  const metrics = useMemo(() => {
    const totalAgreements = agreements?.length || 0;
    const completedAgreements = agreements?.filter(a => a.status === 'active').length || 0;
    const archivedAgreements = agreements?.filter(a => a.status === 'archived').length || 0;
    
    return [
      {
        label: 'Total Agreements',
        value: totalAgreements.toString(),
        icon: FileText,
        trend: `${totalAgreements > 0 ? '+' : ''}${totalAgreements} total`
      },
      {
        label: 'Active Agreements',
        value: completedAgreements.toString(),
        icon: CheckCircle,
        trend: `${completedAgreements > 0 ? '+' : ''}${completedAgreements} active`
      },
      {
        label: 'Archived',
        value: archivedAgreements.toString(),
        icon: AlertCircle,
        trend: `${archivedAgreements} archived`
      }
    ];
  }, [agreements]);

  // Generate recent activity from actual agreements
  const recentActivity = useMemo(() => {
    if (!agreements) return [];
    
    // Sort by created_at date, most recent first
    const sortedAgreements = [...agreements].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Take the 5 most recent agreements
    return sortedAgreements.slice(0, 5).map(agreement => {
      const createdDate = new Date(agreement.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      
      let timeAgo;
      if (diffDays > 0) {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      }
      
      return {
        id: agreement.id,
        type: agreement.status as AgreementStatus,
        agent: user?.email || 'Unknown User',
        agreement: agreement.file_name,
        time: timeAgo
      };
    });
  }, [agreements, user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={() => navigate('/agreements')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Agreement
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <DashboardCard
            key={index}
            title={metric.label}
            className="h-[140px]"
            isLoading={isLoading}
          >
            <div className="flex items-center justify-between">
              <metric.icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">{metric.trend}</span>
            </div>
            <div className="text-3xl font-bold mt-2">{metric.value}</div>
          </DashboardCard>
        ))}
      </div>

      {/* Recent Activity */}
      <DashboardCard 
        title="Recent Activity" 
        isLoading={isLoading}
      >
        {recentActivity.length > 0 ? (
          <div className="divide-y divide-border">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {activity.type === 'active' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {activity.type === 'archived' && (
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {activity.agreement}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.agent}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {isLoading ? 'Loading activity...' : 'No recent activity'}
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
