-- Schedule the daily rss-ingest Edge Function via pg_cron + pg_net.
-- Run AFTER deploying the function (`supabase functions deploy rss-ingest`).
-- Run in the Supabase SQL editor.

-- 1. Extensions (safe to re-run)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Store the project URL + service role key in Vault so they are never
--    inlined in the cron SQL. Replace the placeholders below with your values
--    from Settings -> API, then run these two lines ONCE. If you have already
--    created them, skip (create_secret errors on a duplicate name).
--
--    select vault.create_secret('https://mldknnvazhcgnbcmhlam.supabase.co', 'project_url');
--    select vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_key');

-- 3. Schedule: every day at 06:00 UTC. Change the cron expression if you like.
--    Idempotent: unschedule first so re-running this file doesn't stack jobs.
select cron.unschedule('daily-rss-ingest')
  where exists (select 1 from cron.job where jobname = 'daily-rss-ingest');

select cron.schedule(
  'daily-rss-ingest',
  '0 6 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/rss-ingest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' ||
        (select decrypted_secret from vault.decrypted_secrets where name = 'service_key')
    ),
    body := jsonb_build_object('trigger', 'cron', 'at', now())
  ) as request_id;
  $$
);

-- Inspect:
--   select * from cron.job;                       -- confirm the schedule
--   select * from cron.job_run_details order by start_time desc limit 5;
--   select * from net._http_response order by created desc limit 5;  -- function HTTP result
--   select * from public.ingest_runs order by started_at desc limit 5; -- what it did
