import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, ChevronDown, LayoutDashboard, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "../ui/theme-toggle";

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-background border-b border-border shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
            alt="Ireland Pay Logo" 
            className="h-12"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          {isMobile && isAdmin && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/agent/dashboard")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/agent/profile")}>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-destructive focus:text-destructive-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && showMobileMenu && isAdmin && (
        <div className="bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-foreground/80 hover:text-foreground" 
                  onClick={() => {
                    navigate("/dashboard");
                    setShowMobileMenu(false);
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-foreground/80 hover:text-foreground" 
                  onClick={() => {
                    navigate("/invitations");
                    setShowMobileMenu(false);
                  }}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Invitations
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-foreground/80 hover:text-foreground" 
                  onClick={() => {
                    navigate("/agreements");
                    setShowMobileMenu(false);
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Agreements
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

