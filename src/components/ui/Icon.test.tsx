import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from './Icon';

describe('Icon', () => {
  it('renders fallback for unknown icon', () => {
    render(<Icon name="unknown" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
