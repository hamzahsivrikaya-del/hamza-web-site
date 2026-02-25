-- Üyeler kendi profillerini güncelleyebilsin (avatar_url, full_name, phone)
CREATE POLICY "users_update_self" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
