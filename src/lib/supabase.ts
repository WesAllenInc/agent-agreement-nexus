import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clluedtbnphgwikytoil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2MDc3NTksImV4cCI6MjAzMDE4Mzc1OX0.ZPiKpqjY1Y9Yv1b-qMwVicGTLBBvZjLj3XZXK8-iQmA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
