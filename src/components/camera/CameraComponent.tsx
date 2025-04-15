import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { processImageFile } from "@/utils/imageUtils";
import CameraOptions from "./CameraOptions";
import UpgradeLimitMessage from "./UpgradeLimitMessage";

interface CameraComponentProps {
  onImageCapture: (imageData: string) => void;
}

const CameraComponent = ({ onImageCapture }: CameraComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
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
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setImageError(null);
    
    try {
      // Process and validate the image
      const imageData = await processImageFile(file);
      
      // Analyze the image
      onImageCapture(imageData);
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage = error instanceof Error ? error.message : "Error processing the image";
      setImageError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      // Reset the input to allow selecting the same file again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // If user has reached upload limit, show premium message and redirect button
  if (uploadCredits && !uploadCredits.canUpload && !uploadCredits.isPaidUser) {
    return <UpgradeLimitMessage />;
  }

  // Regular camera view
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <CameraOptions 
        onFileSelect={handleFileChange}
        isLoading={isLoading}
        uploadsRemaining={uploadCredits?.uploadsRemaining}
        isPaidUser={uploadCredits?.isPaidUser}
      />
      
      {isLoading && <p className="mt-2 text-center">Carregando imagem...</p>}
      {imageError && <p className="mt-2 text-center text-foodcam-red">{imageError}</p>}
    </div>
  );
};

export default CameraComponent;
