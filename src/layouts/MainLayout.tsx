import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Import our common components
import { SearchBar } from '../components/common/SearchBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { NotificationsDropdown } from '../components/common/NotificationsDropdown';
import { UserMenu } from '../components/common/UserMenu';
import { HelpWidget } from '../components/common/HelpWidget';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (localStorage.getItem('theme') === null && 
         window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  
  // Mock user data (would come from auth context in real app)
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin' as const,
  };
  
  // Mock notifications (would come from API/context in real app)
  const notifications = [
    {
      id: '1',
      title: 'Agreement Signed',
      message: 'Sarah Johnson signed the sales agreement',
      type: 'success' as const,
      read: false,
      createdAt: new Date(Date.now() - 30 * 60000),
      link: '/agreements/123',
    },
    {
      id: '2',
      title: 'New Agent Joined',
      message: 'Michael Brown accepted the invitation',
      type: 'info' as const,
      read: true,
      createdAt: new Date(Date.now() - 2 * 3600000),
      link: '/agents',
    },
  ];
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };
  
  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };
  
  // Check if this is user's first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);
  
  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };
  
  // Set dark mode on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/">
                  <img 
                    className="h-8 w-auto" 
                    src="/logo.svg" 
                    alt="Agent Agreement Nexus" 
                  />
                </Link>
              </div>
              <div className="hidden md:block ml-10">
                <SearchBar />
              </div>
              <div className="md:hidden ml-2">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Right side navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationsDropdown 
                notifications={notifications}
                onMarkAsRead={(id) => console.log('Mark as read:', id)}
                onMarkAllAsRead={() => console.log('Mark all as read')}
              />
              <UserMenu
                user={user}
                onLogout={handleLogout}
                onThemeToggle={toggleDarkMode}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
          
          {/* Mobile Search (Visible only on mobile) */}
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
          
          {/* Breadcrumbs */}
          <div className="py-2">
            <Breadcrumbs />
          </div>
        </div>
      </header>
      
      {/* Mobile Menu (only visible on mobile when open) */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-white dark:bg-gray-800 shadow-lg pt-2 pb-3 space-y-1">
            <Link
              to="/agent/dashboard"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/agent/documents"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documents
            </Link>
            <Link
              to="/agent/profile"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex items-center px-4 py-2">
                <NotificationsDropdown 
                  notifications={notifications}
                  onMarkAsRead={(id) => console.log('Mark as read:', id)}
                  onMarkAllAsRead={() => console.log('Mark all as read')}
                />
                <UserMenu
                  user={user}
                  onLogout={handleLogout}
                  onThemeToggle={toggleDarkMode}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      {/* Help Widget */}
      <HelpWidget />
      
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={completeOnboarding} />
      )}
    </div>
  );
}
