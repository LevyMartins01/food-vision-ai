import { useEffect, useState } from "react";
import HistoryItem from "@/components/history/HistoryItem";
import { FoodAnalysis } from "@/components/analysis/NutritionCard";
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
import { Calendar, ChevronDown, History as HistoryIcon, Trash2, Search, Filter, X, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash-es";
import type { Database } from '@/integrations/supabase/types';

interface HistoryItemWithMeta extends FoodAnalysis {
  id: string;
  date: string;
}

const History = () => {
  const { user, subscription } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItemWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isPremiumUser = subscription?.isActive;
  const [isClearing, setIsClearing] = useState(false); 

  const debouncedFetchData = debounce(async (currentSearchTerm: string) => {
    setIsLoading(true);
    let items: HistoryItemWithMeta[] = [];

    try {
      if (isPremiumUser && user) {
        console.log(`[History] Buscando do Supabase (is_deleted=false)...`);
        
        let query = supabase
          .from('food_uploads')
          .select('id, created_at, food_name, calories, protein, carbs, fat, image_url')
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (currentSearchTerm) {
          query = query.ilike('food_name', `%${currentSearchTerm}%`);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        items = (data || []).map((item): HistoryItemWithMeta => ({
          id: item.id, 
          name: item.food_name ?? "Nome não encontrado",
          confidence: 0.8,
          calories: item.calories ?? 0,
          protein: item.protein ?? 0,
          carbs: item.carbs ?? 0,
          fat: item.fat ?? 0,
          image: item.image_url ?? "/placeholder.svg", 
          servingSize: "1 porção",
          date: item.created_at ?? new Date().toISOString()
        }));

        console.log(`[History] ${items.length} itens (não deletados) carregados do Supabase.`);

      } else {
        console.log("[History] Buscando do localStorage (usuário não premium ou não logado).");
        const savedItems = JSON.parse(localStorage.getItem("foodcam-history") || "[]");
        if (currentSearchTerm) {
          items = savedItems.filter((item: HistoryItemWithMeta) => 
            item.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
          );
        } else {
          items = savedItems;
        }
        if (items.length === 0 && !currentSearchTerm) {
           items = [
             { 
               id: "example-1", 
               name: "Exemplo (Limpe o Histórico)", 
               confidence: 0.9, 
               calories: 100, 
               protein: 10, 
               carbs: 10, 
               fat: 2, 
               image: "/placeholder.svg", 
               servingSize: "1", 
               date: new Date().toISOString()
             }
           ];
        }
        console.log(`[History] ${items.length} itens carregados/filtrados do localStorage.`);
      }
      setHistoryItems(items);
    } catch (error) {
      console.error("[History] Erro ao buscar histórico:", error);
      toast.error("Falha ao carregar o histórico.");
      setHistoryItems([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedFetchData(searchTerm);
    return () => debouncedFetchData.cancel();
  }, [searchTerm, user, isPremiumUser]);

  const handleConfirmClearPremiumHistory = async () => {
    if (!user) return;
    setIsClearing(true);
    console.log("[History] Confirmado! Iniciando soft delete para usuário:", user.id);
    try {
      const { error } = await supabase
        .from('food_uploads')
        .update({ is_deleted: true })
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      if (error) throw error;

      toast.success("Histórico online ocultado com sucesso!");
      debouncedFetchData.cancel();
      debouncedFetchData(searchTerm);
    } catch (error) {
      console.error("[History] Erro ao ocultar histórico online:", error);
      toast.error("Falha ao ocultar o histórico online.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearHistory = () => {
    if (isPremiumUser && user) {
      toast.info("Limpeza do histórico online ainda não implementada.");
    } else {
      setHistoryItems([]);
      localStorage.removeItem("foodcam-history");
      toast.success("Histórico local limpo com sucesso");
    }
  };

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
                    onClick={!isPremiumUser ? handleClearHistory : undefined} 
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
                        onClick={handleConfirmClearPremiumHistory} 
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
        <div className="relative mb-6">
          <Input 
            type="text"
            placeholder="Buscar por nome do alimento..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 glass-input"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foodcam-gray" />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-foodcam-gray hover:bg-foodcam-gray/10"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {!isPremiumUser && (
         <div className="glass-card p-4 mb-6 flex items-center justify-between gap-4 border border-amber-500/30 bg-gradient-to-r from-amber-950/10 to-foodcam-darker">
            <div>
               <h4 className="font-semibold flex items-center"><Crown size={16} className="mr-1 text-amber-400"/> Recursos Premium</h4>
               <p className="text-sm text-foodcam-gray mt-1">Faça upgrade para buscar, filtrar e visualizar seu histórico completo online.</p>
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
