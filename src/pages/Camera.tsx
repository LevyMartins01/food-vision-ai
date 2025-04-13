
import { useState, useEffect } from "react";
import CameraComponent from "@/components/camera/CameraComponent";
import { nanoid } from "nanoid";
import LoadingAnalysis from "@/components/analysis/LoadingAnalysis";
import NutritionCard, { FoodAnalysis } from "@/components/analysis/NutritionCard";
import { toast } from "sonner";
import { analyzeImageWithOpenAI } from "@/services/openaiService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Camera = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const { refreshUploadCredits, user } = useAuth();
  
  useEffect(() => {
    // Verificar se a chave da API está definida
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, []);
  
  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Verificar se a chave da API da OpenAI existe
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("API key da OpenAI não configurada. Por favor, adicione a chave no arquivo .env");
      }
      
      // Analisar a imagem com a API da OpenAI
      const result = await analyzeImageWithOpenAI(imageData);
      
      setAnalysisResult(result);
      
      // Armazenar a análise no Supabase se o usuário estiver logado
      if (user) {
        try {
          await supabase
            .from("food_uploads")
            .insert({
              user_id: user.id,
              food_name: result.name,
              calories: result.calories,
              protein: result.protein,
              carbs: result.carbs,
              fat: result.fat,
              image_url: result.image.substring(0, 255), // Limitar o comprimento da URL para o banco de dados
            });
          
          // Atualizar créditos de upload após análise bem-sucedida
          await refreshUploadCredits();
        } catch (error) {
          console.error("Erro ao armazenar análise no Supabase:", error);
          // Continuar com armazenamento local mesmo se o armazenamento no Supabase falhar
        }
      }
      
    } catch (error) {
      console.error("Erro ao analisar imagem:", error);
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

  if (apiKeyMissing) {
    return (
      <div className="mb-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Chave da API não configurada</AlertTitle>
          <AlertDescription>
            A chave da API da OpenAI não está configurada. É necessário configurar a chave no arquivo .env para usar o recurso de análise de alimentos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
