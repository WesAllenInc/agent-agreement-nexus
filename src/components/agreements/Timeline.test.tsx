import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline, { TimelineEvent } from './Timeline';

describe('Timeline', () => {
  const events: TimelineEvent[] = [
    { id: '1', label: 'Created', date: '2025-01-01', status: 'completed' },
    { id: '2', label: 'Signed', date: '2025-01-02', status: 'active' },
  ];

  it('renders events', () => {
    render(<Timeline events={events} />);
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Signed')).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('2025-01-02')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<Timeline events={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
