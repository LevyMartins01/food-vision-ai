
import { Toaster } from "sonner";
import Header from "./Header";
import InstallBanner from "@/components/pwa/InstallBanner";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import PWALifecycle from "@/components/pwa/PWALifecycle";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Show install prompt after 10 seconds if not dismissed
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('install-prompt-dismissed');
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <InstallBanner />
      <PWALifecycle />
      <main className="flex-1 container max-w-md mx-auto px-4 pb-24 pt-4">
        {children}
      </main>
      <Header />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(20px)'
          }
        }}
      />
      {showInstallPrompt && (
        <InstallPrompt onClose={handleCloseInstallPrompt} />
      )}
    </div>
  );
};

export default Layout;
