-- Web Push aboneliklerini sakla
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi aboneliğini yönetebilir
CREATE POLICY "push_subs_self" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Sadece service role (admin API) herkesi görebilir - push gönderimi için
CREATE POLICY "push_subs_service_role" ON public.push_subscriptions
  FOR SELECT USING (auth.role() = 'service_role');
