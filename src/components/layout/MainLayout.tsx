
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
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      {!isMobile && isAdmin && (
        <div className="w-64 flex-shrink-0">
          <Navigation />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <Header isAdmin={isAdmin} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
