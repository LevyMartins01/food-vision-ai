
import AuthForm from "@/components/auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Zap, Target } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    const handleUrlErrors = () => {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const error = urlParams.get('error');
      const errorCode = urlParams.get('error_code');
      
      if (error && errorCode === 'otp_expired') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    handleUrlErrors();

    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 py-8 px-4">
        {/* App Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full blue-gradient mb-4 animate-pulse-glow">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold blue-gradient bg-clip-text text-transparent mb-3">
            FoodCam AI
          </h1>
          <p className="text-lg text-foodcam-gray max-w-md mx-auto leading-relaxed">
            Analise nutricionalmente seus alimentos com inteligência artificial
          </p>
        </div>

        {/* Quick Start Card */}
        <div className="glass-card p-6 mb-8 max-w-md mx-auto animate-scale-in">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-foodcam-blue mr-2" />
            <h2 className="text-lg font-semibold">Início Rápido</h2>
          </div>
          <p className="text-foodcam-gray text-sm mb-4">
            Tire uma foto do seu alimento para obter informações nutricionais detalhadas instantaneamente
          </p>
          <div className="text-center">
            <span className="text-xs text-foodcam-blue font-medium">
              Faça login para começar a analisar alimentos
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
          <div className="glass-card p-4 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 blue-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium mb-1">Precisão</h3>
            <p className="text-xs text-foodcam-gray">
              Identificação com IA de última geração
            </p>
          </div>
          
          <div className="glass-card p-4 text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="w-12 h-12 blue-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-xs font-bold text-foodcam-blue">N</span>
              </div>
            </div>
            <h3 className="text-sm font-medium mb-1">Nutrientes</h3>
            <p className="text-xs text-foodcam-gray">
              Informações detalhadas e precisas
            </p>
          </div>
          
          <div className="glass-card p-4 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="w-12 h-12 blue-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium mb-1">Rapidez</h3>
            <p className="text-xs text-foodcam-gray">
              Análise em segundos
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="animate-scale-in" style={{animationDelay: '0.3s'}}>
          <AuthForm />
        </div>

        {/* Trial Info */}
        <div className="glass-card p-4 mt-8 max-w-md mx-auto animate-fade-in" style={{animationDelay: '0.8s'}}>
          <div className="text-center">
            <h3 className="text-sm font-medium text-foodcam-blue mb-2">
              Experimente Grátis
            </h3>
            <p className="text-xs text-foodcam-gray">
              2 análises gratuitas por dia
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-foodcam-gray animate-fade-in" style={{animationDelay: '1s'}}>
          <p className="mb-2">
            Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
          <p>
            © 2024 FoodCam AI • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
