-- pg_cron ve pg_net uzantılarını etkinleştir
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Her Pazar 15:00 UTC (Türkiye 18:00) haftalık rapor tetikle
SELECT cron.schedule(
  'weekly-report-sunday',
  '0 15 * * 0',
  $$
  SELECT net.http_get(
    url := 'https://hamzasivrikaya.com/api/cron/weekly-report',
    headers := jsonb_build_object(
      'Authorization', 'Bearer hamza-pt-cron-2026'
    )
  );
  $$
);
