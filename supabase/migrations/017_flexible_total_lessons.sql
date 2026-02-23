-- Özel paketler için total_lessons kısıtını esnet (10/20/30 → herhangi pozitif sayı)
ALTER TABLE public.packages DROP CONSTRAINT packages_total_lessons_check;
ALTER TABLE public.packages ADD CONSTRAINT packages_total_lessons_check CHECK (total_lessons > 0);
