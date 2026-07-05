-- News-to-timeline ingestion, Phase 1: gather + filter + queue.
-- Run in the Supabase SQL editor (or via `supabase db push`).
-- Nothing here publishes to the live timeline. Candidates are queued for review.

-- ---------------------------------------------------------------------------
-- feed_seen: dedupe ledger. One row per source item we've already processed,
-- keyed by a hash of the canonical link. Keeps the daily job from re-queuing
-- the same story. Cheap lookup, no PII.
-- ---------------------------------------------------------------------------
create table if not exists public.feed_seen (
  url_hash text primary key,          -- sha-256 of the normalized item link
  link text not null,
  feed text not null,                 -- which feed it came from (source key)
  first_seen timestamptz not null default now()
);

create index if not exists feed_seen_first_seen_idx
  on public.feed_seen (first_seen desc);

-- ---------------------------------------------------------------------------
-- entry_candidates: the review queue. A filtered news item that MIGHT become a
-- timeline Entry. Phase 1 fills the raw + classification columns; the structured
-- Entry draft columns stay null until Phase 2 wires the drafting model.
-- ---------------------------------------------------------------------------
create table if not exists public.entry_candidates (
  id uuid primary key default gen_random_uuid(),

  -- provenance
  source_feed text not null,          -- e.g. 'courtlistener-opinions', 'google-news'
  source_kind text not null           -- 'primary' | 'general'
    check (source_kind in ('primary', 'general')),
  link text not null,
  url_hash text not null,             -- matches feed_seen.url_hash
  headline text not null,
  published_at timestamptz,
  raw_summary text,                   -- feed <summary>/<description>, trimmed

  -- cheap rules-based classification (no LLM in Phase 1)
  matched_terms text[] not null default '{}',   -- which signal terms hit
  guessed_category text,              -- best-effort category guess, may be null
  auto_eligible boolean not null default false, -- would Phase 2 auto-publish it?

  -- Phase 2 draft target (left null in Phase 1)
  draft jsonb,                        -- the structured Entry object once drafted

  -- review workflow
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'published')),
  reviewer_note text,

  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists entry_candidates_status_idx
  on public.entry_candidates (status, created_at desc);
create unique index if not exists entry_candidates_url_hash_idx
  on public.entry_candidates (url_hash);

-- ---------------------------------------------------------------------------
-- ingest_runs: one row per daily job run, for observability. Lets the digest
-- and the admin view show "last run fetched N, queued M, errored on feed X".
-- ---------------------------------------------------------------------------
create table if not exists public.ingest_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  feeds_ok int not null default 0,
  feeds_failed int not null default 0,
  items_seen int not null default 0,
  items_new int not null default 0,
  candidates_queued int not null default 0,
  errors jsonb not null default '[]'::jsonb   -- [{feed, message}]
);

-- ---------------------------------------------------------------------------
-- RLS: these tables hold no user data, but lock them down anyway. Only the
-- service role (the Edge Function and the admin view's server code) touches
-- them. No public policies = no anon access.
-- ---------------------------------------------------------------------------
alter table public.feed_seen        enable row level security;
alter table public.entry_candidates enable row level security;
alter table public.ingest_runs      enable row level security;
-- No policies created on purpose: service_role bypasses RLS; everyone else is denied.
