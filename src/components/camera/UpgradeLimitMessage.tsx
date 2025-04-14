
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";

const UpgradeLimitMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Limite Atingido</h2>
        <p className="text-foodcam-gray mb-4">
          Você atingiu o limite diário de 2 análises gratuitas
        </p>
        <Lock className="h-16 w-16 text-foodcam-gray mx-auto mb-6" />
        <p className="mb-6">
          Faça upgrade para o plano premium para análises ilimitadas
        </p>
        <Link to="/subscription">
          <Button className="blue-gradient">
            Ver planos premium <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpgradeLimitMessage;
