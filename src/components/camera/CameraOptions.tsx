
import { useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraOptionsProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  uploadsRemaining?: number;
  isPaidUser?: boolean;
}

const CameraOptions = ({ onFileSelect, isLoading, uploadsRemaining, isPaidUser }: CameraOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Escaneie seu alimento</h2>
        <p className="text-foodcam-gray">
          Tire uma foto clara do seu alimento para análise nutricional 
          instantânea
        </p>
        
        {uploadsRemaining !== undefined && !isPaidUser && (
          <div className="mt-2 text-sm">
            <span className="text-foodcam-blue font-semibold">
              {uploadsRemaining} de 2
            </span> análises gratuitas restantes hoje
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
        <Button 
          variant="outline"
          className="glass-card flex flex-col h-40 gap-2 hover:border-foodcam-blue/50 hover:bg-foodcam-darker/90 transition-all"
          onClick={handleButtonClick}
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
            onChange={onFileSelect}
            className="hidden"
          />
        </Button>
        
        <Button 
          variant="outline"
          className="glass-card flex flex-col h-40 gap-2 hover:border-foodcam-blue/50 hover:bg-foodcam-darker/90 transition-all"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          <Upload size={32} className="text-foodcam-blue mb-2" />
          <span className="font-medium">Upload</span>
          <span className="text-xs text-foodcam-gray">Galeria</span>
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onFileSelect}
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

export default CameraOptions;
