import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodAnalysis } from "./NutritionCard";
import { getDetailedAnalysisText } from '@/services/openaiService';
import { Loader2 } from 'lucide-react';

interface DetailsModalProps {
  food: FoodAnalysis | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Função simples para converter Markdown básico (negrito) em HTML
const renderMarkdownBold = (text: string) => {
  // Substitui **texto** por <strong>texto</strong>
  const boldRegex = /\*\*(.*?)\*\*/g;
  // Quebras de linha já são tratadas por whitespace-pre-wrap, mas podemos garantir parágrafos
  const paragraphs = text.split(/\n\s*\n/); // Divide por linhas em branco
  
  return paragraphs.map((paragraph, pIndex) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    // Encontra todas as ocorrências de **texto**
    while ((match = boldRegex.exec(paragraph)) !== null) {
      // Adiciona o texto antes do negrito
      if (match.index > lastIndex) {
        parts.push(paragraph.substring(lastIndex, match.index));
      }
      // Adiciona o texto em negrito com a tag <strong>
      parts.push(<strong key={`bold-${pIndex}-${match.index}`}>{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }

    // Adiciona o texto restante após o último negrito
    if (lastIndex < paragraph.length) {
      parts.push(paragraph.substring(lastIndex));
    }

    // Retorna o parágrafo com as tags <strong> (ou apenas texto se não houver negrito)
    // Usamos um div para cada parágrafo para manter a separação visual
    return <div key={`p-${pIndex}`} className={pIndex > 0 ? "mt-2" : ""}>{parts}</div>;
  });
};

const DetailsModal = ({ food, isOpen, onOpenChange }: DetailsModalProps) => {
  const [detailedText, setDetailedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar análise detalhada quando o modal abrir e tiver dados do alimento
    if (isOpen && food && !detailedText && !isLoading && !error) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const text = await getDetailedAnalysisText(food.name);
          setDetailedText(text);
        } catch (err) {
          console.error("Erro ao buscar análise detalhada:", err);
          setError(err instanceof Error ? err.message : "Falha ao buscar detalhes.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
    // Resetar estado se o modal for fechado ou o alimento mudar
    if (!isOpen) {
      setDetailedText('');
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, food, detailedText, isLoading, error]); // Adicionado detailedText, isLoading, error às dependências

  if (!food) return null; // Não renderizar se não houver dados

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-foodcam-darker border-foodcam-gray/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-3">Detalhes da Análise</DialogTitle>
          <DialogDescription className="text-foodcam-gray">
            Análise detalhada e informações nutricionais para {food.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          {/* Imagem */}
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
            <img 
              src={food.image} 
              alt={food.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nome e Totais */}
          <h3 className="text-xl font-semibold">{food.name}</h3>
          <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm border-b border-foodcam-gray/10 pb-4">
             <div>
               <div className="font-bold text-lg">{food.calories}</div>
               <div className="text-foodcam-gray">Calorias</div>
             </div>
             <div>
               <div className="font-bold text-lg">{food.protein}g</div>
               <div className="text-foodcam-gray">Proteína</div>
             </div>
             <div>
               <div className="font-bold text-lg">{food.carbs}g</div>
               <div className="text-foodcam-gray">Carbs</div>
             </div>
          </div>

          {/* Análise Textual Detalhada */}
          <h4 className="font-semibold text-lg mb-2">Análise Detalhada</h4>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-foodcam-blue" />
              <p className="ml-2">Buscando análise detalhada...</p>
            </div>
          )}
          {error && (
            <div className="text-foodcam-red p-3 bg-red-900/20 rounded-md">
              <p><strong>Erro:</strong> {error}</p>
            </div>
          )}
          {detailedText && !isLoading && (
             <div className="text-foodcam-gray bg-black/20 p-3 rounded-md">
               {renderMarkdownBold(detailedText)}
             </div>
          )}
          {!detailedText && !isLoading && !error && (
            <p className="text-foodcam-gray italic">Análise detalhada não disponível.</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-foodcam-gray/10 hover:bg-foodcam-gray/20">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal; 