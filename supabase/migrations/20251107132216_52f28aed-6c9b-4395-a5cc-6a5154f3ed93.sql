-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create detection_history table
CREATE TABLE IF NOT EXISTS public.detection_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  detection_result JSONB NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.detection_history ENABLE ROW LEVEL SECURITY;

-- Create policies for detection_history
CREATE POLICY "Users can view their own detection history"
  ON public.detection_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detection history"
  ON public.detection_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_activity table for tracking daily active users
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  action_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for user_activity (admin only for reading aggregate data)
CREATE POLICY "Users can track their own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view aggregate activity"
  ON public.user_activity FOR SELECT
  USING (true);

-- Create function to track user login
CREATE OR REPLACE FUNCTION public.track_user_login()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, last_login)
  VALUES (NEW.id, NEW.email, now())
  ON CONFLICT (id) 
  DO UPDATE SET last_login = now(), email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user login tracking
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.track_user_login();

-- Create function to update activity
CREATE OR REPLACE FUNCTION public.update_user_activity(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_date, action_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, activity_date) 
  DO UPDATE SET action_count = user_activity.action_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;