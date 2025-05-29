
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WeeklyNutritionData {
  week_start: string;
  week_end: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_count: number;
  avg_daily_calories: number;
}

interface DailyGoalProgress {
  date_day: string;
  calories_consumed: number;
  calories_goal: number;
  goal_percentage: number;
}

interface MacroDistribution {
  total_protein_grams: number;
  total_carbs_grams: number;
  total_fat_grams: number;
  protein_calories: number;
  carbs_calories: number;
  fat_calories: number;
  protein_percentage: number;
  carbs_percentage: number;
  fat_percentage: number;
}

export const useWeeklyAnalytics = (user: any, weeksBack: number = 4) => {
  const [weeklyData, setWeeklyData] = useState<WeeklyNutritionData[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyGoalProgress[]>([]);
  const [macroDistribution, setMacroDistribution] = useState<MacroDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados semanais
        const { data: weeklyData, error: weeklyError } = await supabase.rpc(
          'get_weekly_nutrition_data',
          { p_user_id: user.id, p_weeks_back: weeksBack }
        );

        if (weeklyError) throw weeklyError;

        // Buscar progresso diário (últimos 7 dias)
        const { data: dailyData, error: dailyError } = await supabase.rpc(
          'get_daily_goal_progress',
          { p_user_id: user.id, p_days_back: 7 }
        );

        if (dailyError) throw dailyError;

        // Buscar distribuição de macros (últimos 7 dias)
        const { data: macroData, error: macroError } = await supabase.rpc(
          'get_macro_distribution',
          { p_user_id: user.id, p_days_back: 7 }
        );

        if (macroError) throw macroError;

        setWeeklyData(weeklyData || []);
        setDailyProgress(dailyData || []);
        setMacroDistribution(macroData?.[0] || null);
        
      } catch (error) {
        console.error("[Analytics] Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados de analytics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, weeksBack]);

  return {
    weeklyData,
    dailyProgress,
    macroDistribution,
    isLoading,
  };
};
