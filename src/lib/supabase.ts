import { createClient } from '@supabase/supabase-js';

// Detect whether we're running inside Vite or plain Node:
const isVite = typeof import.meta !== 'undefined' && 'env' in import.meta;
const env = isVite
  ? (import.meta.env as Record<string, string>)
  : (process.env as Record<string, string>);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials in env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
