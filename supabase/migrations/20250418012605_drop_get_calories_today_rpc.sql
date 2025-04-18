-- Remove a função RPC existente para permitir recriação
DROP FUNCTION IF EXISTS public.get_calories_consumed_today(UUID); 