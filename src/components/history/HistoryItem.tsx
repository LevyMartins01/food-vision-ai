
import { FoodAnalysis } from "../analysis/NutritionCard";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryItemProps {
  item: FoodAnalysis & { 
    id: string;
    // date already exists in FoodAnalysis
  };
}

const HistoryItem = ({ item }: HistoryItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(item.date), { 
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div className="glass-card p-4 flex gap-4 mb-4">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-foodcam-dark border-white/10 text-xs">
            {item.calories} cal
          </Badge>
          <span className="text-foodcam-gray text-xs">{timeAgo}</span>
        </div>
        
        <div className="flex gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-foodcam-blue mr-1"></div>
            <span>P: {item.protein}g</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-foodcam-green mr-1"></div>
            <span>C: {item.carbs}g</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-foodcam-red mr-1"></div>
            <span>G: {item.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
