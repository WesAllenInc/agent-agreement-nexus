import React from 'react';

interface PresenceUser {
  user_id: string;
  username: string;
  avatar_url?: string;
  cursor?: { x: number; y: number };
  typing?: boolean;
}

interface PresenceAvatarsProps {
  users: PresenceUser[];
  currentUserId: string;
}

export const PresenceAvatars: React.FC<PresenceAvatarsProps> = ({ users, currentUserId }) => {
  return (
    <div className="flex items-center space-x-2">
      {users.map((user) => (
        <div key={user.user_id} className="relative group">
          <img
            src={user.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${user.user_id}`}
            alt={user.username}
            className={`w-8 h-8 rounded-full border-2 ${user.user_id === currentUserId ? 'border-primary' : 'border-muted'}`}
            title={user.username + (user.typing ? ' (typing...)' : '')}
          />
          {user.typing && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs bg-primary text-white rounded px-1">Typing…</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PresenceAvatars;
