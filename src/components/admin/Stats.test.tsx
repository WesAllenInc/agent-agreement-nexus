import React from 'react';
import { render, screen } from '@testing-library/react';
import Stats from './Stats';

describe('Stats', () => {
  const stats = [
    { label: 'Active', value: 10, badge: 'Up' },
    { label: 'Pending', value: 5 },
  ];

  it('renders stats', () => {
    render(<Stats stats={stats} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
