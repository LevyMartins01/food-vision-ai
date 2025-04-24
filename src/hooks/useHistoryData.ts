
import { useState, useEffect } from "react";
import { debounce } from "lodash-es";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FoodAnalysis } from "@/components/analysis/NutritionCard";

interface HistoryItemWithMeta extends FoodAnalysis {
  id: string;
  date: string;
}

export const useHistoryData = (isPremiumUser: boolean, user: any, searchTerm: string) => {
  const [historyItems, setHistoryItems] = useState<HistoryItemWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const clearHistory = async () => {
    if (isPremiumUser && user) {
      setIsClearing(true);
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
    } else {
      setHistoryItems([]);
      localStorage.removeItem("foodcam-history");
      toast.success("Histórico local limpo com sucesso");
    }
  };

  useEffect(() => {
    debouncedFetchData(searchTerm);
    return () => debouncedFetchData.cancel();
  }, [searchTerm, user, isPremiumUser]);

  return {
    historyItems,
    isLoading,
    isClearing,
    clearHistory
  };
};
