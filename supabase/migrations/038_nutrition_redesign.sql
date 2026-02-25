-- Beslenme Redesign: Extra öğün desteği
ALTER TABLE public.meal_logs
  ADD COLUMN IF NOT EXISTS is_extra BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.meal_logs
  ADD COLUMN IF NOT EXISTS extra_name TEXT;

-- is_extra=true ise extra_name zorunlu
ALTER TABLE public.meal_logs
  ADD CONSTRAINT meal_logs_extra_name_check
  CHECK ((is_extra = false) OR (is_extra = true AND extra_name IS NOT NULL AND extra_name != ''));

-- is_extra=true ise meal_id NULL olmalı
ALTER TABLE public.meal_logs
  ADD CONSTRAINT meal_logs_extra_meal_id_check
  CHECK ((is_extra = false) OR (is_extra = true AND meal_id IS NULL));

-- Index
CREATE INDEX IF NOT EXISTS idx_meal_logs_is_extra ON public.meal_logs(user_id, date, is_extra);
