
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  MailPlus,
} from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Invitations",
      href: "/invitations",
      icon: MailPlus,
    },
    {
      name: "Agreements",
      href: "/agreements", 
      icon: FileText,
    },
    {
      name: "Sales Agents",
      href: "/agents",
      icon: Users,
    },
  ];

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-50 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <span className="font-bold text-xl text-brand-800">Admin Portal</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                location.pathname === item.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
