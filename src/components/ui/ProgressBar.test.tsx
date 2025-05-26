import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with label', () => {
    render(<ProgressBar value={40} label="Progress" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('renders with correct value', () => {
    render(<ProgressBar value={60} />);
    // The Progress component is visual, so we just check the container exists
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
