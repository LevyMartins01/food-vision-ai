
import { useState, useEffect } from "react";
import CameraComponent from "@/components/camera/CameraComponent";
import { nanoid } from "nanoid";
import LoadingAnalysis from "@/components/analysis/LoadingAnalysis";
import NutritionCard, { FoodAnalysis } from "@/components/analysis/NutritionCard";
import { toast } from "sonner";
import { analyzeImageWithOpenAI } from "@/services/openaiService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Camera = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { refreshUploadCredits, user } = useAuth();
  
  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Verify if OpenAI API key exists
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error("API key da OpenAI não configurada. Por favor, adicione a chave no arquivo .env");
      }
      
      // Analyze the image with OpenAI API
      const result = await analyzeImageWithOpenAI(imageData);
      
      setAnalysisResult(result);
      
      // Store the analysis in Supabase if user is logged in
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
              image_url: result.image.substring(0, 255), // Limit URL length for DB
            });
          
          // Refresh upload credits after successful analysis
          await refreshUploadCredits();
        } catch (error) {
          console.error("Error storing analysis in Supabase:", error);
          // Continue with local storage even if Supabase storage fails
        }
      }
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido na análise");
      toast.error("Não foi possível analisar a imagem. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSaveAnalysis = () => {
    if (!analysisResult) return;
    
    // Save to localStorage
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
