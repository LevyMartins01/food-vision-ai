
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyHistoryProps {
  searchTerm: string;
}

const EmptyHistory = ({ searchTerm }: EmptyHistoryProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-8 text-center mt-6">
      <Calendar className="h-12 w-12 mx-auto mb-4 text-foodcam-gray" />
      <h3 className="text-xl font-medium mb-2">
        {searchTerm ? "Nenhum item encontrado" : "Histórico vazio"}
      </h3>
      <p className="text-foodcam-gray mb-4">
        {searchTerm 
          ? `Nenhum alimento encontrado para "${searchTerm}". Tente outra busca.` 
          : "Seus alimentos analisados aparecerão aqui."}
      </p>
      {!searchTerm && (
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => navigate("/camera")}
        >
          Analisar um alimento
        </Button>
      )}
    </div>
  );
};

export default EmptyHistory;
