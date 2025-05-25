import type { ReactNode } from "react";
import Navigation from "./Navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";
import { OfflineNotification } from "@/components/ui/offline-notification";
import CommandPalette from "@/components/command/CommandPalette";

interface MainLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
  isSeniorAgent?: boolean;
}

export default function MainLayout({ children, isAdmin, isSeniorAgent }: MainLayoutProps) {
  const auth = useAuth();
  
  // Use props if provided, otherwise use auth context
  const isUserAdmin = isAdmin !== undefined ? isAdmin : auth.isAdmin;
  const isUserSeniorAgent = isSeniorAgent !== undefined ? isSeniorAgent : auth.isSeniorAgent;
  // Placeholder data for demonstration; replace with real data sources
  const agreements = [
    { id: 'a1', label: 'Agreement 1', type: 'agreement' as const, action: () => alert('Open Agreement 1') },
    { id: 'a2', label: 'Agreement 2', type: 'agreement' as const, action: () => alert('Open Agreement 2') }
  ];
  const users = [
    { id: 'u1', label: 'Alice Agent', type: 'user' as const, action: () => alert('View Alice') },
    { id: 'u2', label: 'Bob Broker', type: 'user' as const, action: () => alert('View Bob') }
  ];
  const actions = [
    { id: 'create-agreement', label: 'Create Agreement', type: 'action' as const, action: () => alert('Create Agreement') },
    { id: 'invite-user', label: 'Invite User', type: 'action' as const, action: () => alert('Invite User') }
  ];
  const recents = [
    { id: 'r1', label: 'Recently Viewed Agreement', type: 'recent' as const, action: () => alert('Open Recent') }
  ];

  return (
    <div className="flex min-h-screen">
      <CommandPalette agreements={agreements} users={users} actions={actions} recents={recents} />
      <Navigation />
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-4 gap-2">
          <NotificationBadge />
          <ThemeToggle />
        </div>
        {children}
      </main>
      <OfflineNotification />
    </div>
  );
}
