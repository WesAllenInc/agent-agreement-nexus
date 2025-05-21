import React from 'react';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { PWAStatus } from '@/components';
import { PWADevTools } from '@/components/dev/PWADevTools';

const metrics = [
  {
    label: 'Total Agreements',
    value: '156',
    icon: FileText,
    trend: '+12% from last month'
  },
  {
    label: 'Active Agents',
    value: '48',
    icon: Users,
    trend: '+3 this week'
  },
  {
    label: 'Completed',
    value: '89',
    icon: CheckCircle,
    trend: '92% success rate'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'pending',
    agent: 'Sarah Wilson',
    agreement: 'Service Agreement #1234',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'completed',
    agent: 'Mike Johnson',
    agreement: 'NDA #5678',
    time: '5 hours ago'
  },
  {
    id: 3,
    type: 'review',
    agent: 'Emily Brown',
    agreement: 'Contract #9012',
    time: '1 day ago'
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* PWA Status Component */}
      <PWAStatus />
      
      <div className="flex items-center justify-between">
        <h1 className="text-h1">Dashboard</h1>
        <button className="btn btn-primary">
          New Agreement
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="card metric-card">
            <div className="flex items-center justify-between">
              <metric.icon className="w-5 h-5 text-primary-500" />
              <span className="text-xs text-secondary-500">{metric.trend}</span>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-h2 mb-4">Recent Activity</h2>
        <div className="divide-y divide-secondary-100">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {activity.type === 'pending' && (
                  <Clock className="w-5 h-5 text-secondary-500" />
                )}
                {activity.type === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {activity.type === 'review' && (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-secondary-900">
                    {activity.agreement}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {activity.agent}
                  </p>
                </div>
              </div>
              <span className="text-sm text-secondary-500">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* PWA Developer Tools - Only visible in development mode */}
      <PWADevTools />
    </div>
  );
};

export default Dashboard;
