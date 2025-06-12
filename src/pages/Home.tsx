
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, TrendingUp, ChevronRight, Zap, Shield, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center pt-8 pb-12">
        <div className="relative mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-foodcam-blue to-purple-600 mb-4 shadow-2xl">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce-gentle">
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
          FoodCam AI
        </h1>
        
        <p className="text-lg text-gray-300 max-w-sm leading-relaxed mb-8">
          Análise nutricional instantânea com inteligência artificial de última geração
        </p>

        {user ? (
          <Link to="/camera" className="w-full max-w-xs">
            <Button className="w-full h-14 bg-gradient-to-r from-foodcam-blue to-purple-600 hover:from-foodcam-blue/90 hover:to-purple-600/90 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              <Camera className="mr-3 h-6 w-6" />
              Analisar Alimento
            </Button>
          </Link>
        ) : (
          <div className="w-full max-w-xs space-y-4">
            <Link to="/auth">
              <Button className="w-full h-14 bg-gradient-to-r from-foodcam-blue to-purple-600 hover:from-foodcam-blue/90 hover:to-purple-600/90 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <Sparkles className="mr-3 h-5 w-5" />
                Começar Agora
              </Button>
            </Link>
            <p className="text-sm text-gray-400">
              Gratuito • Sem compromisso
            </p>
          </div>
        )}
      </div>
      
      {/* Quick Features */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <FeatureCard 
          icon={<Zap className="w-6 h-6" />}
          title="Instantâneo" 
          value="< 3s" 
          color="from-yellow-400 to-orange-500"
        />
        <FeatureCard 
          icon={<Shield className="w-6 h-6" />}
          title="Precisão" 
          value="98%" 
          color="from-green-400 to-emerald-500"
        />
        <FeatureCard 
          icon={<TrendingUp className="w-6 h-6" />}
          title="Nutrientes" 
          value="20+" 
          color="from-blue-400 to-purple-500"
        />
      </div>
      
      {/* Main CTA Card */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-foodcam-blue to-purple-600 flex items-center justify-center mr-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Análise Completa</h2>
            <p className="text-gray-300 text-sm">Informações nutricionais detalhadas</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          Nossa IA identifica automaticamente alimentos e fornece análise nutricional completa em segundos
        </p>
        
        {user ? (
          <Link to="/camera">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <Camera className="mr-2 h-5 w-5" />
              Começar Análise
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <ChevronRight className="mr-2 h-4 w-4" />
              Criar Conta Gratuita
            </Button>
          </Link>
        )}
      </div>

      {/* Benefits */}
      {!user && (
        <div className="bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Teste Gratuito</h3>
              <p className="text-gray-300 text-sm">
                2 análises por dia • Sem cartão de crédito
              </p>
            </div>
            <Link to="/auth">
              <Button size="sm" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl border border-white/20 transition-all duration-300">
                Experimentar
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const FeatureCard = ({ icon, title, value, color }: FeatureCardProps) => (
  <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] group">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
      <div className="text-white">
        {icon}
      </div>
    </div>
    <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>
      {value}
    </div>
    <div className="text-white font-medium text-sm">{title}</div>
  </div>
);

export default Home;
