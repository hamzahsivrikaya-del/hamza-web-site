-- Çift kayıtlı cron job'ları temizle ve tekten oluştur
-- Sorun: nutrition-reminder-daily ve weekly-report-sunday çift kayıtlı olabilir

-- Tüm mevcut job'ları kaldır (hata verirse sessizce geç)
DO $$
BEGIN
  PERFORM cron.unschedule(jobid) FROM cron.job
    WHERE jobname IN ('nutrition-reminder-daily', 'weekly-report-sunday');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Tekrar oluştur: Beslenme hatırlatma — her gün 06:00 UTC (TR 09:00)
SELECT cron.schedule(
  'nutrition-reminder-daily',
  '0 6 * * *',
  $$
  SELECT net.http_get(
    url := 'https://hamzasivrikaya.com/api/cron/nutrition-reminder',
    headers := jsonb_build_object(
      'Authorization', 'Bearer nY51nHFHOzt+hLx0zdqAXxltyHH3rWHrTefX0sdkJfs='
    )
  );
  $$
);

-- Tekrar oluştur: Haftalık rapor — Pazar 15:00 UTC (TR 18:00)
SELECT cron.schedule(
  'weekly-report-sunday',
  '0 15 * * 0',
  $$
  SELECT net.http_get(
    url := 'https://hamzasivrikaya.com/api/cron/weekly-report',
    headers := jsonb_build_object(
      'Authorization', 'Bearer nY51nHFHOzt+hLx0zdqAXxltyHH3rWHrTefX0sdkJfs='
    )
  );
  $$
);
