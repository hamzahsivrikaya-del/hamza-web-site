-- Çocuğun paketi azalınca veliye de bildirim gönder
CREATE OR REPLACE FUNCTION notify_low_lessons()
RETURNS TRIGGER AS $$
DECLARE
  v_used    INTEGER;
  v_total   INTEGER;
  v_user_id UUID;
  v_parent_id UUID;
  v_remaining INTEGER;
  v_child_name TEXT;
BEGIN
  SELECT used_lessons, total_lessons, user_id
  INTO v_used, v_total, v_user_id
  FROM public.packages
  WHERE id = NEW.package_id;

  v_remaining := v_total - v_used;

  -- Veli bilgisini al
  SELECT parent_id, full_name
  INTO v_parent_id, v_child_name
  FROM public.users
  WHERE id = v_user_id;

  -- Son 2 ders kaldıysa bildirim
  IF v_remaining = 2 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = v_user_id
        AND type = 'low_lessons'
        AND message LIKE '%son_2_%' || NEW.package_id::text || '%'
    ) THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        v_user_id,
        'low_lessons',
        'Son 2 Dersiniz Kaldı',
        'Paketinizde yalnızca 2 ders kaldı. Yeni paket almak için antrenörünüzle iletişime geçebilirsiniz. [son_2_' || NEW.package_id::text || ']'
      );
    END IF;

    -- Veliye de bildirim gönder
    IF v_parent_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications
        WHERE user_id = v_parent_id
          AND type = 'low_lessons'
          AND message LIKE '%son_2_%' || NEW.package_id::text || '%'
      ) THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (
          v_parent_id,
          'low_lessons',
          v_child_name || ' için Son 2 Ders',
          v_child_name || ' paketinde yalnızca 2 ders kaldı. Yeni paket almak için antrenörünüzle iletişime geçin. [son_2_' || NEW.package_id::text || ']'
        );
      END IF;
    END IF;
  END IF;

  -- Son 1 ders kaldıysa bildirim
  IF v_remaining = 1 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = v_user_id
        AND type = 'low_lessons'
        AND message LIKE '%son_1_%' || NEW.package_id::text || '%'
    ) THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        v_user_id,
        'low_lessons',
        'Son Dersiniz!',
        'Paketinizde yalnızca 1 ders kaldı. Hemen yeni paket alarak kesintisiz devam edin. [son_1_' || NEW.package_id::text || ']'
      );
    END IF;

    -- Veliye de bildirim gönder
    IF v_parent_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications
        WHERE user_id = v_parent_id
          AND type = 'low_lessons'
          AND message LIKE '%son_1_%' || NEW.package_id::text || '%'
      ) THEN
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (
          v_parent_id,
          'low_lessons',
          v_child_name || ' için Son Ders!',
          v_child_name || ' paketinde yalnızca 1 ders kaldı. Hemen yeni paket alarak kesintisiz devam edin. [son_1_' || NEW.package_id::text || ']'
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
