
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      {!isMobile && isAdmin && <Navigation />}
      
      <div className="flex-1">
        <Header isAdmin={isAdmin} />
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
