-- Önce mevcut duplicate ders kayıtlarını temizle (en eski kaydı tut)
DELETE FROM public.lessons
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, date) id
  FROM public.lessons
  ORDER BY user_id, date, created_at ASC
);

-- Aynı üyeye aynı gün birden fazla ders girişini engelle
ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_user_date_unique UNIQUE (user_id, date);
