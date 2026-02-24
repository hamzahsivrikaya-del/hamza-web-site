-- Yeni üye oluşturulduğunda varsayılan 3 öğün ata
CREATE OR REPLACE FUNCTION public.assign_default_meals()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'member' THEN
    INSERT INTO public.member_meals (user_id, name, order_num) VALUES
      (NEW.id, 'Kahvaltı', 0),
      (NEW.id, 'Öğle Yemeği', 1),
      (NEW.id, 'Akşam Yemeği', 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_assign_default_meals ON public.users;
CREATE TRIGGER trg_assign_default_meals
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_meals();
