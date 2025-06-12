
import { useRef } from "react";
import { Camera, Upload, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraOptionsProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  uploadsRemaining?: number;
  isPaidUser?: boolean;
}

const CameraOptions = ({ onFileSelect, isLoading, uploadsRemaining, isPaidUser }: CameraOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-foodcam-blue to-purple-600 flex items-center justify-center mx-auto shadow-2xl">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Escaneie seu Alimento
        </h2>
        <p className="text-gray-300 max-w-sm mx-auto leading-relaxed">
          Tire uma foto clara ou selecione da galeria para análise nutricional instantânea
        </p>
        
        {uploadsRemaining !== undefined && !isPaidUser && (
          <div className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-white font-medium">
              {uploadsRemaining} de 2 análises restantes hoje
            </span>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm mb-8">
        <Button 
          variant="outline"
          className="h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 hover:bg-white/15 rounded-3xl transition-all duration-300 hover:scale-[1.02] group"
          onClick={handleCameraClick}
          disabled={isLoading}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">Câmera</div>
              <div className="text-xs text-gray-300">Tirar foto</div>
            </div>
          </div>
          
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
          className="h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 hover:bg-white/15 rounded-3xl transition-all duration-300 hover:scale-[1.02] group"
          onClick={handleGalleryClick}
          disabled={isLoading}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">Galeria</div>
              <div className="text-xs text-gray-300">Selecionar</div>
            </div>
          </div>
          
          <input 
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            onChange={onFileSelect}
            className="hidden"
          />
        </Button>
      </div>
      
      {/* Tips */}
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 max-w-sm">
        <div className="flex items-center text-sm text-gray-300">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 flex-shrink-0"></div>
          <span>Melhor resultado com um único alimento por imagem</span>
        </div>
      </div>
    </div>
  );
};

export default CameraOptions;
