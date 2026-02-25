-- Kisisel hedef takibi tablosu
CREATE TABLE public.member_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('weight', 'body_fat_pct', 'chest', 'waist', 'arm', 'leg')),
  target_value DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  achieved_at TIMESTAMPTZ DEFAULT NULL,
  UNIQUE(user_id, metric_type)
);

-- RLS
ALTER TABLE public.member_goals ENABLE ROW LEVEL SECURITY;

-- Uye kendi hedeflerini gorebilir
CREATE POLICY "Users can view own goals"
  ON public.member_goals FOR SELECT
  USING (auth.uid() = user_id);

-- Uye kendi hedeflerini ekleyebilir
CREATE POLICY "Users can insert own goals"
  ON public.member_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.member_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.member_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Admin tum hedefleri gorebilir
CREATE POLICY "Admin can view all goals"
  ON public.member_goals FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Hamza uyesine bildirim gonder
INSERT INTO public.notifications (user_id, type, title, message)
SELECT id, 'manual', 'Hedeflerini Belirle!', 'Artik kisisel hedeflerini belirleyebilirsin! Ilerleme sayfasindan kilo, yag yuzdesi veya olcu hedeflerini gir ve gelisimini takip et.'
FROM public.users
WHERE full_name ILIKE '%hamza%' AND role = 'member'
LIMIT 1;
