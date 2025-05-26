import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export interface TimelineEvent {
  id: string;
  label: string;
  date: string;
  status?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <Card style={{ padding: 24 }}>
      <ol style={{ listStyle: 'none', padding: 0 }}>
        {events.map(event => (
          <li key={event.id} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
            <Badge variant={event.status === 'completed' ? 'success' : 'default'} style={{ marginRight: 16 }}>
              {event.status || 'pending'}
            </Badge>
            <div>
              <div style={{ fontWeight: 600 }}>{event.label}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{event.date}</div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
};

export default Timeline;
