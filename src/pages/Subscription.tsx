import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Subscription = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<{
    planType: string;
    isActive: boolean;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/auth");
        return;
      }
      
      fetchSubscription();
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_type, is_active")
        .single();
      
      if (error) throw error;
      
      setSubscription({
        planType: data.plan_type,
        isActive: data.is_active
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-foodcam-blue animate-spin mb-4" />
        <p>Carregando informações da assinatura...</p>
      </div>
    );
  }

  // If user already has an active paid subscription
  if (subscription && subscription.isActive && ["monthly", "annual"].includes(subscription.planType)) {
    return (
      <div className="py-12 px-4">
        <div className="glass-card p-8 text-center max-w-2xl mx-auto">
          <div className="inline-block p-3 bg-foodcam-darker rounded-full mb-6">
            <Sparkles className="h-10 w-10 text-foodcam-blue" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Assinatura Ativa</h1>
          
          <div className="mb-6 py-3 px-4 bg-foodcam-darker rounded-lg inline-block">
            <span className="font-bold mr-2">Plano:</span>
            <span className="text-foodcam-blue">
              {subscription.planType === "monthly" ? "Mensal" : "Anual"}
            </span>
          </div>
          
          <p className="text-foodcam-gray mb-6">
            Você tem acesso a todos os recursos premium do FoodCam AI, incluindo análises ilimitadas de alimentos.
          </p>
          
          <Button 
            onClick={() => navigate("/")}
            className="blue-gradient"
          >
            Voltar para o início
          </Button>
          
          <div className="mt-8 text-sm text-foodcam-gray">
            Para gerenciar sua assinatura ou cancelar, visite a seção de configurações no seu perfil.
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show subscription plans
  return (
    <div className="py-12 px-4 max-w-3xl mx-auto">
      <SubscriptionPlans />
    </div>
  );
};

export default Subscription;
