import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from './utils'

// Import the component to test
import AgentDashboard from '../pages/agent/AgentDashboard'

// Create a mock for useAuth with two different states
const mockUseAuth = vi.fn()

// Mock hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock components
vi.mock('@/components/agent/dashboard/OnboardingStatus', () => ({
  default: () => <div data-testid="onboarding-status">Onboarding Status Component</div>
}))

vi.mock('@/components/agent/dashboard/DocumentDownload', () => ({
  default: () => <div data-testid="document-download">Document Download Component</div>
}))

vi.mock('@/components/agent/dashboard/ExternalLinks', () => ({
  default: () => <div data-testid="external-links">External Links Component</div>
}))

vi.mock('@/components/agent/dashboard/AgreementAttachmentsStatus', () => ({
  default: () => <div data-testid="agreement-attachments">Agreement Attachments Component</div>
}))

vi.mock('@/components/layout/MainLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  )
}))

vi.mock('@/components/ui/loading', () => ({
  Loading: ({ text }: { text: string }) => <div data-testid="loading">{text}</div>
}))

vi.mock('@/components/ui/error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('@/components/auth/AuthErrorHandler', () => ({
  default: () => <div data-testid="auth-error-handler">Auth Error Handler</div>
}))

describe('Agent Dashboard', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseAuth.mockReset()
  })
  
  it('renders the dashboard with all components', async () => {
    // Setup the mock for the logged in state
    mockUseAuth.mockReturnValue({
      user: { id: 'user123', email: 'agent@example.com' },
      loading: false
    })
    
    render(<AgentDashboard />)
    
    // Check if the main components are rendered
    expect(screen.getByText('Agent Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome to your sales agent dashboard')).toBeInTheDocument()
    
    // Check if the dashboard sections are rendered
    expect(screen.getByText('Onboarding Checklist')).toBeInTheDocument()
    
    // Check if the mocked components are rendered
    expect(screen.getByTestId('onboarding-status')).toBeInTheDocument()
    expect(screen.getByTestId('document-download')).toBeInTheDocument()
    
    // Wait for any async components to load
    await waitFor(() => {
      expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    })
  })

  it('shows loading state when auth is loading', async () => {
    // Mock auth loading state
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
    })
    
    render(<AgentDashboard />)
    
    // Check if loading component is shown
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument()
  })
})
