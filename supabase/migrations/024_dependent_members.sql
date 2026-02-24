-- Bağlı üye (çocuk) desteği
ALTER TABLE public.users ADD COLUMN parent_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
CREATE INDEX idx_users_parent_id ON public.users(parent_id);

-- RLS: Veli, çocuğunun verisini görebilsin

-- users: veli çocuğu görebilir
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (
    auth.uid() = id
    OR id IN (SELECT u.id FROM public.users u WHERE u.parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- packages: veli çocuğun paketlerini görebilir
DROP POLICY IF EXISTS "packages_select" ON public.packages;
CREATE POLICY "packages_select" ON public.packages
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT u.id FROM public.users u WHERE u.parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- lessons: veli çocuğun derslerini görebilir
DROP POLICY IF EXISTS "lessons_select" ON public.lessons;
CREATE POLICY "lessons_select" ON public.lessons
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT u.id FROM public.users u WHERE u.parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- measurements: veli çocuğun ölçümlerini görebilir
DROP POLICY IF EXISTS "measurements_select" ON public.measurements;
CREATE POLICY "measurements_select" ON public.measurements
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT u.id FROM public.users u WHERE u.parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
