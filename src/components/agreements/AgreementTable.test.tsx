import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgreementTable, { Agreement } from './AgreementTable';

describe('AgreementTable', () => {
  const agreements: Agreement[] = [
    { id: '1', title: 'Test Agreement', status: 'Active', date: '2025-01-01' },
  ];

  it('renders agreements', () => {
    render(<AgreementTable agreements={agreements} />);
    expect(screen.getByText('Test Agreement')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<AgreementTable agreements={[]} />);
    expect(screen.getByText(/no agreements found/i)).toBeInTheDocument();
  });

  it('calls action handlers', () => {
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(
      <AgreementTable agreements={agreements} onView={onView} onEdit={onEdit} onDelete={onDelete} />
    );
    fireEvent.click(screen.getByText('View'));
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Delete'));
    expect(onView).toHaveBeenCalledWith('1');
    expect(onEdit).toHaveBeenCalledWith('1');
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
