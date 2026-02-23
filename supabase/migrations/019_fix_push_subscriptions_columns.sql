-- push_subscriptions: keys JSONB → p256dh TEXT + auth TEXT ayrı sütunlara geçiş
ALTER TABLE public.push_subscriptions ADD COLUMN IF NOT EXISTS p256dh TEXT;
ALTER TABLE public.push_subscriptions ADD COLUMN IF NOT EXISTS auth TEXT;

-- Mevcut JSONB verisinden migrate et (varsa)
UPDATE public.push_subscriptions
SET p256dh = keys->>'p256dh', auth = keys->>'auth'
WHERE keys IS NOT NULL AND p256dh IS NULL;

-- NOT NULL constraint ekle
ALTER TABLE public.push_subscriptions ALTER COLUMN p256dh SET NOT NULL;
ALTER TABLE public.push_subscriptions ALTER COLUMN auth SET NOT NULL;

-- Eski keys sütununu kaldır
ALTER TABLE public.push_subscriptions DROP COLUMN IF EXISTS keys;

-- unique constraint eksikse ekle
ALTER TABLE public.push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_endpoint_key;
ALTER TABLE public.push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_endpoint_key UNIQUE (user_id, endpoint);
