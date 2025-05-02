import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { t } from '../../utils/i18n';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items = [], 
  showHome = true 
}) => {
  const location = useLocation();
  
  // Generate breadcrumbs from current path if not provided
  const breadcrumbs = items.length > 0 ? items : generateFromPath(location.pathname);
  
  return (
    <nav className="flex items-center text-sm py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {showHome && (
          <li>
            <Link 
              to="/" 
              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 flex items-center"
              aria-label={t('breadcrumbs.home')}
            >
              <Home size={16} />
              <span className="sr-only">{t('breadcrumbs.home')}</span>
            </Link>
          </li>
        )}
        
        {showHome && breadcrumbs.length > 0 && (
          <li className="flex items-center" aria-hidden="true">
            <ChevronRight size={16} className="text-gray-400" />
          </li>
        )}
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <li>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 dark:text-gray-300 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.path} 
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            {index < breadcrumbs.length - 1 && (
              <li className="flex items-center" aria-hidden="true">
                <ChevronRight size={16} className="text-gray-400" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from URL path
const generateFromPath = (path: string): BreadcrumbItem[] => {
  const segments = path.split('/').filter(Boolean);
  
  // Map routes to more readable labels
  const routeLabels: Record<string, string> = {
    'agent': 'Agent Portal',
    'dashboard': 'Dashboard',
    'agreements': 'Agreements',
    'documents': 'Documents',
    'profile': 'Profile',
    'settings': 'Settings',
    'admin': 'Admin',
    'users': 'Users',
    'templates': 'Templates',
    'audit-log': 'Audit Log',
    'import-export': 'Import/Export',
    'security': 'Security',
    'preferences': 'Preferences',
    'notifications': 'Notifications',
  };
  
  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment;
    
    return { label, path };
  });
};
