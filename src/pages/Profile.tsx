
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  HelpCircle, 
  LogOut, 
  Moon, 
  Settings, 
  Share2, 
  Shield, 
  User 
} from "lucide-react";

const Profile = () => {
  return (
    <div className="pb-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="blue-gradient p-1 rounded-full blue-glow">
          <div className="bg-foodcam-darker p-2 rounded-full">
            <User size={48} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Seu Perfil</h1>
          <p className="text-foodcam-gray">Gerencie suas preferências</p>
        </div>
      </div>
      
      <div className="glass-card p-5 mb-6">
        <h2 className="text-lg font-bold mb-4">Resumo Diário</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-foodcam-gray text-sm">Refeições</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-foodcam-gray text-sm">Calorias</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0g</div>
            <div className="text-foodcam-gray text-sm">Proteína</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="glass-card overflow-hidden">
          <ProfileMenuItem 
            icon={<Bell className="text-foodcam-blue" />}
            label="Notificações"
            description="Gerenciar alertas e lembretes"
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
          />
        </div>
        
        <div className="glass-card overflow-hidden">
          <ProfileMenuItem 
            icon={<Share2 className="text-foodcam-blue" />}
            label="Compartilhar"
            description="Convide amigos para o app"
          />
          <ProfileMenuItem 
            icon={<Shield className="text-foodcam-blue" />}
            label="Política de Privacidade"
            description="Como seus dados são utilizados"
          />
          <ProfileMenuItem 
            icon={<HelpCircle className="text-foodcam-blue" />}
            label="Ajuda & Suporte"
            description="Perguntas frequentes, contato"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full text-foodcam-red/80 hover:text-foodcam-red border-foodcam-red/20 hover:border-foodcam-red/30"
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
}

const ProfileMenuItem = ({ 
  icon, 
  label, 
  description, 
  isToggle = false,
  toggled = false
}: ProfileMenuItemProps) => (
  <div className="flex items-center justify-between p-4 hover:bg-foodcam-darker/50 transition-colors border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-foodcam-darker">
        {icon}
      </div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-foodcam-gray text-sm">{description}</div>
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
        <ChevronRight />
      </div>
    )}
  </div>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Profile;
