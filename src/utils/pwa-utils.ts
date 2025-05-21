// @ts-ignore - This import is handled by the VitePWA plugin at build time
import { registerSW } from 'virtual:pwa-register';

/**
 * Registers the service worker and handles updates
 * @returns An object with update and refresh functions
 */
export function registerServiceWorker() {
  // This is the code that registers the service worker
  // and handles the update flow
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload to update?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    immediate: true
  });

  return {
    update: () => updateSW(true),
    refresh: () => window.location.reload()
  };
}

/**
 * Checks if the app is running in standalone mode (installed as PWA)
 * @returns boolean
 */
export function isRunningAsPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

/**
 * Checks if the app is running in a service worker context
 * @returns boolean
 */
export function hasServiceWorkerSupport(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Checks if the device is online
 * @returns boolean
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
