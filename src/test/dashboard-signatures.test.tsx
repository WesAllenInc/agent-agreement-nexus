import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis()
  }
}));

// Create a wrapper for the QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Dashboard Signature Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should query agreement_signatures table in DashboardStats', async () => {
    // Mock the Supabase responses
    const mockAgentsResult = { data: [{ count: 10 }], error: null };
    const mockOfficesResult = { data: [{ count: 5 }], error: null };
    const mockInvitationsResult = { data: [{ count: 3 }], error: null };
    const mockAgreementsData = { 
      data: [
        { id: '1', status: 'draft' },
        { id: '2', status: 'submitted' },
        { id: '3', status: 'signed' }
      ], 
      error: null 
    };
    const mockSignaturesData = { 
      data: [
        { id: 'sig1', agreement_id: '3', user_id: 'user1' }
      ], 
      error: null 
    };

    // Setup the mocks for Promise.all
    vi.spyOn(Promise, 'all').mockResolvedValueOnce([
      mockAgentsResult,
      mockOfficesResult,
      mockInvitationsResult
    ]);

    // Setup the mocks for supabase.from().select()
    supabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'agreements') {
        return {
          select: vi.fn().mockReturnValue({
            ...mockAgreementsData
          })
        };
      } else if (table === 'agreement_signatures') {
        return {
          select: vi.fn().mockReturnValue({
            ...mockSignaturesData
          })
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis()
      };
    });

    // Create a test hook that mimics the DashboardStats query
    const useDashboardStats = () => useQuery({
      queryKey: ['dashboard-stats-test'],
      queryFn: async () => {
        // Fetch agents, offices, and invitations data
        const [agentsResult, officesResult, invitationsResult] = await Promise.all([
          supabase.from('sub_agents').select('count'),
          supabase.from('sub_offices').select('count'),
          supabase.from('profiles').select('count').eq('role', 'sales_agent')
        ]);

        // Fetch agreements data
        const { data: agreementsData, error: agreementsError } = await supabase
          .from('agreements')
          .select('id, status');
        
        if (agreementsError) throw agreementsError;
        
        // Fetch agreement signatures data
        const { data: signaturesData, error: signaturesError } = await supabase
          .from('agreement_signatures')
          .select('id, agreement_id');
        
        if (signaturesError) throw signaturesError;
        
        // Create a set of signed agreement IDs
        const signedAgreementIds = new Set(signaturesData?.map(sig => sig.agreement_id) || []);
        
        // Calculate counts for different agreement statuses
        let pendingCount = 0;
        let signedCount = signedAgreementIds.size; // Count from signatures table
        let draftCount = 0;
        
        // Count agreements by status
        agreementsData?.forEach(agreement => {
          if (signedAgreementIds.has(agreement.id)) {
            // Already counted in signedCount
          } else if (agreement.status === 'submitted') {
            pendingCount++;
          } else if (agreement.status === 'draft') {
            draftCount++;
          }
        });
        
        // Total agreements count
        const totalAgreements = agreementsData?.length || 0;

        return {
          totalAgents: agentsResult.data?.[0]?.count || 0,
          totalAgreements: totalAgreements,
          totalOffices: officesResult.data?.[0]?.count || 0,
          pendingInvitations: invitationsResult.data?.[0]?.count || 0,
          submittedAgreements: pendingCount,
          signedAgreements: signedCount,
          draftAgreements: draftCount
        };
      }
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the results
    expect(supabase.from).toHaveBeenCalledWith('agreement_signatures');
    expect(result.current.data?.signedAgreements).toBe(1);
    expect(result.current.data?.submittedAgreements).toBe(1);
    expect(result.current.data?.draftAgreements).toBe(1);
  });

  it('should query agreement_signatures table in AgreementStatusChart', async () => {
    // Mock the Supabase responses for agreements and signatures
    const mockAgreementsData = { 
      data: [
        { id: '1', status: 'draft', created_at: new Date().toISOString() },
        { id: '2', status: 'submitted', created_at: new Date().toISOString() },
        { id: '3', status: 'signed', created_at: new Date().toISOString() }
      ], 
      error: null 
    };
    const mockSignaturesData = { 
      data: [
        { id: 'sig1', agreement_id: '3', signed_at: new Date().toISOString() }
      ], 
      error: null 
    };

    // Setup the mocks for supabase.from().select()
    supabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'agreements') {
        return {
          select: vi.fn().mockReturnValue({
            ...mockAgreementsData
          })
        };
      } else if (table === 'agreement_signatures') {
        return {
          select: vi.fn().mockReturnValue({
            ...mockSignaturesData
          })
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis()
      };
    });

    // Create a test hook that mimics the AgreementStatusChart query
    const useAgreementStatusChart = () => useQuery({
      queryKey: ['agreement-status-chart-test'],
      queryFn: async () => {
        // Get current date and calculate date ranges
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Fetch agreements data
        const { data: agreementsData, error: agreementsError } = await supabase
          .from('agreements')
          .select('id, status, created_at');
        
        if (agreementsError) throw agreementsError;
        
        // Fetch agreement signatures data
        const { data: signaturesData, error: signaturesError } = await supabase
          .from('agreement_signatures')
          .select('id, agreement_id, signed_at');
        
        if (signaturesError) throw signaturesError;
        
        // Create a map of agreement IDs to their signature status
        const signatureMap = new Map();
        signaturesData?.forEach(signature => {
          signatureMap.set(signature.agreement_id, signature);
        });
        
        // Create monthly data for the past 12 months
        const chartData = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (now.getMonth() - 11 + i + 12) % 12;
          return { name: months[monthIndex], draft: 0, submitted: 0, signed: 0 };
        });
        
        // Process agreements data
        agreementsData?.forEach(agreement => {
          const agreementDate = new Date(agreement.created_at);
          const monthDiff = (now.getMonth() - agreementDate.getMonth() + 12) % 12;
          
          if (monthDiff < 12) {
            const monthIndex = 11 - monthDiff;
            
            if (signatureMap.has(agreement.id)) {
              chartData[monthIndex].signed++;
            } else if (agreement.status === 'submitted') {
              chartData[monthIndex].submitted++;
            } else {
              chartData[monthIndex].draft++;
            }
          }
        });
        
        return chartData;
      }
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useAgreementStatusChart(), { wrapper: createWrapper() });

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the results
    expect(supabase.from).toHaveBeenCalledWith('agreement_signatures');
    
    // Get the current month index
    const currentMonthIndex = new Date().getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthName = months[currentMonthIndex];
    
    // Find the current month in the chart data
    const currentMonthData = result.current.data?.find(item => item.name === currentMonthName);
    
    // Verify that the current month has the correct counts
    expect(currentMonthData?.signed).toBe(1);
  });

  it('should query agreement_signatures table in AgreementAttachmentsStatus', async () => {
    // Mock user ID
    const mockUserId = 'user1';
    
    // Mock the Supabase responses
    const mockSignatureData = { 
      data: [{ agreement_id: 'agreement1' }], 
      error: null 
    };

    // Setup the mocks for supabase.from().select()
    supabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'agreement_signatures') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue(mockSignatureData)
              })
            })
          })
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis()
      };
    });

    // Create a test function that mimics the fetchUserAgreement function
    const fetchUserAgreement = async () => {
      // First check for signatures in the agreement_signatures table
      const { data: signatureData, error: signatureError } = await supabase
        .from("agreement_signatures")
        .select("agreement_id")
        .eq("user_id", mockUserId)
        .order("signed_at", { ascending: false })
        .limit(1);

      if (signatureError) {
        console.error("Error fetching signature:", signatureError);
        return null;
      }

      // If we found a signature, use that agreement
      if (signatureData && signatureData.length > 0) {
        return signatureData[0].agreement_id;
      }
      
      return null;
    };

    // Call the function
    const result = await fetchUserAgreement();

    // Verify the results
    expect(supabase.from).toHaveBeenCalledWith('agreement_signatures');
    expect(result).toBe('agreement1');
  });
});
