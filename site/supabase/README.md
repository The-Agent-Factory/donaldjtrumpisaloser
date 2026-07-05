# Supabase: founding memberships + news ingestion

## Contents

- `schema.sql` — founding membership tables (members, founding_counter, claim_founding_slot). Already applied.
- `migrations/0001_news_ingest.sql` — news-ingestion tables (entry_candidates, feed_seen, ingest_runs).
- `migrations/0002_cron.sql` — daily pg_cron schedule that invokes the ingest function.
- `functions/rss-ingest/` — the daily gather -> filter -> queue Edge Function (Deno).
- `config.toml` — sets `verify_jwt = false` for the cron-invoked function.

## News ingestion — Phase 1 (queue only, no auto-publish)

Gathers verified RSS/Atom feeds daily, drops everything that is not a documentable
legal/business outcome, and queues survivors in `entry_candidates` for human review at
`/admin/candidates?token=...`. Nothing reaches the live timeline automatically.

### Deploy steps (Windows / PowerShell)

Requires the Supabase CLI (`npm i -g supabase` or scoop/winget). Log in with `supabase login`.

```powershell
# from the site/ folder
supabase link --project-ref mldknnvazhcgnbcmhlam

# 1. create the ingestion tables
#    (run migrations/0001_news_ingest.sql in the SQL editor, or:)
supabase db push

# 2. deploy the Edge Function
supabase functions deploy rss-ingest

# 3. schedule it: open migrations/0002_cron.sql, fill in the two
#    vault.create_secret lines with your project URL + service role key,
#    then run the whole file in the Supabase SQL editor.
```

### Verify it works

Invoke the function once by hand (no need to wait for 06:00 UTC):

```powershell
# service role key from Settings -> API
curl -X POST "https://mldknnvazhcgnbcmhlam.supabase.co/functions/v1/rss-ingest" `
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```

It returns a JSON run summary (`feeds_ok`, `items_new`, `candidates_queued`). Then check the
queue: visit `/admin/candidates?token=<ADMIN_TOKEN>` on the deployed site. Set `ADMIN_TOKEN`
in Railway's Variables tab first.

Inspect from SQL:

```sql
select * from public.ingest_runs order by started_at desc limit 5;
select headline, source_feed, guessed_category, auto_eligible
  from public.entry_candidates where status = 'pending' order by created_at desc;
select * from cron.job;   -- confirm the daily schedule exists
```

### Feeds

See `functions/rss-ingest/feeds.ts`. Primary sources (CourtListener, SEC, FTC) are
auto-publish-eligible in Phase 2; general feeds (Google News queries, Guardian) always
queue for review. justice.gov is intentionally excluded (blocks server fetches).

## Phase 2 (not built yet)

LLM drafting of the structured Entry object + opening a GitLab merge request for
verified types. Needs a GitLab access token and an Anthropic API key as Supabase
secrets. See ../../PLAN.md.
