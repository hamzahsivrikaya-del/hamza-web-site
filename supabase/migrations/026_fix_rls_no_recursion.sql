-- SECURITY DEFINER fonksiyon: RLS'yi bypass ederek admin kontrolü yapar
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- SECURITY DEFINER fonksiyon: RLS'yi bypass ederek çocuk ID'lerini döner
CREATE OR REPLACE FUNCTION public.child_ids()
RETURNS SETOF UUID AS $$
  SELECT id FROM public.users WHERE parent_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- users: kendi satırı + çocuğu + admin
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (
    auth.uid() = id
    OR parent_id = auth.uid()
    OR public.is_admin()
  );

-- packages
DROP POLICY IF EXISTS "packages_select" ON public.packages;
CREATE POLICY "packages_select" ON public.packages
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT public.child_ids())
    OR public.is_admin()
  );

-- lessons
DROP POLICY IF EXISTS "lessons_select" ON public.lessons;
CREATE POLICY "lessons_select" ON public.lessons
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT public.child_ids())
    OR public.is_admin()
  );

-- measurements
DROP POLICY IF EXISTS "measurements_select" ON public.measurements;
CREATE POLICY "measurements_select" ON public.measurements
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (SELECT public.child_ids())
    OR public.is_admin()
  );
