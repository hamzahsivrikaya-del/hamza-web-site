-- Paket completed olduğunda, üyenin başka aktif paketi yoksa is_active = false yap
CREATE OR REPLACE FUNCTION auto_deactivate_member()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.packages
      WHERE user_id = NEW.user_id
        AND status = 'active'
        AND id != NEW.id
    ) THEN
      UPDATE public.users
      SET is_active = false
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_deactivate_member
  AFTER UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION auto_deactivate_member();

-- Yeni paket eklendiğinde üyeyi aktife al
CREATE OR REPLACE FUNCTION auto_activate_on_new_package()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE public.users
    SET is_active = true
    WHERE id = NEW.user_id AND is_active = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_activate_on_new_package
  AFTER INSERT ON public.packages
  FOR EACH ROW EXECUTE FUNCTION auto_activate_on_new_package();
