
import { useState } from "react";
import CameraComponent from "@/components/camera/CameraComponent";
import { nanoid } from "nanoid";
import LoadingAnalysis from "@/components/analysis/LoadingAnalysis";
import NutritionCard, { FoodAnalysis } from "@/components/analysis/NutritionCard";
import { toast } from "sonner";
import { analyzeImageWithOpenAI } from "@/services/openaiService";

const Camera = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Verificar se a chave da API está configurada
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error("API key da OpenAI não configurada. Por favor, adicione a chave no arquivo .env");
      }
      
      // Analisar a imagem com a API da OpenAI
      const result = await analyzeImageWithOpenAI(imageData);
      
      setAnalysisResult(result);
    } catch (error) {
      console.error("Erro na análise:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido na análise");
      toast.error("Não foi possível analisar a imagem. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSaveAnalysis = () => {
    if (!analysisResult) return;
    
    // Salvar no localStorage
    const savedItems = JSON.parse(localStorage.getItem("foodcam-history") || "[]");
    
    const newItem = {
      ...analysisResult,
      id: nanoid(),
      date: new Date().toISOString()
    };
    
    savedItems.unshift(newItem);
    localStorage.setItem("foodcam-history", JSON.stringify(savedItems));
    
    toast.success("Análise salva com sucesso no histórico!");
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="mb-8">
      {!isAnalyzing && !analysisResult && !error && (
        <CameraComponent onImageCapture={handleImageCapture} />
      )}
      
      {isAnalyzing && (
        <LoadingAnalysis />
      )}
      
      {error && !isAnalyzing && (
        <div className="glass-card p-6 text-center">
          <h3 className="text-xl font-medium mb-4 text-foodcam-red">Erro na Análise</h3>
          <p className="mb-4">{error}</p>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-foodcam-blue text-white rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      )}
      
      {!isAnalyzing && analysisResult && !error && (
        <div>
          <NutritionCard food={analysisResult} onSave={handleSaveAnalysis} />
          <div className="mt-4 text-center">
            <button 
              onClick={handleReset}
              className="text-foodcam-blue text-sm"
            >
              Analisar outro alimento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
