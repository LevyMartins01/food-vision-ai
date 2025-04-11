
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

interface NutritionCardProps {
  food: FoodAnalysis;
  onSave: () => void;
}

export interface FoodAnalysis {
  id?: string;
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  servingSize: string;
  date: string; // Changed from Date to string for consistency
}

const NutritionCard = ({ food, onSave }: NutritionCardProps) => {
  const handleSave = () => {
    onSave();
  };

  const totalNutrients = food.protein + food.carbs + food.fat;
  
  const proteinPercentage = Math.round((food.protein / totalNutrients) * 100) || 0;
  const carbsPercentage = Math.round((food.carbs / totalNutrients) * 100) || 0;
  const fatPercentage = Math.round((food.fat / totalNutrients) * 100) || 0;

  return (
    <div className="glass-card overflow-hidden animate-scale-in">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={food.image} 
          alt={food.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foodcam-darker to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <Badge variant="outline" className="bg-foodcam-darker/80 backdrop-blur-sm border-white/10">
            {Math.round(food.confidence * 100)}% confiança
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-1">{food.name}</h2>
        <div className="text-foodcam-gray text-sm mb-6">
          Porção: {food.servingSize}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{food.calories}</div>
            <div className="text-foodcam-gray text-sm">Calorias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{food.protein}g</div>
            <div className="text-foodcam-gray text-sm">Proteína</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{food.carbs}g</div>
            <div className="text-foodcam-gray text-sm">Carboidratos</div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Proteína</span>
              <span>{proteinPercentage}%</span>
            </div>
            <Progress value={proteinPercentage} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Carboidratos</span>
              <span>{carbsPercentage}%</span>
            </div>
            <Progress value={carbsPercentage} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Gordura</span>
              <span>{fatPercentage}%</span>
            </div>
            <Progress value={fatPercentage} className="h-2" />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <Button className="flex-1 blue-gradient">
            Detalhes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;
