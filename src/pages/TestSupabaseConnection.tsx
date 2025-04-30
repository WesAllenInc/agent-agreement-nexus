import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function TestSupabaseConnection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('loading');
        setMessage('Testing connection to Supabase...');
        
        // Try a simple select from a known table (profiles)
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) throw error;
        
        setStatus('success');
        setMessage('Successfully connected to Supabase!');
      } catch (err: any) {
        setStatus('error');
        setMessage('Failed to connect to Supabase: ' + (err.message || String(err)));
      }
    };
    testConnection();
  }, []);

  return (
    <div style={{ padding: 32, maxWidth: '800px', margin: '0 auto' }}>
      <h2>Supabase Connection Test</h2>
      <div style={{ 
        padding: '16px', 
        borderRadius: '8px',
        backgroundColor: status === 'success' ? '#e6f7e6' : 
                         status === 'error' ? '#ffebee' : 
                         status === 'loading' ? '#e3f2fd' : '#f5f5f5',
        marginTop: '16px'
      }}>
        <p>Status: <b>{status}</b></p>
        <p>{message}</p>
      </div>
    </div>
  );
}

