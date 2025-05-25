import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface PdfComment {
  id: string;
  agreement_id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  text: string;
  created_at: string;
}

export function useComments(agreementId: string | undefined, user?: { id: string; email: string; user_metadata?: any }) {
  const [comments, setComments] = useState<PdfComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!agreementId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('agreement_comments')
      .select('*')
      .eq('agreement_id', agreementId)
      .order('created_at', { ascending: true });
    if (error) setError(error.message);
    else setComments(data || []);
    setLoading(false);
  }, [agreementId]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!agreementId) return;
    fetchComments();
    const channel = supabase
      .channel(`agreement-comments-${agreementId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agreement_comments', filter: `agreement_id=eq.${agreementId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => [...prev, payload.new as PdfComment]);
          }
          if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
          if (payload.eventType === 'UPDATE') {
            setComments((prev) => prev.map((c) => (c.id === payload.new.id ? payload.new as PdfComment : c)));
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [agreementId, fetchComments]);

  // Add comment
  const addComment = async (text: string) => {
    if (!agreementId || !user) return;
    const { data, error } = await supabase.from('agreement_comments').insert([
      {
        agreement_id: agreementId,
        user_id: user.id,
        username: user.email,
        avatar_url: user.user_metadata?.avatar_url,
        text,
      },
    ]).select().single();
    if (error) setError(error.message);
    return data as PdfComment | undefined;
  };

  return {
    comments,
    loading,
    error,
    addComment,
    fetchComments,
  };
}
