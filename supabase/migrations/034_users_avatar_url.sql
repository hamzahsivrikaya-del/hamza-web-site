-- users tablosuna avatar_url sütunu ekle
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
