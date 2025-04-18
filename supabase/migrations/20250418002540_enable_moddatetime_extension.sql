-- Habilita a extensão moddatetime se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

-- Adiciona o trigger para atualizar automaticamente 'updated_at' na tabela user_goals
-- Este trigger depende da extensão moddatetime habilitada acima.
CREATE OR REPLACE TRIGGER handle_updated_at_user_goals -- Nome ligeiramente diferente para evitar conflitos potenciais
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION moddatetime (updated_at); 