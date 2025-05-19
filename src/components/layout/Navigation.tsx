import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  UserCircle,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isSeniorAgent } = useAuth();

  // Base menu items for all users
  const baseMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Agreements",
      path: "/agreements",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    {
      name: "Users",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Invitations",
      path: "/invitations",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Agents",
      path: "/agents",
      icon: <UserCircle className="h-5 w-5" />,
    },
  ];

  // Senior agent menu items
  const seniorAgentMenuItems = [
    {
      name: "Agent Management",
      path: "/dashboard/sr-agent",
      icon: <UserCog className="h-5 w-5" />,
    },
  ];

  // Combine menu items based on user role
  const menuItems = [
    ...baseMenuItems,
    ...(isAdmin ? adminMenuItems : []),
    ...(isSeniorAgent ? seniorAgentMenuItems : []),
  ];

  return (
    <nav className="h-screen bg-background border-r border-border p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname.startsWith(item.path) ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              location.pathname.startsWith(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
            {location.pathname.startsWith(item.path) && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>
        ))}
      </div>
    </nav>
  );
}

