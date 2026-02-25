-- Avatars storage bucket oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('avatars', 'avatars', true, 15728640)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 15728640;

-- Herkes okuyabilsin
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Kullanıcı kendi klasörüne yükleyebilsin
CREATE POLICY "avatars_user_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Kullanıcı kendi dosyasını güncelleyebilsin
CREATE POLICY "avatars_user_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Kullanıcı kendi dosyasını silebilsin
CREATE POLICY "avatars_user_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
