
import { ReactNode } from "react";
import { Sidebar } from "../ui/sidebar";
import Header from "./Header";
import Navigation from "./Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function MainLayout({ children, isAdmin = false }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background flex">
      {!isMobile && isAdmin && <Navigation />}
      
      <div className="flex-1">
        <Header isAdmin={isAdmin} />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
