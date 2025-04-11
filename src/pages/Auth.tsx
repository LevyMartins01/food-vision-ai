
import AuthForm from "@/components/auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // If user is already logged in, redirect to home
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    // Clean up subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold blue-gradient bg-clip-text text-transparent mb-2">
          FoodCam AI
        </h1>
        <p className="text-foodcam-gray">
          Analise nutricionalmente seus alimentos com inteligência artificial
        </p>
      </div>

      <AuthForm />

      <div className="mt-12 text-center text-sm text-foodcam-gray">
        <p className="mb-2">
          Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
        <p>
          © 2024 FoodCam AI • Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Auth;
