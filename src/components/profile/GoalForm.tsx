
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Schema de validação com Zod
const goalFormSchema = z.object({
  daily_calories_goal: z.preprocess(
    (val) => (val === "" ? null : Number(val)), // Converter string vazia para null, senão para número
    z.number({
        invalid_type_error: "Deve ser um número.",
      })
      .positive({ message: "Deve ser um número positivo." })
      .int({ message: "Deve ser um número inteiro." })
      .nullable() // Permitir que o campo seja nulo (para limpar a meta)
  ),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  initialGoal: number | null;
  onSave: (newGoal: number | null) => Promise<void>; // Permite salvar null
  isSaving: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({ initialGoal, onSave, isSaving }) => {
  const { subscription } = useAuth();
  const isPremiumUser = subscription && subscription.isActive;
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      daily_calories_goal: initialGoal,
    },
    // Re-inicializar o formulário se initialGoal mudar externamente (ex: após salvar)
    values: {
        daily_calories_goal: initialGoal,
    }
  });

  const onSubmit = async (data: GoalFormValues) => {
    console.log("[GoalForm] onSubmit data:", data);
    await onSave(data.daily_calories_goal); 
  };

  if (!isPremiumUser) {
    return (
      <div className="bg-foodcam-darker/50 p-4 rounded-lg border border-foodcam-gray/20">
        <div className="flex items-center gap-2 mb-3 text-foodcam-gray">
          <Lock className="h-5 w-5" /> 
          <h3 className="font-medium">Recurso Premium</h3>
        </div>
        <p className="text-sm text-foodcam-gray mb-4">
          Defina metas diárias de calorias e acompanhe seu progresso com o plano Premium.
        </p>
        <Button 
          variant="outline" 
          className="w-full border-foodcam-blue/30 text-foodcam-blue"
          onClick={() => window.location.href = '/subscription'}
        >
          Fazer upgrade para Premium
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="daily_calories_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta de Calorias Diárias (kcal)</FormLabel>
              <FormControl>
                {/* Passar null como valor se o campo for nulo */}
                <Input 
                  type="number" 
                  placeholder="Ex: 2000" 
                  {...field}
                  value={field.value ?? ""} // Input espera string ou number, não null
                  onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)} // Converter para null ou number
                  className="glass-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isSaving || !form.formState.isDirty} // Desabilitar se salvando ou se não houver mudanças
          className="w-full blue-gradient"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isSaving ? "Salvando..." : "Salvar Meta"}
        </Button>
      </form>
    </Form>
  );
};

export default GoalForm;
