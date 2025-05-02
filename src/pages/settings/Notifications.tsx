import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, FileText, AlertTriangle } from 'lucide-react';
import { t } from '../../utils/i18n';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export default function NotificationSettings() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'agreement_created',
      title: 'New Agreement',
      description: 'When a new agreement is created for you to sign',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: 'agreement_signed',
      title: 'Agreement Signed',
      description: 'When an agreement you created is signed by another party',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: 'agreement_expired',
      title: 'Agreement Expired',
      description: 'When an agreement has expired without being signed',
      email: true,
      push: false,
      inApp: true,
    },
    {
      id: 'comment_added',
      title: 'New Comment',
      description: 'When someone comments on an agreement you are involved with',
      email: false,
      push: true,
      inApp: true,
    },
    {
      id: 'security_alert',
      title: 'Security Alerts',
      description: 'Important security notifications about your account',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: 'marketing',
      title: 'Marketing & Updates',
      description: 'News, updates, and promotional information',
      email: false,
      push: false,
      inApp: false,
    },
  ]);
  
  const [emailDigest, setEmailDigest] = useState('daily');
  
  const handleToggle = (id: string, channel: 'email' | 'push' | 'inApp') => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, [channel]: !setting[channel] } 
          : setting
      )
    );
  };
  
  const handleSaveSettings = () => {
    // In a real app, would call API to save notification settings
    console.log('Saving notification settings:', { notificationSettings, emailDigest });
    // Show success message
    alert('Notification settings saved!');
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center">
            <Bell className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Notification Preferences
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Choose how and when you want to be notified
          </p>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notification Type</h4>
                <div className="flex space-x-6 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-1" />
                    <span>Push</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>In-App</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {notificationSettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex-1 pr-4">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{setting.title}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
                    </div>
                    <div className="flex space-x-6">
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={setting.email}
                            onChange={() => handleToggle(setting.id, 'email')}
                            aria-label={`Email notifications for ${setting.title}`}
                          />
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${
                            setting.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                              setting.email ? 'transform translate-x-5' : ''
                            }`}></div>
                          </div>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={setting.push}
                            onChange={() => handleToggle(setting.id, 'push')}
                            aria-label={`Push notifications for ${setting.title}`}
                          />
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${
                            setting.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                              setting.push ? 'transform translate-x-5' : ''
                            }`}></div>
                          </div>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={setting.inApp}
                            onChange={() => handleToggle(setting.id, 'inApp')}
                            aria-label={`In-app notifications for ${setting.title}`}
                          />
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${
                            setting.inApp ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                              setting.inApp ? 'transform translate-x-5' : ''
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Email Digest Frequency</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="digest-realtime"
                    name="digest"
                    type="radio"
                    value="realtime"
                    checked={emailDigest === 'realtime'}
                    onChange={() => setEmailDigest('realtime')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="digest-realtime" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Real-time (send emails as events occur)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="digest-daily"
                    name="digest"
                    type="radio"
                    value="daily"
                    checked={emailDigest === 'daily'}
                    onChange={() => setEmailDigest('daily')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="digest-daily" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Daily digest (one email per day with all updates)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="digest-weekly"
                    name="digest"
                    type="radio"
                    value="weekly"
                    checked={emailDigest === 'weekly'}
                    onChange={() => setEmailDigest('weekly')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="digest-weekly" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    Weekly digest (one email per week with all updates)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Critical Notifications
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            These notifications cannot be disabled for security reasons
          </p>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Legal Notifications</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Important legal updates and terms of service changes
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Account Security</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Critical security alerts such as password changes and unusual login attempts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}
