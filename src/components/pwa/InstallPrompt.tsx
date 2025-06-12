
import { useState } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

interface InstallPromptProps {
  onClose?: () => void;
  className?: string;
}

const InstallPrompt = ({ onClose, className = '' }: InstallPromptProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { installPWA, isIOS, getInstallInstructions, canInstall } = usePWA();

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS instructions modal
      setShowInstructions(true);
    } else {
      const installed = await installPWA();
      if (installed) {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = getInstallInstructions();

  if (!isVisible || !canInstall) return null;

  if (showInstructions && isIOS) {
    return (
      <Card className={`fixed bottom-4 left-4 right-4 z-50 bg-foodcam-darker border-foodcam-blue/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{instructions.icon}</span>
              <h3 className="text-lg font-semibold text-white">{instructions.title}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInstructions(false)}
              className="text-foodcam-gray hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <span className="bg-foodcam-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-foodcam-gray text-sm">{step}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center p-3 bg-foodcam-blue/10 rounded-lg">
            <Share className="h-5 w-5 text-foodcam-blue mr-2" />
            <span className="text-sm text-foodcam-blue font-medium">
              Procure pelo ícone de compartilhamento no seu navegador
            </span>
          </div>

          <Button
            onClick={handleClose}
            className="w-full mt-4 blue-gradient"
          >
            Entendi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`fixed bottom-4 left-4 right-4 z-50 bg-foodcam-darker border-foodcam-blue/20 animate-slide-up ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-foodcam-blue/20 p-2 rounded-lg mr-3">
              <Smartphone className="h-5 w-5 text-foodcam-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Instalar FoodCam AI</h3>
              <p className="text-sm text-foodcam-gray">
                Acesso rápido e experiência completa
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-foodcam-gray hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-foodcam-gray">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Funciona offline
          </div>
          <div className="flex items-center text-sm text-foodcam-gray">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Acesso direto da tela inicial
          </div>
          <div className="flex items-center text-sm text-foodcam-gray">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Notificações personalizadas
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            className="flex-1 blue-gradient"
          >
            <Download className="h-4 w-4 mr-2" />
            {isIOS ? 'Ver instruções' : 'Instalar agora'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-3"
          >
            Agora não
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallPrompt;
