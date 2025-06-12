
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if running in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
    setIsInstalled(isStandaloneMode);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[PWA] SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('[PWA] SW registration failed: ', registrationError);
          });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('[PWA] User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error during installation:', error);
      return false;
    }
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: 'Instalar FoodCam AI',
        steps: [
          'Toque no ícone de compartilhamento',
          'Role para baixo e toque em "Adicionar à Tela de Início"',
          'Toque em "Adicionar" para confirmar'
        ],
        icon: '📱'
      };
    }

    return {
      title: 'Instalar FoodCam AI',
      steps: [
        'Toque no botão "Instalar" quando aparecer',
        'Ou acesse o menu do navegador (⋮)',
        'Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"'
      ],
      icon: '📲'
    };
  };

  return {
    isInstalled,
    isInstallable,
    isIOS,
    isStandalone,
    installPWA,
    getInstallInstructions,
    canInstall: isInstallable && !isInstalled
  };
};
