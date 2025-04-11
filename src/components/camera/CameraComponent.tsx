
import { useRef, useState } from "react";
import { Camera, Image, Upload, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface CameraComponentProps {
  onImageCapture: (imageData: string) => void;
}

const CameraComponent = ({ onImageCapture }: CameraComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadCredits, user } = useAuth();

  const handleCameraClick = () => {
    // If user is not logged in, show message
    if (!user) {
      toast.error("Faça login para analisar alimentos", {
        action: {
          label: "Entrar",
          onClick: () => {
            window.location.href = "/auth";
          },
        },
      });
      return;
    }

    // If user has no upload credits left, show upgrade message
    if (uploadCredits && !uploadCredits.canUpload && !uploadCredits.isPaidUser) {
      toast.error("Você atingiu o limite de 2 análises diárias", {
        action: {
          label: "Fazer upgrade",
          onClick: () => {
            window.location.href = "/subscription";
          },
        },
      });
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onImageCapture(imageData);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error("Erro ao processar a imagem");
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // If user has reached upload limit, show premium message
  if (uploadCredits && !uploadCredits.canUpload && !uploadCredits.isPaidUser) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Limite Atingido</h2>
          <p className="text-foodcam-gray mb-4">
            Você atingiu o limite diário de 2 análises gratuitas
          </p>
          <Lock className="h-16 w-16 text-foodcam-gray mx-auto mb-6" />
          <p className="mb-6">
            Faça upgrade para o plano premium para análises ilimitadas
          </p>
          <Link to="/subscription">
            <Button className="blue-gradient">
              Ver planos premium <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Regular camera view
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Escaneie seu alimento</h2>
        <p className="text-foodcam-gray">
          Tire uma foto clara do seu alimento para análise nutricional 
          instantânea
        </p>
        
        {uploadCredits && !uploadCredits.isPaidUser && (
          <div className="mt-2 text-sm">
            <span className="text-foodcam-blue font-semibold">
              {uploadCredits.uploadsRemaining} de 2
            </span> análises gratuitas restantes hoje
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
        <Button 
          variant="outline"
          className="glass-card flex flex-col h-40 gap-2 hover:border-foodcam-blue/50 hover:bg-foodcam-darker/90 transition-all"
          onClick={handleCameraClick}
          disabled={isLoading}
        >
          <Camera size={32} className="text-foodcam-blue mb-2" />
          <span className="font-medium">Tirar Foto</span>
          <span className="text-xs text-foodcam-gray">Usar câmera</span>
          <input 
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </Button>
        
        <Button 
          variant="outline"
          className="glass-card flex flex-col h-40 gap-2 hover:border-foodcam-blue/50 hover:bg-foodcam-darker/90 transition-all"
          onClick={handleCameraClick}
          disabled={isLoading}
        >
          <Upload size={32} className="text-foodcam-blue mb-2" />
          <span className="font-medium">Upload</span>
          <span className="text-xs text-foodcam-gray">Galeria</span>
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </Button>
      </div>
      
      <div className="text-center text-foodcam-gray text-sm">
        <p>Melhor resultado com um único alimento por imagem</p>
      </div>
    </div>
  );
};

export default CameraComponent;
