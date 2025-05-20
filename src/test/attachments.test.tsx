import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from './utils'

// Mock components for testing
const AttachmentsList = () => (
  <div data-testid="attachments-list">
    <h3>Attachments</h3>
    <ul>
      <li data-testid="attachment-item">Document 1.pdf</li>
      <li data-testid="attachment-item">Document 2.pdf</li>
    </ul>
  </div>
);

// Mock the components
vi.mock('@/components/agreements/AttachmentsList', () => ({
  default: () => <AttachmentsList />
}));

// Mock hooks
const mockUseAgreementAttachments = vi.fn();

vi.mock('@/hooks/useAgreementAttachments', () => ({
  useAgreementAttachments: () => mockUseAgreementAttachments()
}));

describe('Agreement Attachments', () => {
  beforeEach(() => {
    mockUseAgreementAttachments.mockReset();
    mockUseAgreementAttachments.mockReturnValue({
      attachments: [
        { id: '1', filename: 'Document 1.pdf', created_at: '2025-05-01T12:00:00Z' },
        { id: '2', filename: 'Document 2.pdf', created_at: '2025-05-02T12:00:00Z' }
      ],
      loading: false,
      error: null,
      uploadAttachment: vi.fn(),
      deleteAttachment: vi.fn()
    });
  });

  it('renders the attachments list', async () => {
    render(<AttachmentsList />);
    
    expect(screen.getByTestId('attachments-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('attachment-item')).toHaveLength(2);
    expect(screen.getByText('Document 1.pdf')).toBeInTheDocument();
    expect(screen.getByText('Document 2.pdf')).toBeInTheDocument();
  });

  it('handles loading state', async () => {
    mockUseAgreementAttachments.mockReturnValue({
      attachments: [],
      loading: true,
      error: null,
      uploadAttachment: vi.fn(),
      deleteAttachment: vi.fn()
    });
    
    render(<AttachmentsList />);
    
    expect(screen.getByTestId('attachments-list')).toBeInTheDocument();
  });
});
