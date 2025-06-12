
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

interface PWALifecycleProps {
  onUpdate?: () => void;
  onInstall?: () => void;
}

const PWALifecycle = ({ onUpdate, onInstall }: PWALifecycleProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const { isInstalled, isInstallable, installPWA } = usePWA();

  useEffect(() => {
    // Service Worker update detection
    const handleSWUpdate = () => {
      console.log('[PWA Lifecycle] Service Worker update available');
      setUpdateAvailable(true);
      toast.info('Nova versão disponível!', {
        description: 'Clique para atualizar o aplicativo',
        action: {
          label: 'Atualizar',
          onClick: handleUpdate
        },
        duration: 10000
      });
    };

    // Online/Offline detection
    const handleOnline = () => {
      console.log('[PWA Lifecycle] App is online');
      setIsOnline(true);
      setShowOfflineToast(false);
      toast.success('Conexão restaurada!', {
        description: 'Você está online novamente',
        duration: 3000
      });
    };

    const handleOffline = () => {
      console.log('[PWA Lifecycle] App is offline');
      setIsOnline(false);
      setShowOfflineToast(true);
      toast.warning('Modo offline', {
        description: 'Algumas funcionalidades podem estar limitadas',
        duration: 5000,
        icon: <WifiOff className="h-4 w-4" />
      });
    };

    // App installed detection
    const handleAppInstalled = () => {
      console.log('[PWA Lifecycle] App installed');
      toast.success('App instalado com sucesso!', {
        description: 'Agora você pode acessar o FoodCam AI direto da sua tela inicial',
        duration: 5000
      });
      onInstall?.();
    };

    // Register service worker update listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleSWUpdate);
      
      // Check for waiting service worker
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          handleSWUpdate();
        }
      });
    }

    // Register network listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Periodic connectivity check
    const connectivityCheck = setInterval(() => {
      const currentOnline = navigator.onLine;
      if (currentOnline !== isOnline) {
        if (currentOnline) {
          handleOnline();
        } else {
          handleOffline();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleSWUpdate);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(connectivityCheck);
    };
  }, [isOnline, onInstall]);

  const handleUpdate = async () => {
    try {
      console.log('[PWA Lifecycle] Updating service worker');
      
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration?.waiting) {
          // Tell the waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Wait for the new service worker to take control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[PWA Lifecycle] New service worker activated');
            window.location.reload();
          });
        }
      }
      
      setUpdateAvailable(false);
      onUpdate?.();
      
      toast.success('Aplicativo atualizado!', {
        description: 'A página será recarregada automaticamente',
        duration: 2000
      });
      
      // Reload after short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('[PWA Lifecycle] Update failed:', error);
      toast.error('Falha na atualização', {
        description: 'Tente recarregar a página manualmente',
        duration: 5000
      });
    }
  };

  const handleInstallClick = async () => {
    const installed = await installPWA();
    if (installed) {
      toast.success('Instalação iniciada!', {
        description: 'Siga as instruções do seu navegador',
        duration: 3000
      });
    }
  };

  // Show persistent offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-16 left-4 right-4 z-40 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WifiOff className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Modo Offline</span>
          </div>
          <span className="text-xs">Funcionalidades limitadas</span>
        </div>
      </div>
    );
  }

  // Show update button if available
  if (updateAvailable) {
    return (
      <div className="fixed top-16 left-4 right-4 z-40 bg-foodcam-blue text-white px-4 py-2 rounded-lg shadow-lg animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Atualização disponível</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleUpdate}
            className="text-xs px-3 py-1 h-auto"
          >
            Atualizar
          </Button>
        </div>
      </div>
    );
  }

  // Show install button if installable and not installed
  if (isInstallable && !isInstalled) {
    return null; // The InstallPrompt component handles this
  }

  return null;
};

export default PWALifecycle;
