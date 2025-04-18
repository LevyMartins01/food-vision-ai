-- Tabela para armazenar as metas de calorias diárias dos usuários
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE, -- Garante apenas uma meta por usuário
  daily_calories_goal INTEGER, -- Meta de calorias diárias, pode ser nula se não definida
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger para atualizar automaticamente 'updated_at' -- MOVIDO PARA OUTRA MIGRAÇÃO
-- CREATE OR REPLACE TRIGGER handle_updated_at
-- BEFORE UPDATE ON public.user_goals
-- FOR EACH ROW
-- EXECUTE FUNCTION moddatetime (updated_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS:
-- 1. Usuários autenticados podem ver suas próprias metas
CREATE POLICY "Users can view their own goals" 
ON public.user_goals
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Usuários autenticados podem inserir suas próprias metas (apenas uma vez devido ao UNIQUE)
CREATE POLICY "Users can insert their own goals" 
ON public.user_goals
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Usuários autenticados podem atualizar suas próprias metas
CREATE POLICY "Users can update their own goals" 
ON public.user_goals
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- (Opcional, mais seguro) Impedir exclusão direta pelos usuários
-- Se quiser permitir, crie uma política DELETE similar às outras.
CREATE POLICY "Users cannot delete goals" 
ON public.user_goals
FOR DELETE 
USING (false); -- Ninguém pode deletar diretamente
