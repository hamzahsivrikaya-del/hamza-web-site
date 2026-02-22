-- Mevcut üyelerin start_date'ini ilk ders tarihine güncelle
UPDATE public.users u
SET start_date = sub.first_lesson
FROM (
  SELECT user_id, MIN(date) AS first_lesson
  FROM public.lessons
  GROUP BY user_id
) sub
WHERE u.id = sub.user_id;

-- Yeni ders eklendiğinde, ilk dersiyse start_date güncelle
CREATE OR REPLACE FUNCTION update_user_start_date()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET start_date = NEW.date
  WHERE id = NEW.user_id
    AND (start_date IS NULL OR start_date > NEW.date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_start_date
  AFTER INSERT ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_user_start_date();
