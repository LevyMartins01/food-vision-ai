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
    console.log("[Camera.tsx] handleImageCapture iniciada.");
    
    if (isAnalyzing) {
      console.warn("[Camera.tsx] Tentativa de iniciar análise enquanto outra já está em andamento.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    console.log("[Camera.tsx] Estado atualizado: isAnalyzing=true, error=null, analysisResult=null");
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.log("[Camera.tsx] Verificando chave API no frontend...");
      
      if (!apiKey) {
        console.error("[Camera.tsx] ERRO: Chave API da OpenAI não encontrada no frontend (import.meta.env.VITE_OPENAI_API_KEY).");
        throw new Error("API key da OpenAI não configurada. Por favor, adicione a chave no arquivo .env");
      }
      const apiKeyPreview = `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`;
      console.log(`[Camera.tsx] Chave API encontrada no frontend (prévia): ${apiKeyPreview}`);

      console.log("[Camera.tsx] Chamando analyzeImageWithOpenAI...");
      const analysisDataFromAPI = await analyzeImageWithOpenAI(imageData);
      console.log("[Camera.tsx] analyzeImageWithOpenAI retornou com sucesso:", analysisDataFromAPI);

      // COMBINAR o resultado da API com a imagem original
      const completeAnalysisResult: FoodAnalysis = {
        ...analysisDataFromAPI, // Dados da API (name, calories, etc.)
        image: imageData,       // Adiciona a imagem base64 original
        // Adicionar valores padrão para campos que podem não vir da API se necessário
        confidence: analysisDataFromAPI.confidence || 0.8, // Exemplo de valor padrão
        servingSize: analysisDataFromAPI.servingSize || "1 porção (estimada)", // Exemplo
        date: new Date().toISOString(), // Adicionar data atual
        id: nanoid() // Gerar um ID único para o resultado
      };
      
      setAnalysisResult(completeAnalysisResult); // Usar o objeto completo
      console.log("[Camera.tsx] Estado atualizado com resultado COMPLETO da análise (incluindo imagem).");
      
      // Armazenar a análise no Supabase se o usuário estiver logado
      if (user) {
        console.log("[Camera.tsx] Usuário logado. Tentando salvar no Supabase...");
        try {
          await supabase
            .from("food_uploads")
            .insert({
              user_id: user.id,
              food_name: completeAnalysisResult.name,
              calories: completeAnalysisResult.calories,
              protein: completeAnalysisResult.protein,
              carbs: completeAnalysisResult.carbs,
              fat: completeAnalysisResult.fat,
              image_url: imageData, // Salvar a string base64 COMPLETA
            });
          
          await refreshUploadCredits();
          console.log("[Camera.tsx] Análise salva no Supabase com sucesso.");
        } catch (dbError) {
          console.error("[Camera.tsx] ERRO ao salvar no Supabase:", dbError);
          toast.error("Análise realizada, mas erro ao salvar no histórico online.");
        }
      } else {
        console.log("[Camera.tsx] Usuário não logado. Análise não será salva no Supabase.");
      }
      
    } catch (analysisError) {
      console.error("[Camera.tsx] ERRO CAPTURADO durante a análise:", analysisError);
      let errorMessage = "Erro desconhecido na análise";
      
      if (analysisError instanceof Error) {
        errorMessage = analysisError.message;
        console.log(`[Camera.tsx] Mensagem de erro processada: ${errorMessage}`);
      }
      
      setError(errorMessage);
      toast.error("Não foi possível analisar a imagem. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
      console.log("[Camera.tsx] Finalizando handleImageCapture. Estado: isAnalyzing=false");
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
