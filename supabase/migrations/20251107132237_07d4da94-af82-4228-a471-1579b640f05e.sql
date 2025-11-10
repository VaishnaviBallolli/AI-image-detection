-- Fix search_path for track_user_login function
CREATE OR REPLACE FUNCTION public.track_user_login()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, last_login)
  VALUES (NEW.id, NEW.email, now())
  ON CONFLICT (id) 
  DO UPDATE SET last_login = now(), email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search_path for update_user_activity function
CREATE OR REPLACE FUNCTION public.update_user_activity(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_date, action_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, activity_date) 
  DO UPDATE SET action_count = user_activity.action_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;