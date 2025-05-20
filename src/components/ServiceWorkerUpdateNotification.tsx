import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ServiceWorkerUpdateNotificationProps {
  registration: ServiceWorkerRegistration;
}

export function ServiceWorkerUpdateNotification({ registration }: ServiceWorkerUpdateNotificationProps) {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    // Initially check if there's a waiting worker
    if (registration.waiting) {
      setWaitingWorker(registration.waiting);
      setShowReload(true);
    }

    // Add event listener for future updates
    const onUpdate = () => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowReload(true);
      }
    };

    // Listen for new service worker updates
    registration.addEventListener('updatefound', () => {
      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowReload(true);
          }
        });
      }
    });

    // Listen for controller change events
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return () => {
      // Clean up event listeners if needed
    };
  }, [registration]);

  useEffect(() => {
    if (showReload) {
      toast.message("New version available!", {
        description: "A new version of the app is available.",
        action: {
          label: "Update now",
          onClick: () => {
            if (waitingWorker) {
              // Send skip waiting message to the waiting service worker
              waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          }
        },
        duration: Infinity,
      });
    }
  }, [showReload, waitingWorker]);

  return null; // This component doesn't render anything, it just shows a toast
}

export default ServiceWorkerUpdateNotification;
