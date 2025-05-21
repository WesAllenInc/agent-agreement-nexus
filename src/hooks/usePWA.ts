import { useState, useEffect } from 'react';
import { isRunningAsPWA, hasServiceWorkerSupport } from '@/utils/pwa-utils';

interface PWAHookResult {
  isPWA: boolean;
  canInstall: boolean;
  deferredPrompt: any;
  promptInstall: () => Promise<boolean>;
  isOnline: boolean;
}

/**
 * Hook for managing PWA installation and status
 * @returns PWA status and installation functions
 */
export function usePWA(): PWAHookResult {
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if running as PWA
    setIsPWA(isRunningAsPWA());
    
    // Check if browser supports PWA
    setCanInstall(hasServiceWorkerSupport());

    // Listen for online/offline events
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setCanInstall(true);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, []);

  /**
   * Prompt the user to install the PWA
   * @returns Promise that resolves to true if installation was accepted
   */
  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('Cannot install: No installation prompt available');
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);

    // Check if the user accepted the installation
    return outcome === 'accepted';
  };

  return {
    isPWA,
    canInstall,
    deferredPrompt,
    promptInstall,
    isOnline
  };
}
