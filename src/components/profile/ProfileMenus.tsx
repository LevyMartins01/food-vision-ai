
import { 
  Settings, 
  Crown, 
  Share2, 
  Shield, 
  FileText, 
  HelpCircle, 
  Mail,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ProfileMenusProps {
  subscription: {
    plan: string;
    isActive: boolean;
  } | null;
  onManageSubscription: () => void;
  onShare: () => void;
}

const ProfileMenus = ({ subscription, onManageSubscription, onShare }: ProfileMenusProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {subscription && subscription.isActive && (
        <div className="glass-card overflow-hidden">
          <ProfileMenuItem 
            icon={<Settings className="text-foodcam-blue" />}
            label="Gerenciar Assinatura"
            description={`Plano ${subscription.plan === "monthly" ? "Mensal" : "Anual"}`}
            onPress={onManageSubscription}
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
          onPress={onShare}
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

export default ProfileMenus;
