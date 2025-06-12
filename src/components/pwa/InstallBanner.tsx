
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

const InstallBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { canInstall, installPWA, isIOS } = usePWA();

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show banner after 3 seconds if installable
    const timer = setTimeout(() => {
      if (canInstall && !isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, isDismissed]);

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, we'll show instructions in the main install prompt
      setIsVisible(false);
    } else {
      const installed = await installPWA();
      if (installed) {
        setIsVisible(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!isVisible || !canInstall || isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-foodcam-blue to-purple-600 text-white px-4 py-2 shadow-lg animate-slide-down">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            Instale o FoodCam AI para melhor experiência
          </span>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <Button
            onClick={handleInstall}
            size="sm"
            variant="secondary"
            className="text-xs px-3 py-1 h-auto"
          >
            Instalar
          </Button>
          <Button
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
