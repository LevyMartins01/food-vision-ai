
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4 max-w-md mx-auto text-center">
      <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
        <X className="h-10 w-10 text-red-500" />
      </div>
      
      <h1 className="text-2xl font-bold mb-3">Pagamento cancelado</h1>
      
      <p className="text-foodcam-gray mb-8">
        Seu pagamento foi cancelado e nenhuma cobrança foi feita.
        Você pode tentar novamente quando quiser.
      </p>
      
      <div className="flex flex-col space-y-3">
        <Button 
          onClick={() => navigate("/subscription")}
          className="blue-gradient"
        >
          Tentar novamente
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
};

export default PaymentCanceled;
