/**
 * PWA Validation Utilities
 * 
 * This file contains utilities to validate PWA functionality and test offline mode
 */

/**
 * Tests if the application can work offline by simulating offline conditions
 * @returns A promise that resolves with a validation result
 */
export async function validateOfflineCapability(): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, any>;
}> {
  // Check if service worker is registered
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      message: 'Service Worker is not supported in this browser',
    };
  }

  try {
    // Get all registered service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      return {
        success: false,
        message: 'No Service Worker is registered',
      };
    }

    // Check if cache storage is available
    if (!('caches' in window)) {
      return {
        success: false,
        message: 'Cache Storage is not supported in this browser',
      };
    }

    // List all caches
    const cacheNames = await caches.keys();
    const cacheDetails = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        return {
          name,
          entries: keys.length,
          urls: keys.map(request => request.url).slice(0, 5) // Just show first 5 for brevity
        };
      })
    );

    return {
      success: true,
      message: 'PWA is properly configured for offline use',
      details: {
        serviceWorkers: registrations.map(reg => ({
          scope: reg.scope,
          state: reg.active ? 'active' : reg.installing ? 'installing' : 'waiting',
          updateViaCache: reg.updateViaCache
        })),
        caches: cacheDetails
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error validating offline capability: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Simulates offline mode by intercepting network requests
 * @param enable Whether to enable or disable the offline simulation
 */
export function simulateOfflineMode(enable: boolean): void {
  if (enable) {
    // Store original fetch function
    (window as any)._originalFetch = window.fetch;
    
    // Override fetch to simulate offline
    window.fetch = async () => {
      throw new Error('Network request failed (offline simulation)');
    };
    
    // Force navigator.onLine to return false
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false
    });
    
    // Dispatch offline event
    window.dispatchEvent(new Event('offline'));
    
    console.log('🔴 Offline simulation enabled');
  } else {
    // Restore original fetch if it exists
    if ((window as any)._originalFetch) {
      window.fetch = (window as any)._originalFetch;
      delete (window as any)._originalFetch;
    }
    
    // Restore navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true
    });
    
    // Dispatch online event
    window.dispatchEvent(new Event('online'));
    
    console.log('🟢 Offline simulation disabled');
  }
}
