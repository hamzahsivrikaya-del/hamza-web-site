-- RLS düzeltmesi: users tablosunda subquery yerine doğrudan parent_id kontrolü

-- users: kendi satırı + çocuğunun satırı + admin herkesi görür
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (
    auth.uid() = id
    OR parent_id = auth.uid()
    OR EXISTS (SELECT 1 FROM auth.users au JOIN public.users pu ON pu.id = au.id WHERE au.id = auth.uid() AND pu.role = 'admin')
  );

-- packages: kendi + çocuğunun + admin
DROP POLICY IF EXISTS "packages_select" ON public.packages;
CREATE POLICY "packages_select" ON public.packages
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- lessons: kendi + çocuğunun + admin
DROP POLICY IF EXISTS "lessons_select" ON public.lessons;
CREATE POLICY "lessons_select" ON public.lessons
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- measurements: kendi + çocuğunun + admin
DROP POLICY IF EXISTS "measurements_select" ON public.measurements;
CREATE POLICY "measurements_select" ON public.measurements
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
