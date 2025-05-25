import { useEffect, useRef, useState } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

interface PresenceUser {
  user_id: string;
  username: string;
  avatar_url?: string;
  cursor?: { x: number; y: number };
  typing?: boolean;
}

interface UseRealtimePresenceOptions {
  channel: string; // e.g. 'agreement-123-presence'
  userInfo: Omit<PresenceUser, 'cursor' | 'typing'>;
}

export function useRealtimePresence({ channel, userInfo }: UseRealtimePresenceOptions) {
  const { session } = useAuth();
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [channelRef, setChannelRef] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!session) return;
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!
    );
    const presenceChannel = supabase.channel(channel, {
      config: { presence: { key: userInfo.user_id } }
    });
    setChannelRef(presenceChannel);
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState<PresenceUser>();
        setUsers(Object.values(state).flat());
      })
      .on('presence', { event: 'join' }, () => {
        const state = presenceChannel.presenceState<PresenceUser>();
        setUsers(Object.values(state).flat());
      })
      .on('presence', { event: 'leave' }, () => {
        const state = presenceChannel.presenceState<PresenceUser>();
        setUsers(Object.values(state).flat());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track(userInfo);
        }
      });
    return () => {
      presenceChannel.unsubscribe();
    };
  }, [channel, userInfo.user_id]);

  // Cursor and typing updates
  const updatePresence = (data: Partial<Pick<PresenceUser, 'cursor' | 'typing'>>) => {
    if (channelRef) {
      channelRef.track({ ...userInfo, ...data });
    }
  };

  return { users, updatePresence };
}
