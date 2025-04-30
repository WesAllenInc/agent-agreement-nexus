import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  UserCircle,
  ChevronRight,
} from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Agreements",
      path: "/agreements",
      icon: <FileText className="h-5 w-5" />,
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

  return (
    <nav className="h-screen bg-background border-r border-border p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
            {location.pathname === item.path && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>
        ))}
      </div>
    </nav>
  );
}
