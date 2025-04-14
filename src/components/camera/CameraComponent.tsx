
import { useRef, useState } from "react";
import { Camera, Image, Upload, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface CameraComponentProps {
  onImageCapture: (imageData: string) => void;
}

const CameraComponent = ({ onImageCapture }: CameraComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadCredits, user } = useAuth();
  const navigate = useNavigate();

  const handleCameraClick = () => {
    // If user is not logged in, show message and redirect to auth
    if (!user) {
      toast.error("Faça login para analisar alimentos", {
        action: {
          label: "Entrar",
          onClick: () => {
            navigate("/auth");
          },
        },
      });
      return;
    }

    // If user has no upload credits left, show upgrade message and redirect to subscription
    if (uploadCredits && !uploadCredits.canUpload && !uploadCredits.isPaidUser) {
      toast.error("Você atingiu o limite de 2 análises diárias", {
        action: {
          label: "Fazer upgrade",
          onClick: () => {
            navigate("/subscription");
          },
        },
      });
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const compressImage = (file: File, maxSizeMB: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calcular o tamanho atual em MB
          const imgDataUrl = event.target?.result as string;
          const base64String = imgDataUrl.split(',')[1];
          const sizeInBytes = (base64String.length * 0.75); // Aproximação
          const sizeInMB = sizeInBytes / (1024 * 1024);
          
          console.log(`Tamanho original da imagem: ${sizeInMB.toFixed(2)} MB`);
          
          // Se a imagem já for menor que o tamanho máximo, retorne-a diretamente
          if (sizeInMB <= maxSizeMB) {
            resolve(imgDataUrl);
            return;
          }
          
          // Calcular fator de escala para reduzir o tamanho
          const scaleFactor = Math.sqrt(maxSizeMB / sizeInMB);
          width = Math.floor(width * scaleFactor);
          height = Math.floor(height * scaleFactor);
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Ajustar qualidade para JPEG
          const quality = 0.7;
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          resolve(compressedDataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Erro ao carregar a imagem para compressão'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo de imagem'));
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setImageError(null);
    
    try {
      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo selecionado não é uma imagem');
      }
      
      // Limite aumentado para 20MB
      const maxSizeMB = 20;
      const fileSizeMB = file.size / (1024 * 1024);
      
      console.log(`Arquivo selecionado: ${file.name}, Tamanho: ${fileSizeMB.toFixed(2)} MB`);
      
      if (fileSizeMB > 50) {
        throw new Error(`A imagem é muito grande (${fileSizeMB.toFixed(2)} MB). O tamanho máximo permitido é 50 MB.`);
      }
      
      // Comprimir a imagem se necessário
      const imageData = await compressImage(file, maxSizeMB);
      
      // Analisar a imagem
      onImageCapture(imageData);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar a imagem";
      setImageError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      // Resetar o input para permitir selecionar o mesmo arquivo novamente
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // If user has reached upload limit, show premium message and redirect button
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
        {isLoading && <p className="mt-2">Carregando imagem...</p>}
        {imageError && <p className="mt-2 text-foodcam-red">{imageError}</p>}
      </div>
    </div>
  );
};

export default CameraComponent;

