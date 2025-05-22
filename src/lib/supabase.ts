import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded credentials for Storybook/Chromatic
// These are the same credentials from your .env.example file
const FALLBACK_SUPABASE_URL = 'https://clluedtbnphgwikytoil.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTAwMDMsImV4cCI6MjA2MTA4NjAwM30.Q9pL9k0OSv1R7ld-Tqb_TLZ1ppwexCtM_X2IE5nWRT8';

// Detect whether we're running inside Vite or plain Node:
const isVite = typeof import.meta !== 'undefined' && 'env' in import.meta;
const env = isVite
  ? (import.meta.env as Record<string, string>)
  : (process.env as Record<string, string>);

// Get Supabase credentials from environment variables or use fallbacks
const SUPABASE_URL = env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
