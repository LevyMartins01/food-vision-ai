
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import DailyGoals from "@/components/profile/DailyGoals";
import ProfileMenus from "@/components/profile/ProfileMenus";

type UserGoal = Database["public"]["Tables"]["user_goals"]["Row"];

const Profile = () => {
  const { user, signOut, subscription } = useAuth();
  const [userStats, setUserStats] = useState({
    uploads: 0,
    totalCalories: 0,
    totalProtein: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentUserGoal, setCurrentUserGoal] = useState<UserGoal | null>(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true); 
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [caloriesConsumedToday, setCaloriesConsumedToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setStatsLoading(false);
        setIsGoalLoading(false);
        setCaloriesConsumedToday(null);
        return;
      }
      setStatsLoading(true);
      setIsGoalLoading(true);
      console.log("[Profile] fetchProfileData: Iniciando busca para usuário:", user.id);
      setCaloriesConsumedToday(null);

      try {
        // Buscar Estatísticas
        const { count, error: countError } = await supabase
          .from("food_uploads")
          .select("*", { count: 'exact', head: true })
          .eq("user_id", user.id);
          
        if (countError) throw countError;
        console.log(`[Profile] fetchProfileData: Total de uploads encontrados: ${count}`);
        
        const { data: nutritionData, error: nutritionError } = await supabase
          .from("food_uploads")
          .select("calories, protein")
          .eq("user_id", user.id);

        if (nutritionError) throw nutritionError;
        console.log("[Profile] fetchProfileData: Dados nutricionais recebidos:", nutritionData);
        
        let totalCalories = 0;
        let totalProtein = 0;
        if (nutritionData && nutritionData.length > 0) {
          totalCalories = nutritionData.reduce((sum, item) => sum + (item.calories || 0), 0);
          totalProtein = nutritionData.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);
        }
        
        setUserStats({
          uploads: count || 0,
          totalCalories,
          totalProtein: Math.round(totalProtein)
        });
        console.log("[Profile] fetchProfileData: Estado userStats atualizado.");

        // Buscar Meta de Calorias e Consumo de Hoje (APENAS SE PREMIUM)
        if (subscription && subscription.isActive) {
          console.log("[Profile] fetchProfileData: Usuário premium, buscando meta e consumo de hoje...");
          
          const { data: goalData, error: goalError } = await supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          if (goalError) throw goalError;
          console.log("[Profile] fetchProfileData: Meta encontrada:", goalData);
          setCurrentUserGoal(goalData);

          console.log("[Profile] fetchProfileData: Chamando RPC get_calories_consumed_today...");
          
          const { data: consumedCalories, error: rpcError } = await supabase.rpc(
            'get_calories_consumed_today',
            { p_user_id: user.id }
          );

          if (rpcError) {
            console.error("[Profile] fetchProfileData: Erro ao chamar RPC:", rpcError);
            throw rpcError;
          }

          console.log(`[Profile] fetchProfileData: Calorias consumidas hoje (via RPC): ${consumedCalories}`);
          setCaloriesConsumedToday(consumedCalories ?? 0);

        } else {
           console.log("[Profile] fetchProfileData: Usuário não premium, não busca meta ou consumo.");
           setCurrentUserGoal(null);
           setCaloriesConsumedToday(null);
        }

      } catch (error) {
        console.error("[Profile] fetchProfileData: Erro ao buscar dados do perfil:", error);
        toast.error("Falha ao carregar dados do perfil.");
      } finally {
        setStatsLoading(false);
        setIsGoalLoading(false); 
      }
    };
    
    fetchProfileData();
  }, [user, subscription]); 

  const handleSaveGoal = async (newGoalValue: number | null) => {
    if (!user) return;
    if (newGoalValue !== null && newGoalValue <= 0) {
      toast.error("A meta de calorias deve ser um número positivo.");
      return;
    }

    setIsSavingGoal(true);
    console.log(`[Profile] handleSaveGoal: Salvando meta ${newGoalValue} para usuário ${user.id}`);
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .upsert({
          user_id: user.id,
          daily_calories_goal: newGoalValue, 
        }, { 
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;

      console.log("[Profile] handleSaveGoal: Meta salva com sucesso:", data);
      setCurrentUserGoal(data);
      toast.success("Meta de calorias salva com sucesso!");

    } catch(error) {
      console.error("[Profile] handleSaveGoal: Erro ao salvar meta:", error);
      toast.error("Falha ao salvar a meta de calorias.");
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Você saiu com sucesso");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erro ao sair");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { returnUrl: window.location.origin + '/profile' }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast.error('Não foi possível acessar o portal de gerenciamento da assinatura');
    }
  };

  const handleShare = async () => {
    const shareUrl = 'https://foodcamai.com';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'FoodCam AI',
          text: 'Análise nutricional com IA em tempo real',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copiado para a área de transferência!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Erro ao compartilhar');
      }
    }
  };

  const isPremiumUser = subscription && subscription.isActive;

  const fullName = user?.user_metadata?.full_name || 
                  (user?.user_metadata?.first_name && user?.user_metadata?.last_name ? 
                    `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
                    user?.email?.split('@')[0] || "Usuário");

  return (
    <div className="pb-8">
      <ProfileHeader 
        fullName={fullName}
        email={user?.email || ""}
        subscription={subscription}
      />
      
      <UserStats 
        userStats={userStats}
        statsLoading={statsLoading}
      />
      
      {isPremiumUser && (
        <DailyGoals 
          isGoalLoading={isGoalLoading}
          currentUserGoal={currentUserGoal}
          isSavingGoal={isSavingGoal}
          caloriesConsumedToday={caloriesConsumedToday}
          onSaveGoal={handleSaveGoal}
        />
      )}
      
      <ProfileMenus 
        subscription={subscription}
        onManageSubscription={handleManageSubscription}
        onShare={handleShare}
      />
      
      <Button 
        variant="outline" 
        className="w-full text-foodcam-red/80 hover:text-foodcam-red border-foodcam-red/20 hover:border-foodcam-red/30"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
      
      <div className="text-center text-xs text-foodcam-gray mt-8">
        Versão 1.0.0
      </div>
    </div>
  );
};

export default Profile;
