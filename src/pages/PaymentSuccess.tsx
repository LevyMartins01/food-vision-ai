
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-12 px-4 max-w-md mx-auto text-center">
      {isLoading ? (
        <div className="space-y-6">
          <Loader2 className="h-16 w-16 text-foodcam-blue animate-spin mx-auto" />
          <h1 className="text-2xl font-bold">Confirmando seu pagamento...</h1>
          <p className="text-foodcam-gray">
            Estamos verificando o status da sua transação. Por favor, aguarde.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold">Pagamento confirmado!</h1>
          
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Seja bem-vindo ao Premium</h2>
            <p className="text-foodcam-gray mb-4">
              Seu plano premium está ativo e você agora tem acesso a:
            </p>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-foodcam-blue mr-2 flex-shrink-0" />
                <span>Análises ilimitadas de alimentos</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-foodcam-blue mr-2 flex-shrink-0" />
                <span>Histórico completo de análises</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-foodcam-blue mr-2 flex-shrink-0" />
                <span>Detalhes nutricionais avançados</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-foodcam-blue mr-2 flex-shrink-0" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => navigate("/camera")}
              className="blue-gradient"
            >
              Começar a analisar
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Voltar para o início
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
