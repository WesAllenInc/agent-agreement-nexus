import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Chart } from '../ui/chart';

interface StatItem {
  label: string;
  value: number | string;
  badge?: string;
}

interface StatsProps {
  stats: StatItem[];
  chartData?: any;
}

const Stats: React.FC<StatsProps> = ({ stats, chartData }) => {
  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ minWidth: 120 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: '#888' }}>{stat.label}</div>
            {stat.badge && <Badge style={{ marginTop: 4 }}>{stat.badge}</Badge>}
          </div>
        ))}
      </div>
      {chartData && (
        <div style={{ marginTop: 32 }}>
          <Chart data={chartData} />
        </div>
      )}
    </Card>
  );
};

export default Stats;
