-- Her gün 06:00 UTC (Türkiye 09:00) beslenme hatırlatma bildirimi
SELECT cron.schedule(
  'nutrition-reminder-daily',
  '0 6 * * *',
  $$
  SELECT net.http_get(
    url := 'https://hamzasivrikaya.com/api/cron/nutrition-reminder',
    headers := jsonb_build_object(
      'Authorization', 'Bearer hamza-pt-cron-2026'
    )
  );
  $$
);
