import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  UserCircle,
  ChevronRight,
  ChevronDown,
  UserCog,
  Briefcase,
  GraduationCap,
  CreditCard,
  Settings,
  Bell,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  requiredRoles?: Array<'admin' | 'senior_agent' | 'agent'>;
  children?: MenuItem[];
}

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isSeniorAgent, isAgent, userRoles } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Toggle submenu open/closed state
  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  // Check if a menu item should be visible based on user roles
  const isMenuItemVisible = (item: MenuItem): boolean => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true; // No role requirements, show to everyone
    }
    
    return item.requiredRoles.some(role => {
      if (role === 'admin') return isAdmin;
      if (role === 'senior_agent') return isSeniorAgent;
      if (role === 'agent') return isAgent;
      return false;
    });
  };

  // Check if a path is active
  const isPathActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Check if any child path is active
  const hasActiveChild = (children?: MenuItem[]): boolean => {
    if (!children) return false;
    return children.some(child => isPathActive(child.path) || hasActiveChild(child.children));
  };

  // All menu items with role-based visibility
  const allMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Admin",
      path: "/admin",
      icon: <Settings className="h-5 w-5" />,
      requiredRoles: ['admin'],
      children: [
        {
          name: "Users",
          path: "/users",
          icon: <Users className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
        {
          name: "Invitations",
          path: "/invitations",
          icon: <Mail className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
        {
          name: "Agents",
          path: "/agents",
          icon: <UserCircle className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
        {
          name: "All Agreements",
          path: "/admin/agreements",
          icon: <FileText className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
        {
          name: "Training",
          path: "/training",
          icon: <GraduationCap className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
        {
          name: "Logs",
          path: "/activity-logs",
          icon: <FileText className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
        {
          name: "Settings",
          path: "/admin/settings",
          icon: <Settings className="h-5 w-5" />,
          requiredRoles: ['admin'],
        },
      ],
    },
    {
      name: "Senior Agent",
      path: "/sr-agent",
      icon: <UserCog className="h-5 w-5" />,
      requiredRoles: ['senior_agent'],
      children: [
        {
          name: "Agent Management",
          path: "/dashboard/sr-agent",
          icon: <UserCog className="h-5 w-5" />,
          requiredRoles: ['senior_agent'],
        },
        {
          name: "Team Agreements",
          path: "/sr-agent/agreements",
          icon: <Briefcase className="h-5 w-5" />,
          requiredRoles: ['senior_agent'],
        },
        {
          name: "Training Management",
          path: "/sr-agent/training",
          icon: <GraduationCap className="h-5 w-5" />,
          requiredRoles: ['senior_agent'],
        },
      ],
    },
    {
      name: "Agent",
      path: "/agent",
      icon: <UserCircle className="h-5 w-5" />,
      requiredRoles: ['agent'],
      children: [
        {
          name: "My Agreements",
          path: "/agreements",
          icon: <FileText className="h-5 w-5" />,
          requiredRoles: ['agent'],
        },
        {
          name: "Training",
          path: "/agent/training",
          icon: <GraduationCap className="h-5 w-5" />,
          requiredRoles: ['agent'],
        },
        {
          name: "Banking Info",
          path: "/agent/banking",
          icon: <CreditCard className="h-5 w-5" />,
          requiredRoles: ['agent'],
        },
        {
          name: "Profile",
          path: "/agent/profile",
          icon: <UserCircle className="h-5 w-5" />,
          requiredRoles: ['agent'],
        },
      ],
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Help",
      path: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  // Filter menu items based on user roles
  const visibleMenuItems = allMenuItems.filter(isMenuItemVisible);

  // Render a menu item (either a button or a collapsible section)
  const renderMenuItem = (item: MenuItem) => {
    // If the item has children, render as a collapsible section
    if (item.children && item.children.length > 0) {
      const isOpen = openMenus.includes(item.name);
      const isActive = hasActiveChild(item.children) || isPathActive(item.path);
      const visibleChildren = item.children.filter(isMenuItemVisible);
      
      // Don't render if there are no visible children
      if (visibleChildren.length === 0) return null;
      
      return (
        <Collapsible 
          key={item.path} 
          open={isOpen || isActive} 
          onOpenChange={() => toggleMenu(item.name)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              aria-expanded={isOpen}
              aria-controls={`${item.name}-content`}
            >
              {item.icon}
              <span>{item.name}</span>
              {isOpen || isActive ? (
                <ChevronDown className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent 
            id={`${item.name}-content`}
            className="pl-8 space-y-1 mt-1"
          >
            {visibleChildren.map(child => (
              <TooltipProvider key={child.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isPathActive(child.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isPathActive(child.path)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => navigate(child.path)}
                      data-testid={`nav-${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                      aria-current={isPathActive(child.path) ? "page" : undefined}
                    >
                      {child.icon}
                      <span>{child.name}</span>
                      {isPathActive(child.path) && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {child.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }
    
    // If the item has no children, render as a simple button
    return (
      <TooltipProvider key={item.path}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              key={item.path}
              variant={isPathActive(item.path) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isPathActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.path)}
              data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              aria-current={isPathActive(item.path) ? "page" : undefined}
            >
              {item.icon}
              <span>{item.name}</span>
              {isPathActive(item.path) && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <nav className="h-screen bg-background border-r border-border p-4" aria-label="Main Navigation">
      <div className="space-y-2">
        {visibleMenuItems.map(renderMenuItem)}
      </div>
    </nav>
  );
}

