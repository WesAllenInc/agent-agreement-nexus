import React from 'react';
import { Bell, Settings, User } from 'lucide-react';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  return (
    <header className="header">
      <div className="flex-1">
        <h1 className="text-h2 text-secondary-900">Agent Agreement Nexus</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="btn btn-secondary p-2">
          <Bell className="w-5 h-5" />
        </button>
        <button className="btn btn-secondary p-2">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
}
