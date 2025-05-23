import React from 'react';

/**
 * Mock data provider for Storybook
 * 
 * This file contains mock data for various components to use in Storybook.
 * It provides realistic data that mimics what would come from the Supabase database.
 */

// Sample agreement data matching your Supabase schema
export const mockAgreements = [
  {
    id: '1',
    title: 'Agent Service Agreement',
    description: 'Standard agreement for agent services',
    status: 'pending',
    created_at: '2025-04-10T14:30:00Z',
    updated_at: '2025-04-10T14:30:00Z',
    user_id: 'user-123',
    file_path: '/agreements/agent-service-agreement.pdf',
  },
  {
    id: '2',
    title: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement for client data',
    status: 'signed',
    created_at: '2025-04-05T10:15:00Z',
    updated_at: '2025-04-07T16:45:00Z',
    user_id: 'user-123',
    file_path: '/agreements/nda-agreement.pdf',
  },
  {
    id: '3',
    title: 'Commission Structure',
    description: 'Details of commission calculations',
    status: 'rejected',
    created_at: '2025-04-01T09:20:00Z',
    updated_at: '2025-04-03T11:30:00Z',
    user_id: 'user-123',
    file_path: '/agreements/commission-structure.pdf',
  },
];

// Sample notification data
export const mockNotifications = [
  {
    id: '1',
    title: 'Agreement Status Change',
    message: 'Your agreement "Agent Service Agreement" is now pending',
    created_at: '2025-04-10T14:35:00Z',
    read: false,
    user_id: 'user-123',
    agreement_id: '1',
  },
  {
    id: '2',
    title: 'Agreement Signed',
    message: 'Your agreement "Non-Disclosure Agreement" has been signed',
    created_at: '2025-04-07T16:45:00Z',
    read: true,
    user_id: 'user-123',
    agreement_id: '2',
  },
];

// Sample training data
export const mockTrainingModules = [
  {
    id: '1',
    title: 'Introduction to Agency Operations',
    description: 'Learn the basics of agency operations and protocols',
    created_at: '2025-03-15T09:00:00Z',
    updated_at: '2025-03-15T09:00:00Z',
    required: true,
  },
  {
    id: '2',
    title: 'Client Management Best Practices',
    description: 'Effective strategies for client relationship management',
    created_at: '2025-03-20T10:30:00Z',
    updated_at: '2025-03-20T10:30:00Z',
    required: true,
  },
];

// Sample training materials
export const mockTrainingMaterials = [
  {
    id: '1',
    title: 'Agency Handbook',
    description: 'Comprehensive guide to agency policies',
    file_path: '/training/agency-handbook.pdf',
    material_type: 'pdf',
    module_id: '1',
  },
  {
    id: '2',
    title: 'Client Onboarding Video',
    description: 'Step-by-step guide to onboarding new clients',
    file_path: '/training/client-onboarding.mp4',
    material_type: 'video',
    module_id: '2',
  },
];

// Sample user data
export const mockUsers = [
  {
    id: 'user-123',
    email: 'agent@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'agent',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'admin-456',
    email: 'admin@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'admin',
    created_at: '2025-01-01T00:00:00Z',
  },
];

// Mock the Supabase client for Storybook
export const mockSupabaseClient = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        data: table === 'agreements' 
          ? mockAgreements 
          : table === 'notifications'
          ? mockNotifications
          : table === 'training_modules'
          ? mockTrainingModules
          : table === 'training_materials'
          ? mockTrainingMaterials
          : table === 'users'
          ? mockUsers
          : [],
        error: null,
      }),
      data: table === 'agreements' 
        ? mockAgreements 
        : table === 'notifications'
        ? mockNotifications
        : table === 'training_modules'
        ? mockTrainingModules
        : table === 'training_materials'
        ? mockTrainingMaterials
        : table === 'users'
        ? mockUsers
        : [],
      error: null,
    }),
    insert: () => ({
      data: { id: 'new-id' },
      error: null,
    }),
    update: () => ({
      eq: () => ({
        data: { success: true },
        error: null,
      }),
    }),
    delete: () => ({
      eq: () => ({
        data: { success: true },
        error: null,
      }),
    }),
  }),
  storage: {
    from: () => ({
      upload: () => ({
        data: { path: '/storage/path' },
        error: null,
      }),
      getPublicUrl: () => ({
        data: { publicUrl: 'https://example.com/storage/public-file.pdf' },
        error: null,
      }),
    }),
  },
  auth: {
    getUser: async () => ({
      data: { user: mockUsers[0] },
      error: null,
    }),
    signIn: async () => ({
      data: { user: mockUsers[0] },
      error: null,
    }),
    signOut: async () => ({
      error: null,
    }),
  },
  channel: (name: string) => ({
    on: () => ({
      subscribe: () => {},
    }),
    unsubscribe: () => {},
  }),
};

// Extend window interface to include our mock client
declare global {
  interface Window {
    MOCK_SUPABASE_CLIENT: any;
  }
}

// Setup function to initialize mock data in Storybook
export const setupMockSupabase = () => {
  if (typeof window !== 'undefined') {
    window.MOCK_SUPABASE_CLIENT = mockSupabaseClient;
  }
};

// Initialize when this module is loaded
setupMockSupabase();

// Decorator factory function for Storybook
export const withMockSupabase = () => {
  return (StoryFn: () => React.ReactElement) => {
    // Ensure mock client is set up
    setupMockSupabase();
    return StoryFn();
  };
};
