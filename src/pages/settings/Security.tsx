import React, { useState } from 'react';
import { Eye, EyeOff, Lock, KeyRound, Smartphone } from 'lucide-react';
import { t } from '../../utils/i18n';

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isShowingQrCode, setIsShowingQrCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMfaToggle = () => {
    if (isMfaEnabled) {
      // In a real app, would call API to disable MFA
      setIsMfaEnabled(false);
    } else {
      // Show QR code for setup
      setIsShowingQrCode(true);
    }
  };
  
  const handleVerifyAndEnableMfa = () => {
    // In a real app, would verify code with API
    if (verificationCode.length === 6) {
      setIsMfaEnabled(true);
      setIsShowingQrCode(false);
      setVerificationCode('');
    }
  };
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would call API
    console.log('Updating password:', passwordForm);
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center">
            <Lock className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            {t('security.password')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Update your password regularly to keep your account secure
          </p>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters and include at least one uppercase letter, number, and special character.
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('security.password.update')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            {t('security.twoFactor')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Add an extra layer of security to your account
          </p>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isMfaEnabled ? 'Disable' : 'Enable'} two-factor authentication
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isMfaEnabled 
                  ? 'Your account is currently protected with two-factor authentication.' 
                  : 'We strongly recommend enabling two-factor authentication for additional security.'}
              </p>
            </div>
            <div className="ml-4">
              <button
                type="button"
                onClick={handleMfaToggle}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  isMfaEnabled
                    ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isMfaEnabled ? t('security.twoFactor.disable') : t('security.twoFactor.enable')}
              </button>
            </div>
          </div>
          
          {isShowingQrCode && (
            <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Scan this QR code with your authenticator app
              </h4>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-2 rounded-md">
                  <div className="h-48 w-48 bg-gray-200 rounded-md flex items-center justify-center">
                    {/* In a real app, this would be a QR code */}
                    <KeyRound size={64} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="w-full">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Verification Code
                  </label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      id="verificationCode"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="flex-1 block rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyAndEnableMfa}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={verificationCode.length !== 6}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            {t('security.sessions')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Manage your active sessions
          </p>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Current Session
                  </h4>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <p>Windows 11 · Chrome</p>
                    <p>Last active: Just now</p>
                    <p>Location: New York, USA</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Current
                </span>
              </div>
            </div>
            
            <div className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Mobile Session
                  </h4>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <p>iOS 17 · Mobile App</p>
                    <p>Last active: 2 hours ago</p>
                    <p>Location: New York, USA</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('security.sessions.signOutAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
