import { Button } from "@/components/ui/button";
import { 
  Bell, 
  HelpCircle, 
  LogOut, 
  Moon, 
  Settings, 
  Share2, 
  Shield, 
  User,
  Crown,
  ChevronRight as ChevronRightIcon,
  Mail,
  FileText,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
// Importar o tipo da tabela (será gerado)
import type { Database } from "@/integrations/supabase/types";
// Importar o formulário de meta
import GoalForm from "@/components/profile/GoalForm";
// Importar componente de progresso (opcional, para visualização)
import { Progress } from "@/components/ui/progress";

type UserGoal = Database["public"]["Tables"]["user_goals"]["Row"];
// Tipo específico para a seleção de calorias (não mais necessário para RPC)
// type FoodUploadCalories = Pick<Database["public"]["Tables"]["food_uploads"]["Row"], 'calories'>;

const Profile = () => {
  const { user, signOut, subscription } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    uploads: 0,
    totalCalories: 0,
    totalProtein: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  // Novos estados para metas
  const [currentUserGoal, setCurrentUserGoal] = useState<UserGoal | null>(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true); 
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  // Novo estado para calorias consumidas hoje
  const [caloriesConsumedToday, setCaloriesConsumedToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setStatsLoading(false);
        setIsGoalLoading(false); // Parar loading da meta se não houver usuário
        setCaloriesConsumedToday(null);
        return;
      }
      setStatsLoading(true);
      setIsGoalLoading(true); // Iniciar loading da meta
      console.log("[Profile] fetchProfileData: Iniciando busca para usuário:", user.id);
      // Resetar calorias consumidas antes de buscar
      setCaloriesConsumedToday(null);

      try {
        // Buscar Estatísticas (código existente)
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
        // .order("created_at", { ascending: false })
        // .limit(100); // Remover limit para calcular totais corretos?
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
          
          // Buscar Meta (código existente)
          const { data: goalData, error: goalError } = await supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          if (goalError) throw goalError;
          console.log("[Profile] fetchProfileData: Meta encontrada:", goalData);
          setCurrentUserGoal(goalData);

          // Buscar Calorias Consumidas Hoje usando RPC
          console.log("[Profile] fetchProfileData: Chamando RPC get_calories_consumed_today...");
          
          const { data: consumedCalories, error: rpcError } = await supabase.rpc(
            'get_calories_consumed_today',
            { p_user_id: user.id } // Passando o parâmetro esperado pela função SQL
          );

          if (rpcError) {
            console.error("[Profile] fetchProfileData: Erro ao chamar RPC:", rpcError);
            throw rpcError; // Propagar o erro
          }

          // O RPC retorna diretamente o número
          console.log(`[Profile] fetchProfileData: Calorias consumidas hoje (via RPC): ${consumedCalories}`);
          setCaloriesConsumedToday(consumedCalories ?? 0); // Usar 0 se RPC retornar null por algum motivo

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
    // Adicionar isPremiumUser como dependência?
  }, [user, subscription]); 

  // Função para salvar/atualizar a meta
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
          // created_at é default, updated_at será atualizado pelo trigger
        }, { 
          onConflict: 'user_id', // Se já existir linha para user_id, atualiza
        })
        .select() // Seleciona o registro inserido/atualizado
        .single(); // Espera exatamente um resultado

      if (error) throw error;

      console.log("[Profile] handleSaveGoal: Meta salva com sucesso:", data);
      setCurrentUserGoal(data); // Atualiza o estado local com a meta salva
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

  // Calcular progresso (evitar divisão por zero)
  const progressPercentage = 
    currentUserGoal?.daily_calories_goal && currentUserGoal.daily_calories_goal > 0 && caloriesConsumedToday !== null
      ? Math.min(100, Math.round((caloriesConsumedToday / currentUserGoal.daily_calories_goal) * 100)) 
      : 0;

  return (
    <div className="pb-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="blue-gradient p-1 rounded-full blue-glow">
          <div className="bg-foodcam-darker p-2 rounded-full">
            <User size={48} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{fullName}</h1>
          <p className="text-foodcam-gray">{user?.email}</p>
          {subscription && subscription.isActive && (
            <div className="flex items-center mt-1 text-amber-400">
              <Crown size={14} className="mr-1" />
              <span className="text-sm font-medium">
                Plano {subscription.plan === "monthly" ? "Mensal" : "Anual"}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-card p-5 mb-6 min-h-[100px]">
        <h2 className="text-lg font-bold mb-4">Resumo</h2>
        {statsLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-foodcam-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{userStats.uploads}</div>
              <div className="text-foodcam-gray text-sm">Refeições</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{userStats.totalCalories}</div>
              <div className="text-foodcam-gray text-sm">Calorias</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{userStats.totalProtein}g</div>
              <div className="text-foodcam-gray text-sm">Proteína</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Seção de Metas (Premium) */}
      {isPremiumUser && (
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
                onSave={handleSaveGoal}
                isSaving={isSavingGoal}
              />
              {/* Monitoramento do Progresso */}
              {currentUserGoal && currentUserGoal.daily_calories_goal !== null && (
                 <div className="mt-6 border-t border-foodcam-gray/10 pt-4 space-y-3">
                   <div className="flex justify-between items-baseline">
                      <span className="text-sm text-foodcam-gray">Progresso Hoje:</span>
                      <span className="text-lg font-semibold">
                        {caloriesConsumedToday ?? 0} / {currentUserGoal.daily_calories_goal} kcal
                      </span>
                   </div>
                   {/* Barra de Progresso Opcional - Calcular apenas se a meta existir */}
                   <Progress 
                      value={progressPercentage} 
                      className="h-2 bg-foodcam-gray/10" 
                   />
                 </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {subscription && subscription.isActive && (
          <div className="glass-card overflow-hidden">
            <ProfileMenuItem 
              icon={<Settings className="text-foodcam-blue" />}
              label="Gerenciar Assinatura"
              description={`Plano ${subscription.plan === "monthly" ? "Mensal" : "Anual"}`}
              onPress={handleManageSubscription}
            />
          </div>
        )}
        
        {!subscription && (
          <Link to="/subscription" className="block">
            <div className="glass-card p-5 flex items-center justify-between border-foodcam-blue/30 border bg-gradient-to-r from-foodcam-darker to-foodcam-dark">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-foodcam-blue/20">
                  <Crown className="text-foodcam-blue" />
                </div>
                <div className="ml-3">
                  <div className="font-medium">Faça upgrade para o Premium</div>
                  <div className="text-foodcam-gray text-sm">Análises ilimitadas e mais</div>
                </div>
              </div>
              <ChevronRightIcon className="text-foodcam-gray" />
            </div>
          </Link>
        )}
        
        <div className="glass-card overflow-hidden">
          <ProfileMenuItem 
            icon={<Share2 className="text-foodcam-blue" />}
            label="Compartilhar"
            description="Convide amigos para o app"
            onPress={handleShare}
          />
          <ProfileMenuItem 
            icon={<Shield className="text-foodcam-blue" />}
            label="Política de Privacidade"
            description="Como seus dados são utilizados"
            onPress={() => navigate("/privacy-policy")}
          />
          <ProfileMenuItem 
            icon={<FileText className="text-foodcam-blue" />}
            label="Termos de Serviço"
            description="Regras de uso do aplicativo"
            onPress={() => navigate("/terms-of-service")}
          />
          <ProfileMenuItem 
            icon={<HelpCircle className="text-foodcam-blue" />}
            label="Ajuda & Suporte"
            description="Perguntas frequentes, contato"
            onPress={() => {
              window.location.href = "mailto:contato@lm7upgrade.com.br";
            }}
            extraIcon={<Mail className="h-4 w-4 text-foodcam-gray mr-2" />}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full text-foodcam-red/80 hover:text-foodcam-red border-foodcam-red/20 hover:border-foodcam-red/30"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
      
      <div className="text-center text-xs text-foodcam-gray mt-8">
        Versão 1.0.0
      </div>
    </div>
  );
};

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  isToggle?: boolean;
  toggled?: boolean;
  onPress?: () => void;
  extraIcon?: React.ReactNode;
}

const ProfileMenuItem = ({ 
  icon, 
  label, 
  description, 
  isToggle = false,
  toggled = false,
  onPress,
  extraIcon
}: ProfileMenuItemProps) => (
  <div 
    className="flex items-center justify-between p-4 hover:bg-foodcam-darker/50 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
    onClick={onPress}
  >
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-foodcam-darker">
        {icon}
      </div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-foodcam-gray text-sm flex items-center">
          {extraIcon}{description}
        </div>
      </div>
    </div>
    {isToggle ? (
      <div className={`h-6 w-12 rounded-full relative ${toggled ? 'bg-foodcam-blue' : 'bg-foodcam-gray-dark'}`}>
        <div 
          className={`h-5 w-5 rounded-full bg-white absolute top-0.5 transition-all ${toggled ? 'right-0.5' : 'left-0.5'}`}
        />
      </div>
    ) : (
      <div className="text-foodcam-gray">
        <ChevronRightIcon />
      </div>
    )}
  </div>
);

export default Profile;
