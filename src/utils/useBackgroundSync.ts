// Utility hook for React components to register background sync for failed POSTs
// Usage: call useBackgroundSync() in your form components
import { useEffect } from 'react';

export function useBackgroundSync() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        window.addEventListener('online', () => {
          reg.sync.register('bg-sync').catch(() => {});
        });
      });
    }
  }, []);
}
