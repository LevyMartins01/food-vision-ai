-- Create schema for tracking user uploads
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schema for tracking uploads
CREATE TABLE IF NOT EXISTS public.food_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  food_name TEXT,
  calories INTEGER,
  protein DECIMAL,
  carbs DECIMAL,
  fat DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Create schema for subscription status
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'monthly', 'annual')),
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create function to set up a user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Create initial free subscription for the user
  INSERT INTO public.subscriptions (user_id, plan_type)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create a user profile and free subscription on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Apply RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create RLS policies for food_uploads
CREATE POLICY "Users can view their own uploads"
  ON public.food_uploads
  FOR SELECT
  USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Users can insert their own uploads"
  ON public.food_uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Users can update their own uploads (soft delete)"
  ON public.food_uploads
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to check daily upload limit
CREATE OR REPLACE FUNCTION public.check_daily_upload_limit(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_type TEXT;
  daily_count INTEGER;
  max_uploads INTEGER := 2; -- Default limit for free users
BEGIN
  -- Get user's subscription type
  SELECT plan_type INTO subscription_type
  FROM public.subscriptions
  WHERE public.subscriptions.user_id = check_daily_upload_limit.user_id
  AND is_active = TRUE;

  -- Skip limit check for paid subscribers
  IF subscription_type IN ('monthly', 'annual') THEN
    RETURN TRUE;
  END IF;

  -- Count today's uploads
  SELECT COUNT(*) INTO daily_count
  FROM public.food_uploads
  WHERE public.food_uploads.user_id = check_daily_upload_limit.user_id
  AND created_at::date = CURRENT_DATE;

  -- Return true if under limit, false otherwise
  RETURN daily_count < max_uploads;
END;
$$;

-- Adiciona um índice na nova coluna para otimizar consultas futuras (opcional, mas recomendado)
CREATE INDEX idx_food_uploads_is_deleted ON public.food_uploads (is_deleted);

-- Garante que a coluna não seja nula (opcional, mas bom para consistência)
ALTER TABLE public.food_uploads
ALTER COLUMN is_deleted SET NOT NULL;
