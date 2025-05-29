
import { useState } from "react";
import { Loader2, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWeeklyAnalytics } from "@/hooks/useWeeklyAnalytics";
import NutritionChart from "./NutritionChart";
import GoalProgressChart from "./GoalProgressChart";
import MacroDistributionChart from "./MacroDistributionChart";

const WeeklyProgress = () => {
  const { user, subscription } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState(4);
  const { weeklyData, dailyProgress, macroDistribution, isLoading } = useWeeklyAnalytics(user, selectedPeriod);

  if (!subscription?.isActive) {
    return (
      <div className="glass-card p-6 text-center">
        <TrendingUp size={48} className="mx-auto mb-4 text-foodcam-gray" />
        <h3 className="text-lg font-semibold mb-2">Analytics Premium</h3>
        <p className="text-foodcam-gray mb-4">
          Desbloqueie gráficos detalhados do seu progresso nutricional
        </p>
        <button className="bg-gradient-to-r from-foodcam-blue to-blue-600 text-white px-6 py-2 rounded-full font-medium">
          Upgrade para Premium
        </button>
      </div>
    );
  }

  const periodOptions = [
    { value: 2, label: "2 Semanas" },
    { value: 4, label: "1 Mês" },
    { value: 8, label: "2 Meses" },
    { value: 12, label: "3 Meses" },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-foodcam-blue" />
            <h2 className="text-xl font-bold">Progresso Nutricional</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-foodcam-gray" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="bg-foodcam-darker border border-foodcam-gray/20 rounded px-3 py-1 text-sm"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-foodcam-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <NutritionChart data={weeklyData} />
              <MacroDistributionChart data={macroDistribution} />
            </div>
            <div>
              <GoalProgressChart data={dailyProgress} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyProgress;
