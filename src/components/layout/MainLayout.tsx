import type { ReactNode } from "react";
import Navigation from "./Navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";

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
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-4 gap-2">
          <NotificationBadge />
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
