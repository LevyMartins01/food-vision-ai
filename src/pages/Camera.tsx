
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
import { AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

const Camera = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const { refreshUploadCredits, user } = useAuth();
  
  useEffect(() => {
    // Verificar se a chave da API está definida
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log("Chave API configurada:", apiKey ? "Sim" : "Não");
    setApiKeyMissing(!apiKey);
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
          // Armazenar apenas uma URL curta ou identificador no banco de dados
          // em vez da imagem base64 completa
          const truncatedImage = imageData.substring(0, 100) + "...";
          
          await supabase
            .from("food_uploads")
            .insert({
              user_id: user.id,
              food_name: result.name,
              calories: result.calories,
              protein: result.protein,
              carbs: result.carbs,
              fat: result.fat,
              image_url: truncatedImage, // Versão truncada da imagem
            });
          
          // Atualizar créditos de upload após análise bem-sucedida
          await refreshUploadCredits();
        } catch (error) {
          console.error("Erro ao armazenar análise no Supabase:", error);
          toast.error("Análise realizada com sucesso, mas houve um erro ao salvá-la no histórico online.");
          // Continuar com armazenamento local mesmo se o armazenamento no Supabase falhar
        }
      }
      
    } catch (error) {
      console.error("Erro ao analisar imagem:", error);
      let errorMessage = "Erro desconhecido na análise";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Adicionar instruções mais claras para erros comuns
        if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
          errorMessage = "Erro de autenticação com a API da OpenAI. Verifique se a chave API está configurada corretamente.";
        } else if (errorMessage.includes("429")) {
          errorMessage = "Limite de requisições da API da OpenAI atingido. Aguarde um momento e tente novamente.";
        } else if (errorMessage.includes("grande")) {
          errorMessage = "A imagem é muito grande. Tente uma imagem menor ou com resolução reduzida.";
        }
      }
      
      setError(errorMessage);
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
            A chave da API da OpenAI não está configurada ou é inválida. É necessário adicionar uma chave válida no arquivo .env para usar o recurso de análise de alimentos.
          </AlertDescription>
        </Alert>
        
        <Card className="p-4 mt-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-foodcam-blue mt-0.5 mr-2" />
            <div>
              <h3 className="text-lg font-medium">Como configurar a chave da API</h3>
              <ol className="mt-2 ml-5 list-decimal text-sm">
                <li className="mb-1">Obtenha uma chave da API da OpenAI em <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-foodcam-blue underline">platform.openai.com</a></li>
                <li className="mb-1">Adicione a chave no arquivo .env do projeto</li>
                <li className="mb-1">Reinicie o aplicativo</li>
              </ol>
            </div>
          </div>
        </Card>
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
