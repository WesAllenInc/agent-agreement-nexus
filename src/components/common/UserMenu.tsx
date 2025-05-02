import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Moon, Sun, HelpCircle } from 'lucide-react';
import { t } from '../../utils/i18n';

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: 'agent' | 'admin';
  };
  onLogout: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onThemeToggle,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-2 focus:outline-none"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>

          <Link
            to="/settings/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={handleClose}
          >
            <User size={16} className="mr-2" />
            {t('user.profile')}
          </Link>

          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={handleClose}
          >
            <Settings size={16} className="mr-2" />
            {t('user.settings')}
          </Link>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => {
              onThemeToggle();
              handleClose();
            }}
          >
            {isDarkMode ? (
              <>
                <Sun size={16} className="mr-2" />
                {t('user.theme.light')}
              </>
            ) : (
              <>
                <Moon size={16} className="mr-2" />
                {t('user.theme.dark')}
              </>
            )}
          </button>

          <Link
            to="/help"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={handleClose}
          >
            <HelpCircle size={16} className="mr-2" />
            Help & Support
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => {
                onLogout();
                handleClose();
              }}
            >
              <LogOut size={16} className="mr-2" />
              {t('user.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
