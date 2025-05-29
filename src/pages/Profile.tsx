import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import DailyGoals from "@/components/profile/DailyGoals";
import WeeklyProgress from "@/components/profile/WeeklyProgress";
import ProfileMenus from "@/components/profile/ProfileMenus";
import type { Database } from "@/integrations/supabase/types";

type UserGoal = Database["public"]["Tables"]["user_goals"]["Row"];

const Profile = () => {
  const { user, subscription } = useAuth();
  const [currentUserGoal, setCurrentUserGoal] = useState<UserGoal | null>(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [userStats, setUserStats] = useState({
    uploads: 0,
    totalCalories: 0,
    totalProtein: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [caloriesConsumedToday, setCaloriesConsumedToday] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

  useEffect(() => {
    if (user) {
      fetchUserGoal();
      fetchUserStats();
      fetchCaloriesConsumedToday();
    }
  }, [user]);

  const fetchUserGoal = async () => {
    if (!user) return;
    
    setIsGoalLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCurrentUserGoal(data);
    } catch (error) {
      console.error("Erro ao buscar meta do usuário:", error);
      toast.error("Erro ao carregar meta do usuário");
    } finally {
      setIsGoalLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    setStatsLoading(true);
    try {
      const { data, error } = await supabase
        .from("food_uploads")
        .select("calories, protein")
        .eq("user_id", user.id)
        .eq("is_deleted", false);

      if (error) throw error;

      const stats = data.reduce(
        (acc, upload) => ({
          uploads: acc.uploads + 1,
          totalCalories: acc.totalCalories + (upload.calories || 0),
          totalProtein: acc.totalProtein + (upload.protein || 0),
        }),
        { uploads: 0, totalCalories: 0, totalProtein: 0 }
      );

      setUserStats(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCaloriesConsumedToday = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_calories_consumed_today', {
        p_user_id: user.id
      });

      if (error) throw error;
      setCaloriesConsumedToday(data);
    } catch (error) {
      console.error("Erro ao buscar calorias consumidas hoje:", error);
    }
  };

  const handleSaveGoal = async (newGoalValue: number | null) => {
    if (!user) return;

    setIsSavingGoal(true);
    try {
      const { data, error } = await supabase
        .from("user_goals")
        .upsert({
          user_id: user.id,
          daily_calories_goal: newGoalValue,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentUserGoal(data);
      toast.success("Meta atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
      toast.error("Erro ao salvar meta");
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleManageSubscription = () => {
    // TODO: Implementar gerenciamento de assinatura
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FoodCam',
        text: 'Analise suas refeições com IA!',
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-foodcam-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-foodcam-gray">Faça login para acessar seu perfil.</p>
        </div>
      </div>
    );
  }

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário";

  return (
    <div className="min-h-screen bg-foodcam-dark text-white p-4">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          fullName={fullName}
          email={user.email || ""}
          subscription={subscription}
        />

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-foodcam-blue text-white'
                : 'text-foodcam-gray hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-foodcam-blue text-white'
                : 'text-foodcam-gray hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <>
            <UserStats userStats={userStats} statsLoading={statsLoading} />
            <DailyGoals
              isGoalLoading={isGoalLoading}
              currentUserGoal={currentUserGoal}
              isSavingGoal={isSavingGoal}
              caloriesConsumedToday={caloriesConsumedToday}
              onSaveGoal={handleSaveGoal}
            />
            <ProfileMenus 
              subscription={subscription}
              onManageSubscription={handleManageSubscription}
              onShare={handleShare}
            />
          </>
        ) : (
          <WeeklyProgress />
        )}
      </div>
    </div>
  );
};

export default Profile;
