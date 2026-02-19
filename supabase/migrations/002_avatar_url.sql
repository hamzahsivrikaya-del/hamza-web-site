-- Kullanıcı profil fotoğrafı için alan
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Avatarlar için storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: üye kendi fotoğrafını yükleyebilir
CREATE POLICY "Avatar yükle" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Avatar güncelle" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Avatar herkese açık" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');
