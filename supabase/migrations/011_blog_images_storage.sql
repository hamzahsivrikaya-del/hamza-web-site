-- Blog görselleri için storage policy
-- Bucket zaten public:true olarak oluşturuldu (SELECT otomatik açık)

-- Authenticated kullanıcılar upload yapabilir
CREATE POLICY "Auth Upload blog-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Authenticated kullanıcılar silebilir
CREATE POLICY "Auth Delete blog-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
