import React from 'react';
import { Progress } from './progress';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label }) => {
  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ marginBottom: 4, color: '#888' }}>{label}</div>}
      <Progress value={value} max={max} />
    </div>
  );
};

export default ProgressBar;
