
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PlanProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  planType: "monthly" | "annual";
  isLoading: boolean;
  onSelect: (planType: "monthly" | "annual") => void;
}

const Plan = ({ 
  title, 
  price, 
  period, 
  features, 
  isPopular, 
  planType,
  isLoading,
  onSelect
}: PlanProps) => (
  <div className={`glass-card p-6 ${isPopular ? 'border-foodcam-blue border-2' : ''}`}>
    {isPopular && (
      <Badge className="bg-foodcam-blue mb-4">Mais popular</Badge>
    )}
    
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    
    <div className="mb-6">
      <span className="text-3xl font-bold">{price}</span>
      <span className="text-foodcam-gray">{period}</span>
    </div>
    
    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-foodcam-blue mr-2 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button 
      className={`w-full ${isPopular ? 'blue-gradient' : ''}`}
      variant={isPopular ? 'default' : 'outline'}
      onClick={() => onSelect(planType)}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        'Assinar plano'
      )}
    </Button>
  </div>
);

const SubscriptionPlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | null>(null);
  const { refreshSubscription } = useAuth();

  const handleSelectPlan = async (planType: "monthly" | "annual") => {
    try {
      setIsLoading(true);
      setLoadingPlan(planType);

      // Using Stripe payment links provided by the user
      if (planType === "monthly") {
        window.location.href = import.meta.env.VITE_STRIPE_MONTHLY_LINK || "https://buy.stripe.com/test_aEU5ku0pP8IPaLmeUY";
      } else {
        window.location.href = import.meta.env.VITE_STRIPE_ANNUAL_LINK || "https://buy.stripe.com/test_dR600a7Sh1gn3iU5kn";
      }
      
      // Once edge function is properly set up and configured with the Stripe secret key, use this instead:
      /*
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
        
        // Refresh subscription data after payment (in case they return)
        setTimeout(() => {
          refreshSubscription();
        }, 5000);
      } else {
        throw new Error('Falha ao obter o link de pagamento');
      }
      */
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Escolha seu plano</h2>
        <p className="text-foodcam-gray">
          Desbloqueie recursos premium com um de nossos planos
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Plan
          title="Mensal"
          price="$8"
          period="/mês"
          planType="monthly"
          isLoading={isLoading && loadingPlan === "monthly"}
          onSelect={handleSelectPlan}
          features={[
            "Análises ilimitadas de alimentos",
            "Histórico completo de análises",
            "Detalhes nutricionais avançados",
            "Definição de metas diárias"
          ]}
        />
        
        <Plan
          title="Anual"
          price="$50"
          period="/ano"
          planType="annual"
          isPopular
          isLoading={isLoading && loadingPlan === "annual"}
          onSelect={handleSelectPlan}
          features={[
            "Tudo do plano mensal",
            "$4,17 por mês (economia de 48%)",
            "Metas e progresso nutricional",
            "Prioridade em novas funcionalidades"
          ]}
        />
      </div>
      
      <div className="text-center text-foodcam-gray text-sm mt-8">
        <p>
          Pagamento processado com segurança pelo Stripe. Você pode cancelar a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
