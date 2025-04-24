
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { History as HistoryIcon, Trash2, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import HistoryItem from "@/components/history/HistoryItem";
import HistorySearch from "@/components/history/HistorySearch";
import EmptyHistory from "@/components/history/EmptyHistory";
import { useHistoryData } from "@/hooks/useHistoryData";
import { Crown } from "lucide-react";

const History = () => {
  const { user, subscription } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const isPremiumUser = subscription?.isActive;
  
  const { historyItems, isLoading, isClearing, clearHistory } = useHistoryData(
    !!isPremiumUser,
    user,
    searchTerm
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <HistoryIcon className="mr-2 text-foodcam-blue" />
          Histórico
        </h1>
        
        <div className="flex items-center gap-2">
           {historyItems.length > 0 && !isLoading && (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`text-foodcam-gray ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isPremiumUser ? "Ocultar histórico online" : "Limpar histórico local"}
                    disabled={isClearing}
                    onClick={!isPremiumUser ? clearHistory : undefined} 
                  >
                    {isClearing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline ml-1">Limpar</span>
                  </Button>
                </AlertDialogTrigger>
                {isPremiumUser && (
                  <AlertDialogContent className="bg-foodcam-darker border-foodcam-gray/20 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ocultar Histórico?</AlertDialogTitle>
                      <AlertDialogDescription className="text-foodcam-gray">
                        Esta ação irá ocultar todos os itens do seu histórico online.
                        Os dados ainda serão considerados em resumos e estatísticas gerais.
                        Você tem certeza?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-foodcam-gray/10 hover:bg-foodcam-gray/20">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={clearHistory} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Sim, ocultar histórico
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
             </AlertDialog>
           )}
           {isPremiumUser && (
              <Button variant="outline" size="sm" className="text-foodcam-gray" disabled> 
                 <Filter className="h-4 w-4" />
                 <span className="hidden sm:inline ml-1">Filtros</span> 
              </Button>
           )}
        </div>
      </div>

      {isPremiumUser && (
        <HistorySearch 
          searchTerm={searchTerm}
          onChange={handleSearchChange}
          onClear={clearSearch}
        />
      )}

      {!isPremiumUser && (
         <div className="glass-card p-4 mb-6 flex items-center justify-between gap-4 border border-amber-500/30 bg-gradient-to-r from-amber-950/10 to-foodcam-darker">
            <div>
               <h4 className="font-semibold flex items-center">
                 <Crown size={16} className="mr-1 text-amber-400"/> 
                 Recursos Premium
               </h4>
               <p className="text-sm text-foodcam-gray mt-1">
                 Faça upgrade para buscar, filtrar e visualizar seu histórico completo online.
               </p>
            </div>
            <Link to="/subscription">
               <Button size="sm" className="blue-gradient flex-shrink-0">Ver Planos</Button>
            </Link>
         </div>
      )}

      {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-foodcam-blue" />
          </div>
      )}
      
      {!isLoading && historyItems.length === 0 && (
        <EmptyHistory searchTerm={searchTerm} />
      )}
      
      {!isLoading && historyItems.length > 0 && (
          <div className="space-y-4">
            {historyItems.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
      )}
    </div>
  );
};

export default History;
