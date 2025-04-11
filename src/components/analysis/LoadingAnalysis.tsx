
import { Loader2 } from "lucide-react";

const LoadingAnalysis = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className="blue-gradient p-5 rounded-full mb-6 animate-pulse-blue">
        <Loader2 size={48} className="animate-spin text-white" />
      </div>
      <h2 className="text-xl font-medium mb-3">Analisando sua imagem</h2>
      <p className="text-foodcam-gray text-center max-w-xs">
        Nossa IA está identificando o alimento e calculando informações nutricionais precisas
      </p>
    </div>
  );
};

export default LoadingAnalysis;
