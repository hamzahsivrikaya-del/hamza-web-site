-- start_date otomatik güncelleme trigger'ını kaldır
DROP TRIGGER IF EXISTS trigger_update_start_date ON public.lessons;
DROP FUNCTION IF EXISTS update_user_start_date();
