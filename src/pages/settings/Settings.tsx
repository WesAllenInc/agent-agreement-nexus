import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { User, Shield, Settings as SettingsIcon, Bell } from 'lucide-react';
import { t } from '../../utils/i18n';

export default function Settings() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="md:flex">
        {/* Sidebar */}
        <div className="md:w-64 border-r border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <SettingsIcon className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              {t('user.settings')}
            </h1>
          </div>
          <nav className="py-4">
            <NavLink
              to="/settings/profile"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <User className="mr-3 h-5 w-5" />
              {t('settings.profile')}
            </NavLink>
            <NavLink
              to="/settings/security"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <Shield className="mr-3 h-5 w-5" />
              {t('settings.security')}
            </NavLink>
            <NavLink
              to="/settings/preferences"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <SettingsIcon className="mr-3 h-5 w-5" />
              {t('settings.preferences')}
            </NavLink>
            <NavLink
              to="/settings/notifications"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <Bell className="mr-3 h-5 w-5" />
              {t('settings.notifications')}
            </NavLink>
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
