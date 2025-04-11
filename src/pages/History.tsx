
import { useEffect, useState } from "react";
import HistoryItem from "@/components/history/HistoryItem";
import { FoodAnalysis } from "@/components/analysis/NutritionCard";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, History as HistoryIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface HistoryItemWithMeta extends FoodAnalysis {
  id: string;
  date: Date;
}

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItemWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from storage
    setTimeout(() => {
      const savedItems = JSON.parse(localStorage.getItem("foodcam-history") || "[]");
      
      // If no items yet, show an example item in development mode
      const items = savedItems.length > 0 
        ? savedItems 
        : [
            {
              id: "example-1",
              name: "Salada de Camarão",
              confidence: 0.93,
              calories: 245,
              protein: 18,
              carbs: 12,
              fat: 14,
              servingSize: "1 porção (200g)",
              image: "/lovable-uploads/f0e7e0fa-ea46-4b37-9cba-67e0c2eed75d.png",
              date: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
            }
          ];
      
      setHistoryItems(items);
      setIsLoading(false);
    }, 500);
  }, []);
  
  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem("foodcam-history");
    toast.success("Histórico limpo com sucesso");
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <HistoryIcon className="mr-2 text-foodcam-blue" />
          Histórico
        </h1>
        
        {historyItems.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-foodcam-gray"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      
      {!isLoading && historyItems.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-foodcam-gray" />
          <h3 className="text-xl font-medium mb-2">Nenhum item no histórico</h3>
          <p className="text-foodcam-gray mb-4">
            Seus alimentos analisados aparecerão aqui para fácil referência
          </p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.href = "/camera"}
          >
            Analisar um alimento
          </Button>
        </div>
      )}
      
      {historyItems.length > 0 && (
        <>
          <div className="space-y-4">
            {historyItems.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
          
          {historyItems.length > 5 && (
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-foodcam-gray"
            >
              Ver mais <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default History;
