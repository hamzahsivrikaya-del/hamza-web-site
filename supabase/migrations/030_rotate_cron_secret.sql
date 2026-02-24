-- CRON_SECRET rotasyonu: zayıf secret'ı güçlü olanla değiştir
-- Mevcut job'ları kaldır
SELECT cron.unschedule('weekly-report-sunday');
SELECT cron.unschedule('nutrition-reminder-daily');

-- Yeni secret ile yeniden oluştur
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
