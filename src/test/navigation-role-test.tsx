import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock the AuthContext to simulate different user roles
jest.mock('@/contexts/AuthContext', () => {
  const originalModule = jest.requireActual('@/contexts/AuthContext');
  
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

describe('Navigation Component Role-Based Access', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('Admin sees admin-specific navigation items', () => {
    // Mock admin role
    mockUseAuth.mockReturnValue({
      isAdmin: true,
      isSeniorAgent: false,
      isAgent: false,
      user: { id: '1', email: 'admin@example.com' } as any,
      userRoles: ['admin'],
      loading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetError: jest.fn(),
      isApproved: true,
      userStatus: 'approved',
    });
    
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    
    // Check for admin-specific items
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-users')).toBeInTheDocument();
    expect(screen.getByTestId('nav-invitations')).toBeInTheDocument();
    expect(screen.getByTestId('nav-agents')).toBeInTheDocument();
    expect(screen.getByTestId('nav-all-agreements')).toBeInTheDocument();
    expect(screen.getByTestId('nav-settings')).toBeInTheDocument();
    
    // Ensure senior agent and agent items are not visible
    expect(screen.queryByTestId('nav-agent-management')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-team-agreements')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-my-agreements')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-training')).not.toBeInTheDocument();
  });
  
  test('Senior Agent sees senior agent-specific navigation items', () => {
    // Mock senior agent role
    mockUseAuth.mockReturnValue({
      isAdmin: false,
      isSeniorAgent: true,
      isAgent: false,
      user: { id: '2', email: 'sr-agent@example.com' } as any,
      userRoles: ['senior_agent'],
      loading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetError: jest.fn(),
      isApproved: true,
      userStatus: 'approved',
    });
    
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    
    // Check for senior agent-specific items
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-agent-management')).toBeInTheDocument();
    expect(screen.getByTestId('nav-team-agreements')).toBeInTheDocument();
    expect(screen.getByTestId('nav-training-management')).toBeInTheDocument();
    
    // Ensure admin and agent items are not visible
    expect(screen.queryByTestId('nav-users')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-invitations')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-my-agreements')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-banking-info')).not.toBeInTheDocument();
  });
  
  test('Agent sees agent-specific navigation items', () => {
    // Mock agent role
    mockUseAuth.mockReturnValue({
      isAdmin: false,
      isSeniorAgent: false,
      isAgent: true,
      user: { id: '3', email: 'agent@example.com' } as any,
      userRoles: ['agent'],
      loading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetError: jest.fn(),
      isApproved: true,
      userStatus: 'approved',
    });
    
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    
    // Check for agent-specific items
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-my-agreements')).toBeInTheDocument();
    expect(screen.getByTestId('nav-training')).toBeInTheDocument();
    expect(screen.getByTestId('nav-banking-info')).toBeInTheDocument();
    expect(screen.getByTestId('nav-profile')).toBeInTheDocument();
    
    // Ensure admin and senior agent items are not visible
    expect(screen.queryByTestId('nav-users')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-agent-management')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-team-agreements')).not.toBeInTheDocument();
  });
  
  test('Regular user sees only common navigation items', () => {
    // Mock regular user role (no special roles)
    mockUseAuth.mockReturnValue({
      isAdmin: false,
      isSeniorAgent: false,
      isAgent: false,
      user: { id: '4', email: 'user@example.com' } as any,
      userRoles: ['user'],
      loading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetError: jest.fn(),
      isApproved: true,
      userStatus: 'approved',
    });
    
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    
    // Check for only common items
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    
    // Ensure role-specific items are not visible
    expect(screen.queryByTestId('nav-users')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-agent-management')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-my-agreements')).not.toBeInTheDocument();
  });
});
