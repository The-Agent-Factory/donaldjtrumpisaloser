# djtloser — News-to-Timeline Ingestion — Plan

**Last updated:** 2026-07-31
**Status:** active
**Goal:** Cheapest safe pipeline that gathers primary + general news feeds daily, filters to documentable legal/business outcomes, and queues structured candidate entries for the timeline. Phase 1 = gather+filter+queue+digest, no auto-publish, no secrets.

## Decisions locked
- Runtime: Supabase pg_cron -> Edge Function (free tier, no new infra).
- Publish gate: auto-publish verified types LATER (Phase 2); Phase 1 is queue-only.
- Auto-write path (Phase 2): open GitLab MR, CI auto-merges verified types.
- Sources: primary-source RSS (CourtListener/.gov/regulators) + general news RSS (AP/Reuters). Both free.
- Credibility gate is non-negotiable: nothing reaches entries.ts without passing the gate. entries.ts is a static compiled TS array rendered at build time.
- Auto-publish gate (Phase 2): primary-source URL + category in {criminal-cases, civil-judgments, regulatory-penalties, bankruptcies} + high-confidence extraction + not duplicate.
- Phase 1 deferred: GitLab access token, Anthropic API key (both Supabase secrets, needed only for Phase 2 auto lane).

## Done
- Reconciled repo, migrated to GitLab, deployed founding membership to prod.
- Supabase project live: mldknnvazhcgnbcmhlam (founding_counter, members).
- Confirmed timeline data source: site/src/content/entries.ts (static array, Entry interface).
- Researched + LIVE-VERIFIED feed URLs (CourtListener, SEC, FTC, Google News, Guardian all work; DOJ dropped, blocks server fetch).
- Phase 1 CODE COMPLETE (this session), committed + pushed to GitLab. Build passes.
  - migrations/0001_news_ingest.sql: entry_candidates, feed_seen, ingest_runs (+RLS).
  - functions/rss-ingest/: Deno Edge Function, fetch -> dedupe -> rules filter -> queue. Parser+filter LIVE-TESTED (Google News surfaced a real $5M-verdict item).
  - migrations/0002_cron.sql: daily pg_cron @ 06:00 UTC via pg_net.
  - /admin/candidates review UI + /api/admin/candidates (ADMIN_TOKEN gated).
  - config.toml (verify_jwt=false), supabase/README.md deploy guide.

- Accountability Wire pipeline CODE COMPLETE (2026-07-31 session), on branch
  `claude/news-aggregation-monetization-0lpgen`, MR !1 open. Complements (does not
  replace) the Supabase Phase 1 lane; never writes entries.ts. See PIPELINE.md.
  - scripts/aggregate.py: 2-hourly RSS aggregation across the spectrum (Fox News,
    whitehouse.gov, NPR, Guardian, Politico, Hill, PBS, ProPublica, ABC, CNN
    + optional NewsAPI). Stdlib only.
  - scripts/llm_panel.py: daily 24-Hour Panel — Claude/ChatGPT/Gemini (+Grok,
    +local Qwen seat) analyze the last 24h independently; consensus computed.
  - scripts/social_posts.py: X thread (auto-post via OAuth1 when keys set),
    TikTok script, Substack "LLM News" edition.
  - scripts/shorts_video.py: daily YouTube Short (ffmpeg ticker, <3 min),
    optional auto-upload via YouTube Data API.
  - scripts/export_to_site.py -> site/public/data/*.json; new /panel page +
    homepage panel strip + nav item in the site's design system (next build passes).
  - .gitlab-ci.yml merged: deploy_railway preserved; update job on schedules
    (PIPELINE_MODE=wire / panel); Railway redeploys after data updates.

## In flight
- MR !1 awaiting Denis review/merge.

## Next up (Wire pipeline ACTIVATE — all in GitLab UI, ~10 min)
- [ ] Merge MR !1.
- [ ] CI/CD Variables: GEMINI_API_KEY (min. to activate panel); optionally
      ANTHROPIC_API_KEY / OPENAI_API_KEY / XAI_API_KEY / NEWSAPI_KEY;
      GITLAB_PUSH_TOKEN (Project Access Token, Developer, write_repository);
      SITE_URL=https://donaldjtrumpisaloser.com. Later: AUTOPOST_X + X_* keys,
      AUTOPOST_YOUTUBE + YT_* keys, ADSENSE_CLIENT/DONATE_URL/SUBSTACK_URL.
- [ ] Pipeline schedules: "0 */2 * * *" (PIPELINE_MODE=wire) and
      "0 11 * * *" (PIPELINE_MODE=panel).
- [ ] Run one pipeline manually; confirm /panel populates on prod after deploy.
- [ ] Substack: create the "LLM News" publication; paste data/posts/DATE/
      substack_llm_news.md daily (or wire RSS import); enable paid tier.

## Next up (Phase 1 DEPLOY — needs Supabase CLI on Denis's machine)
- [ ] supabase link + db push (or run 0001 in SQL editor).
- [ ] supabase functions deploy rss-ingest.
- [ ] Fill vault secrets + run 0002_cron.sql.
- [ ] Set ADMIN_TOKEN in Railway Variables (value in local .env).
- [ ] Manually invoke function once, confirm candidates queue, review at /admin/candidates.
- [ ] Watch a few days to trust the filter BEFORE building Phase 2 auto-publish.

## Later (Phase 2)
- [ ] LLM drafting into Entry shape + GitLab MR auto-open for verified types.
- [ ] Daily digest delivery (channel TBD: Resend email vs Slack).

## Blockers (waiting on Denis / external)
- Phase 2 only: GitLab access token + Anthropic API key.

## Open questions
- Digest delivery channel: email (Resend) vs Slack vs just the admin view? (Confirm before wiring digest.)
- Admin view auth: how to protect it (single shared secret vs Supabase auth)?
