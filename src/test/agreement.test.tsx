import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from './utils'

// Import the component to test
import AgreementView from '../pages/agreements/AgreementView'

// Mock components to simplify testing
vi.mock('@/components/PdfViewer', () => ({
  PdfViewer: () => <div data-testid="pdf-viewer">PDF Viewer Component</div>
}))

vi.mock('@/components/agreement/SignatureCanvas', () => ({
  default: () => <div data-testid="signature-canvas">Signature Canvas Component</div>
}))

vi.mock('@/components/agreements/AgreementAttachments', () => ({
  default: () => <div data-testid="agreement-attachments">Agreement Attachments Component</div>
}))

// Mock hooks
vi.mock('@/hooks/useAgreement', () => ({
  useAgreement: () => ({
    agreement: {
      id: '123',
      title: 'Test Agreement',
      status: 'active',
      created_at: '2025-05-01T12:00:00Z',
      updated_at: '2025-05-01T12:00:00Z',
      user_id: 'user123'
    },
    loading: false,
    error: null,
    fileUrl: 'https://example.com/test.pdf',
    updateStatus: vi.fn()
  })
}))

vi.mock('@/hooks/useAgreementSignature', () => ({
  useAgreementSignature: () => ({
    signature: null,
    loading: false,
    fetchSignature: vi.fn(),
    saveSignature: vi.fn(() => Promise.resolve({ data: { id: 'sig123' }, error: null })),
    getSignatureUrl: vi.fn(() => Promise.resolve('https://example.com/signature.png'))
  })
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user123', email: 'test@example.com' }
  })
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useNavigate: () => vi.fn()
  }
})

// Mock UI components
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs">{children}</div>,
  TabsContent: ({ children, value }: { children: React.ReactNode, value: string }) => 
    <div data-testid={`tab-content-${value}`}>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: { children: React.ReactNode, value: string }) => 
    <button data-testid={`tab-${value}`} role="tab">{children}</button>
}))

// Mock AuthErrorHandler component
vi.mock('@/components/auth/AuthErrorHandler', () => ({
  default: () => <div data-testid="auth-error-handler">Auth Error Handler</div>
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => 
    <button onClick={onClick} role="button">{children}</button>
}))

describe('Agreement View', () => {
  it('renders agreement view component', async () => {
    render(<AgreementView />)
    
    // Check if the auth error handler is rendered
    expect(screen.getByTestId('auth-error-handler')).toBeInTheDocument()
    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    
    // Check if the PDF viewer is rendered
    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
  })

  it('renders the document content', async () => {
    render(<AgreementView />)
    
    // Check if the PDF viewer is rendered in the document tab
    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
  })
})
