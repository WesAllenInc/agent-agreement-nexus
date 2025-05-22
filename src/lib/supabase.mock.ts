import { SupabaseClient } from '@supabase/supabase-js';

// Create a mock Supabase client that doesn't throw errors
// This is used in Storybook/Chromatic environments
export const createMockSupabaseClient = () => {
  // Create a mock implementation of all the methods we use
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: { path: '' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
  } as unknown as SupabaseClient;
};
