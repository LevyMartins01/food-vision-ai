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

const Profile = () => {
  const { user, signOut, subscription } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    uploads: 0,
    totalCalories: 0,
    totalProtein: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setStatsLoading(false);
        return;
      }
      setStatsLoading(true);
      console.log("[Profile] fetchUserStats: Iniciando busca para usuário:", user.id);

      try {
        // Get total uploads count
        const { count, error: countError } = await supabase
          .from("food_uploads")
          .select("*", { count: 'exact', head: true })
          .eq("user_id", user.id);
          
        if (countError) throw countError;
        
        console.log(`[Profile] fetchUserStats: Total de uploads encontrados: ${count}`);
        
        // Get nutritional totals
        const { data: nutritionData, error: nutritionError } = await supabase
          .from("food_uploads")
          .select("calories, protein")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);
        
        if (nutritionError) throw nutritionError;
        
        // Log dos dados recebidos
        console.log("[Profile] fetchUserStats: Dados nutricionais recebidos (nutritionData):", nutritionData);
        
        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        
        if (nutritionData && nutritionData.length > 0) {
          console.log(`[Profile] fetchUserStats: Calculando totais para ${nutritionData.length} registros.`);
          totalCalories = nutritionData.reduce((sum, item) => {
            // Log de cada item de caloria
            // console.log(`[Profile] Calculando calorias: item.calories=${item.calories}, sum=${sum}`);
            return sum + (item.calories || 0);
          }, 0);
          totalProtein = nutritionData.reduce((sum, item) => {
            // Log de cada item de proteína
            const proteinValue = Number(item.protein) || 0;
            console.log(`[Profile] Calculando proteína: item.protein=${item.protein}, proteinValue=${proteinValue}, sum=${sum}`);
            return sum + proteinValue;
          }, 0);
          console.log(`[Profile] fetchUserStats: Totais calculados - Calories: ${totalCalories}, Protein: ${totalProtein}`);
        } else {
          console.log("[Profile] fetchUserStats: Nenhum dado nutricional encontrado para calcular totais.");
        }
        
        setUserStats({
          uploads: count || 0,
          totalCalories,
          totalProtein: Math.round(totalProtein)
        });
        console.log("[Profile] fetchUserStats: Estado userStats atualizado.");
      } catch (error) {
        console.error("[Profile] fetchUserStats: Erro ao buscar estatísticas:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Você saiu com sucesso");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erro ao sair");
    }
  };

  const isPremiumUser = subscription && subscription.isActive && ["monthly", "annual"].includes(subscription.plan);

  const fullName = user?.user_metadata?.full_name || 
                  (user?.user_metadata?.first_name && user?.user_metadata?.last_name ? 
                    `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
                    user?.email?.split('@')[0] || "Usuário");

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
          {isPremiumUser && (
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
      
      <div className="space-y-4">
        {!isPremiumUser && (
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
            icon={<Bell className="text-foodcam-blue" />}
            label="Notificações"
            description="Gerenciar alertas e lembretes"
            onPress={() => {
              toast.info("Configurações de notificações serão adicionadas em breve");
            }}
          />
          <ProfileMenuItem 
            icon={<Moon className="text-foodcam-blue" />}
            label="Tema Escuro"
            description="Ativado"
            isToggle
            toggled={true}
          />
          <ProfileMenuItem 
            icon={<Settings className="text-foodcam-blue" />}
            label="Configurações"
            description="Idioma, unidades, privacidade"
            onPress={() => {
              toast.info("Configurações avançadas serão adicionadas em breve");
            }}
          />
        </div>
        
        <div className="glass-card overflow-hidden">
          <ProfileMenuItem 
            icon={<Share2 className="text-foodcam-blue" />}
            label="Compartilhar"
            description="Convide amigos para o app"
            onPress={() => {
              toast.info("Funcionalidade de compartilhamento será adicionada em breve");
            }}
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
