-- Recria a função para calcular o total de calorias consumidas hoje por um usuário
-- Isso garante que ela use a definição mais recente do schema, incluindo a coluna is_deleted.
CREATE OR REPLACE FUNCTION public.get_calories_consumed_today(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  total_calories INTEGER;
  start_of_day TIMESTAMPTZ;
  end_of_day TIMESTAMPTZ;
BEGIN
  -- Calcula o início e o fim do dia atual na timezone do servidor
  start_of_day := date_trunc('day', now());
  end_of_day := date_trunc('day', now()) + interval '1 day';

  -- Soma as calorias dos uploads não deletados do usuário feitos hoje
  SELECT COALESCE(SUM(calories), 0)
  INTO total_calories
  FROM public.food_uploads
  WHERE user_id = p_user_id
    AND is_deleted = FALSE -- Esta coluna deve ser visível agora
    AND created_at >= start_of_day
    AND created_at < end_of_day;

  RETURN total_calories;
END;
$$;
