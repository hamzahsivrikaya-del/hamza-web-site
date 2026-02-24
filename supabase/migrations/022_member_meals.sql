-- =============================================
-- Admin tarafından üyeye öğün atama sistemi
-- Sabit 4 öğün yerine esnek öğün planı
-- =============================================

-- Üye öğün planı tablosu (admin atar)
CREATE TABLE IF NOT EXISTS public.member_meals (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  order_num   SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_member_meals_user_id ON public.member_meals(user_id);

-- RLS
ALTER TABLE public.member_meals ENABLE ROW LEVEL SECURITY;

-- Üye kendi öğün planını görebilir
CREATE POLICY "member_meals_member_select" ON public.member_meals
  FOR SELECT USING (auth.uid() = user_id);

-- Admin tüm öğün planlarını yönetebilir
CREATE POLICY "member_meals_admin_all" ON public.member_meals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role erişimi
CREATE POLICY "member_meals_service_role" ON public.member_meals
  FOR SELECT USING (auth.role() = 'service_role');

-- =============================================
-- meal_logs tablosunu güncelle
-- meal_type yerine meal_id kullan
-- =============================================

-- Mevcut constraint ve kolonu kaldır
ALTER TABLE public.meal_logs DROP CONSTRAINT IF EXISTS meal_logs_user_id_date_meal_type_key;
ALTER TABLE public.meal_logs DROP CONSTRAINT IF EXISTS meal_logs_meal_type_check;
ALTER TABLE public.meal_logs DROP COLUMN IF EXISTS meal_type;

-- Yeni meal_id kolonu ekle
ALTER TABLE public.meal_logs ADD COLUMN IF NOT EXISTS meal_id UUID REFERENCES public.member_meals(id) ON DELETE CASCADE;

-- Yeni unique constraint
ALTER TABLE public.meal_logs ADD CONSTRAINT meal_logs_user_date_meal_unique UNIQUE(user_id, date, meal_id);

-- meal_id index
CREATE INDEX IF NOT EXISTS idx_meal_logs_meal_id ON public.meal_logs(meal_id);
