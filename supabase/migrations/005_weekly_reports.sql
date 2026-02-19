-- Haftalık rapor tablosu
CREATE TABLE public.weekly_reports (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  week_start        DATE NOT NULL,   -- Pazartesi
  week_end          DATE NOT NULL,   -- Pazar
  lessons_count     INTEGER NOT NULL DEFAULT 0,
  total_hours       NUMERIC(4,1) NOT NULL DEFAULT 0,
  consecutive_weeks INTEGER NOT NULL DEFAULT 0,  -- kaç ardışık haftadır ders yapıldı
  message           TEXT NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- Üye sadece kendi raporunu okur
CREATE POLICY "weekly_reports_self" ON public.weekly_reports
  FOR SELECT USING (auth.uid() = user_id);

-- Admin tümünü yönetir
CREATE POLICY "weekly_reports_admin" ON public.weekly_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role (cron job) insert/update yapabilir
CREATE POLICY "weekly_reports_service_insert" ON public.weekly_reports
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "weekly_reports_service_update" ON public.weekly_reports
  FOR UPDATE USING (auth.role() = 'service_role');
