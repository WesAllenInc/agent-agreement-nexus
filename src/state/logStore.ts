import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  created_at: string;
  user_email?: string;
}

export interface LogFilters {
  searchTerm: string;
  actionFilter: string;
  entityFilter: string;
  startDate: Date | null;
  endDate: Date | null;
  limit: number;
  page: number;
}

interface LogState {
  logs: ActivityLog[];
  totalLogs: number;
  totalPages: number;
  filters: LogFilters;
  isLoading: boolean;
  error: string | null;
}

interface LogActions {
  fetchLogs: () => Promise<void>;
  setFilter: (key: keyof LogFilters, value: any) => void;
  resetFilters: () => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  exportLogs: () => Promise<string | null>;
}

// Default filters
const defaultFilters: LogFilters = {
  searchTerm: '',
  actionFilter: '',
  entityFilter: '',
  startDate: null,
  endDate: null,
  limit: 25,
  page: 1,
};

export const useLogStore = create<LogState & LogActions>((set, get) => ({
  // State
  logs: [],
  totalLogs: 0,
  totalPages: 1,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  // Actions
  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const { searchTerm, actionFilter, entityFilter, startDate, endDate, limit, page } = filters;

      // Build query
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id (email)
        `, { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.or(`user_id.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%,entity_id.ilike.%${searchTerm}%`);
      }
      
      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }
      
      if (entityFilter) {
        query = query.eq('entity_type', entityFilter);
      }

      // Apply date filters
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        // Set to end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Transform data to include user email
      const transformedData = data.map(log => ({
        ...log,
        user_email: log.profiles?.email || 'Unknown',
      }));

      set({ 
        logs: transformedData, 
        totalLogs: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching activity logs:', error.message);
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to load activity logs: ${error.message}`);
    }
  },

  setFilter: (key, value) => {
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value,
        // Reset to page 1 when filters change
        ...(key !== 'page' ? { page: 1 } : {})
      }
    }));
    // Fetch logs with new filters
    get().fetchLogs();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchLogs();
  },

  nextPage: () => {
    const { filters, totalPages } = get();
    if (filters.page < totalPages) {
      set(state => ({
        filters: {
          ...state.filters,
          page: state.filters.page + 1
        }
      }));
      get().fetchLogs();
    }
  },

  prevPage: () => {
    const { filters } = get();
    if (filters.page > 1) {
      set(state => ({
        filters: {
          ...state.filters,
          page: state.filters.page - 1
        }
      }));
      get().fetchLogs();
    }
  },

  goToPage: (page) => {
    const { totalPages } = get();
    if (page >= 1 && page <= totalPages) {
      set(state => ({
        filters: {
          ...state.filters,
          page
        }
      }));
      get().fetchLogs();
    }
  },

  exportLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const { searchTerm, actionFilter, entityFilter, startDate, endDate } = filters;

      // Build query without pagination to get all filtered logs
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id (email)
        `);

      // Apply filters
      if (searchTerm) {
        query = query.or(`user_id.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%,entity_id.ilike.%${searchTerm}%`);
      }
      
      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }
      
      if (entityFilter) {
        query = query.eq('entity_type', entityFilter);
      }

      // Apply date filters
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        // Set to end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data for CSV
      const csvData = data.map(log => ({
        id: log.id,
        user_email: log.profiles?.email || 'Unknown',
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        created_at: new Date(log.created_at).toLocaleString(),
        metadata: JSON.stringify(log.metadata),
      }));

      // Convert to CSV
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => 
        Object.values(row)
          .map(value => `"${value}"`)
          .join(',')
      );
      const csv = [headers, ...rows].join('\n');

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Logs exported successfully');
      set({ isLoading: false });
      
      return url;
    } catch (error: any) {
      console.error('Error exporting logs:', error.message);
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to export logs: ${error.message}`);
      return null;
    }
  },
}));
