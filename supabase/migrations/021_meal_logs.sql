-- =============================================
-- Beslenme Takip Sistemi
-- =============================================

-- Beslenme kayıt tablosu
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type   TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  status      TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant')),
  photo_url   TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, meal_type)
);

-- İndeksler
CREATE INDEX idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX idx_meal_logs_date ON public.meal_logs(date);
CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, date);

-- RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- Üye kendi kayıtlarını görebilir ve yönetebilir
CREATE POLICY "meal_logs_member_select" ON public.meal_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "meal_logs_member_insert" ON public.meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meal_logs_member_update" ON public.meal_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "meal_logs_member_delete" ON public.meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Admin tüm kayıtları yönetebilir
CREATE POLICY "meal_logs_admin_all" ON public.meal_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role erişimi (cron, API)
CREATE POLICY "meal_logs_service_role" ON public.meal_logs
  FOR SELECT USING (auth.role() = 'service_role');

-- =============================================
-- Fotoğraf Storage Bucket
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('meal_photos', 'meal_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Üye kendi klasörüne yükleyebilir
CREATE POLICY "meal_photo_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'meal_photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "meal_photo_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'meal_photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "meal_photo_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'meal_photos');

-- =============================================
-- Notifications tablosuna yeni tip ekle
-- =============================================

-- Mevcut CHECK constraint'i kaldır ve yenisini ekle
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('low_lessons', 'weekly_report', 'inactive', 'manual', 'nutrition_reminder'));

-- =============================================
-- Haftalık rapora beslenme uyum kolonu ekle
-- =============================================

ALTER TABLE public.weekly_reports
  ADD COLUMN IF NOT EXISTS nutrition_compliance INTEGER DEFAULT NULL;
