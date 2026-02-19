-- Ders eklendiğinde kalan ders az ise otomatik bildirim gönder
CREATE OR REPLACE FUNCTION notify_low_lessons()
RETURNS TRIGGER AS $$
DECLARE
  v_used    INTEGER;
  v_total   INTEGER;
  v_user_id UUID;
  v_remaining INTEGER;
BEGIN
  -- Güncel paket bilgisini al
  SELECT used_lessons, total_lessons, user_id
  INTO v_used, v_total, v_user_id
  FROM public.packages
  WHERE id = NEW.package_id;

  v_remaining := v_total - v_used;

  -- Son 2 ders kaldıysa bildirim oluştur (mükerrer önle)
  IF v_remaining = 2 THEN
    -- Aynı paket için daha önce "son_2_ders" bildirimi gönderilmediyse ekle
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = v_user_id
        AND type = 'lesson_reminder'
        AND message LIKE '%' || NEW.package_id::text || '%'
    ) THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        v_user_id,
        'lesson_reminder',
        'Son 2 Dersiniz Kaldı',
        'Paketinizde yalnızca 2 ders kaldı. Yeni paket almak için antrenörünüzle iletişime geçebilirsiniz. [' || NEW.package_id::text || ']'
      );
    END IF;
  END IF;

  -- Son 1 ders kaldıysa bildirim oluştur
  IF v_remaining = 1 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = v_user_id
        AND type = 'lesson_reminder'
        AND message LIKE '%son_1_%' || NEW.package_id::text || '%'
    ) THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        v_user_id,
        'lesson_reminder',
        'Son Dersiniz!',
        'Paketinizde yalnızca 1 ders kaldı. Hemen yeni paket alarak kesintisiz devam edin. [son_1_' || NEW.package_id::text || ']'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_low_lessons
  AFTER INSERT ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION notify_low_lessons();
