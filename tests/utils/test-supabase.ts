/**
 * Mock Supabase client for testing
 * This provides a mock implementation that can be used in Playwright tests
 * without requiring actual Supabase credentials
 */

type QueryResponse<T> = {
  data: T;
  error: null | { message: string };
};

// Create a mock implementation that matches the Supabase interface used in tests
export const supabase = {
  from: (table: string) => {
    // Define mock data based on table name
    const getMockData = () => {
      switch (table) {
        case 'module_materials':
          return [{ id: 'mock-id', material_id: 'mock-material-id', module_id: 'mock-module-id' }];
        case 'training_modules':
          return [{ id: 'mock-module-id', title: 'Mock Module', description: 'Mock description' }];
        case 'training_materials':
          return [{ id: 'mock-material-id', title: 'Mock Material', description: 'Mock description' }];
        case 'training_completions':
          return [{ id: 'mock-completion-id', material_id: 'mock-material-id', user_id: 'mock-user-id' }];
        default:
          return [{ id: 'mock-id' }];
      }
    };

    // Create a chainable query builder
    const createChainableQuery = (mockData: any[]) => {
      const query = {
        // Methods that return data directly
        then: (callback: (result: QueryResponse<any[]>) => void) => {
          callback({ data: mockData, error: null });
          return query;
        },

        // Methods that return a new chainable query
        eq: (column: string, value: any) => createChainableQuery(mockData),
        in: (column: string, values: any[]) => createChainableQuery(mockData),
        order: (column: string, options: any) => createChainableQuery(mockData),
        limit: (num: number) => createChainableQuery(mockData.slice(0, num)),
        single: () => ({ data: mockData[0] || null, error: null }),
      };

      return query;
    };

    return {
      // Select operation with chainable methods
      select: (columns?: string) => createChainableQuery(getMockData()),

      // Insert operation
      insert: (data: any) => Promise.resolve({ 
        data: { ...data, id: `mock-${table}-id` }, 
        error: null 
      }),

      // Update operation
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data, error: null }),
      }),

      // Delete operation
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
        in: (column: string, values: any[]) => Promise.resolve({ data: null, error: null }),
      }),
    };
  },

  // Storage operations
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: any) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` } }),
    }),
  },

  // Auth operations
  auth: {
    signIn: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
  },
};
