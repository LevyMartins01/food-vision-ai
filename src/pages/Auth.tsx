
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foodcam-blue"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-foodcam-dark via-foodcam-darker to-black flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Voltar
        </Link>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-foodcam-blue to-purple-600 flex items-center justify-center mr-2">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">FoodCam AI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-400">
          © 2025 FoodCam AI • Análise nutricional inteligente
        </p>
      </div>
    </div>
  );
};

export default Auth;
