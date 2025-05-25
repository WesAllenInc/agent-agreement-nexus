import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  if (!showPrompt) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50">
      <span className="text-sm">Install this app for a better experience!</span>
      <Button onClick={handleInstall} size="sm">Install</Button>
      <Button variant="ghost" size="icon" onClick={() => setShowPrompt(false)} aria-label="Dismiss">✕</Button>
    </div>
  );
};

export default InstallPrompt;
