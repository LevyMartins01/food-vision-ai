
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GoalForm from "./GoalForm";
import type { Database } from "@/integrations/supabase/types";

type UserGoal = Database["public"]["Tables"]["user_goals"]["Row"];

interface DailyGoalsProps {
  isGoalLoading: boolean;
  currentUserGoal: UserGoal | null;
  isSavingGoal: boolean;
  caloriesConsumedToday: number | null;
  onSaveGoal: (newGoalValue: number | null) => Promise<void>;
}

const DailyGoals = ({ 
  isGoalLoading, 
  currentUserGoal, 
  isSavingGoal, 
  caloriesConsumedToday, 
  onSaveGoal 
}: DailyGoalsProps) => {
  const progressPercentage = 
    currentUserGoal?.daily_calories_goal && currentUserGoal.daily_calories_goal > 0 && caloriesConsumedToday !== null
      ? Math.min(100, Math.round((caloriesConsumedToday / currentUserGoal.daily_calories_goal) * 100)) 
      : 0;

  return (
    <div className="glass-card p-5 mb-6">
      <h2 className="text-lg font-bold mb-4">Minhas Metas Diárias</h2>
      {isGoalLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-foodcam-blue" />
        </div>
      ) : (
        <div>
          <GoalForm 
            initialGoal={currentUserGoal?.daily_calories_goal ?? null}
            onSave={onSaveGoal}
            isSaving={isSavingGoal}
          />
          {currentUserGoal && currentUserGoal.daily_calories_goal !== null && (
             <div className="mt-6 border-t border-foodcam-gray/10 pt-4 space-y-3">
               <div className="flex justify-between items-baseline">
                  <span className="text-sm text-foodcam-gray">Progresso Hoje:</span>
                  <span className="text-lg font-semibold">
                    {caloriesConsumedToday ?? 0} / {currentUserGoal.daily_calories_goal} kcal
                  </span>
               </div>
               <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-foodcam-gray/10" 
               />
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyGoals;
