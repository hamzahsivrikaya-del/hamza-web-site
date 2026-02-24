-- lessons delete politikası: eski subquery yerine is_admin() SECURITY DEFINER kullan
DROP POLICY IF EXISTS "lessons_delete_admin" ON public.lessons;
CREATE POLICY "lessons_delete_admin" ON public.lessons
  FOR DELETE USING (public.is_admin());
