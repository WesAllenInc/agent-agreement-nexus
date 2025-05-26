import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InvitationForm from './InvitationForm';

describe('InvitationForm', () => {
  it('renders input and button', () => {
    render(<InvitationForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/invitee email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send invitation/i })).toBeInTheDocument();
  });

  it('calls onSubmit with email', () => {
    const onSubmit = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/invitee email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send invitation/i }));
    expect(onSubmit).toHaveBeenCalledWith('test@example.com');
  });

  it('disables button when loading', () => {
    render(<InvitationForm onSubmit={() => {}} loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
