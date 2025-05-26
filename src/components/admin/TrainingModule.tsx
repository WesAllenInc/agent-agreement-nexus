import React from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

export interface TrainingModuleData {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
}

interface TrainingModuleProps {
  modules: TrainingModuleData[];
  onStart?: (id: string) => void;
  onContinue?: (id: string) => void;
}

const TrainingModule: React.FC<TrainingModuleProps> = ({ modules, onStart, onContinue }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {modules.map(module => (
        <Card key={module.id} style={{ minWidth: 260, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{module.title}</div>
          <Progress value={module.progress} style={{ margin: '16px 0' }} />
          <div style={{ color: module.completed ? 'green' : '#888', fontWeight: 500 }}>
            {module.completed ? 'Completed' : 'In Progress'}
          </div>
          <Button
            size="sm"
            style={{ marginTop: 12 }}
            onClick={() => (module.completed ? onContinue?.(module.id) : onStart?.(module.id))}
          >
            {module.completed ? 'Review' : 'Start'}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default TrainingModule;
