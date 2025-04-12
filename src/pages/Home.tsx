
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center mt-10 mb-14">
        <div className="relative mb-4">
          <div className="text-4xl font-bold blue-gradient bg-clip-text text-transparent">
            FoodCam AI
          </div>
          <div className="absolute -top-4 -right-8">
            <Sparkles className="text-foodcam-blue h-6 w-6" />
          </div>
        </div>
        <p className="text-foodcam-gray max-w-xs">
          Análise nutricional instantânea com inteligência artificial
        </p>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-foodcam-blue" /> 
          Início Rápido
        </h2>
        <p className="text-foodcam-gray mb-6">
          Tire uma foto do seu alimento para obter informações nutricionais detalhadas instantaneamente
        </p>
        {user ? (
          <Link to="/camera">
            <Button className="w-full blue-gradient">
              <Camera className="mr-2 h-5 w-5" />
              Analisar Alimento
            </Button>
          </Link>
        ) : (
          <div className="space-y-3">
            <Link to="/auth">
              <Button className="w-full blue-gradient">
                Entrar ou Cadastrar
              </Button>
            </Link>
            <p className="text-xs text-foodcam-gray text-center">
              Faça login para começar a analisar alimentos
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <FeatureCard 
          title="Precisão" 
          description="Identificação com IA de última geração"
          value="98%" 
        />
        <FeatureCard 
          title="Nutrientes" 
          description="Informações detalhadas e precisas"
          value="20+" 
        />
        <FeatureCard 
          title="Rapidez" 
          description="Análise em segundos"
          value="< 3s" 
        />
      </div>
      
      {!user && (
        <div className="glass-card p-5 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold mb-1">Experimente Grátis</h3>
              <p className="text-foodcam-gray text-sm">
                2 análises gratuitas por dia
              </p>
            </div>
            <Link to="/auth">
              <Button size="sm" variant="outline" className="flex items-center">
                Começar <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <div className="text-center text-xs text-foodcam-gray mt-8">
        © 2025 FoodCam AI • Análise precisa de alimentos
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  value: string;
}

const FeatureCard = ({ title, value, description }: FeatureCardProps) => (
  <div className="glass-card p-4 flex flex-col items-center text-center">
    <div className="text-2xl font-bold mb-1 blue-gradient bg-clip-text text-transparent">
      {value}
    </div>
    <div className="font-medium text-sm mb-1">{title}</div>
    <div className="text-foodcam-gray text-xs">{description}</div>
  </div>
);

export default Home;
