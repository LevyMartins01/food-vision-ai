
import { useState } from "react";
import CameraComponent from "@/components/camera/CameraComponent";
import { nanoid } from "nanoid";
import LoadingAnalysis from "@/components/analysis/LoadingAnalysis";
import NutritionCard, { FoodAnalysis } from "@/components/analysis/NutritionCard";
import { toast } from "sonner";

// Simulated mock data for demo purpose
const mockFoodData: FoodAnalysis = {
  name: "Salada de Camarão",
  confidence: 0.93,
  calories: 245,
  protein: 18,
  carbs: 12,
  fat: 14,
  servingSize: "1 porção (200g)",
  image: "" // Will be filled with captured image
};

const Camera = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  
  const handleImageCapture = (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate API call to analyze image
    setTimeout(() => {
      // For demo, we'll use the mock data with the captured image
      setAnalysisResult({
        ...mockFoodData,
        image: imageData
      });
      setIsAnalyzing(false);
    }, 2500);
  };
  
  const handleSaveAnalysis = () => {
    if (!analysisResult) return;
    
    // In a real app, this would save to a database
    // For now, we'll simulate saving to localStorage
    const savedItems = JSON.parse(localStorage.getItem("foodcam-history") || "[]");
    
    const newItem = {
      ...analysisResult,
      id: nanoid(),
      date: new Date().toISOString()
    };
    
    savedItems.unshift(newItem);
    localStorage.setItem("foodcam-history", JSON.stringify(savedItems));
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="mb-8">
      {!isAnalyzing && !analysisResult && (
        <CameraComponent onImageCapture={handleImageCapture} />
      )}
      
      {isAnalyzing && (
        <LoadingAnalysis />
      )}
      
      {!isAnalyzing && analysisResult && (
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
