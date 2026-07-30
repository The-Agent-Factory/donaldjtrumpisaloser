// Daily news-to-timeline ingestion, Phase 1.
// Gather (verified RSS/Atom feeds) -> dedupe -> cheap rules filter -> queue candidates.
// NOTHING is published to the live timeline. Candidates land in entry_candidates (pending).
//
// Invoked once daily by pg_cron (see ../../migrations/0002_cron.sql).
// Runs entirely on Supabase free tier. No LLM, no external secrets.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  AUTO_SAFE_CATEGORIES,
  CATEGORY_HINTS,
  FEEDS,
  FETCH_HEADERS,
  type FeedSource,
  OUTCOME_TERMS,
  SUBJECT_TERMS,
} from "./feeds.ts";

interface FeedItem {
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
}

// --- tiny, dependency-free feed parsing ------------------------------------
// Feeds are small and well-formed enough that targeted regex extraction beats
// pulling a full XML parser into the Deno bundle. Handles both Atom and RSS.

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "") // strip any leftover tags in summaries
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

// Atom <link href="..."/> vs RSS <link>...</link>
function extractLink(block: string): string | null {
  const href = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (href) return href[1];
  const text = tag(block, "link");
  return text || null;
}

function parseFeed(xml: string, format: FeedSource["format"]): FeedItem[] {
  const itemTag = format === "atom" ? "entry" : "item";
  const blocks = xml.split(new RegExp(`<${itemTag}[\\s>]`, "i")).slice(1);
  const items: FeedItem[] = [];
  for (const partial of blocks) {
    // re-close the split boundary so tag() regexes see a whole element
    const block = "<" + itemTag + " " + partial;
    const title = tag(block, "title");
    const link = extractLink(block);
    if (!title || !link) continue;
    const summary =
      tag(block, "summary") ?? tag(block, "description") ?? tag(block, "content") ?? "";
    const publishedAt =
      tag(block, "published") ?? tag(block, "updated") ?? tag(block, "pubDate") ?? null;
    items.push({ title, link, summary, publishedAt });
  }
  return items;
}

// --- helpers ---------------------------------------------------------------

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Normalize a link so trivially-different URLs dedupe together.
function normalizeLink(link: string): string {
  try {
    const u = new URL(link);
    u.hash = "";
    // Google News wraps the real URL; strip common tracking params.
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((p) =>
      u.searchParams.delete(p),
    );
    return u.toString().replace(/\/$/, "");
  } catch {
    return link.trim();
  }
}

function toIso(raw: string | null): string | null {
  if (!raw) return null;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

// The cheap filter: subject hit AND outcome hit. Returns matched outcome terms,
// or null if the item is not a documentable event (dropped, no spend).
function filterItem(item: FeedItem, feedKind: FeedSource["kind"]): string[] | null {
  const hay = `${item.title} ${item.summary}`.toLowerCase();
  // General feeds are already Trump-scoped by their query; primary feeds are not.
  const subjectOk =
    feedKind === "general" || SUBJECT_TERMS.some((t) => hay.includes(t));
  if (!subjectOk) return null;
  const matched = OUTCOME_TERMS.filter((t) => hay.includes(t));
  return matched.length ? matched : null;
}

function guessCategory(item: FeedItem): string | null {
  const hay = `${item.title} ${item.summary}`.toLowerCase();
  for (const { terms, category } of CATEGORY_HINTS) {
    if (terms.some((t) => hay.includes(t))) return category;
  }
  return null;
}

async function fetchFeed(feed: FeedSource): Promise<FeedItem[]> {
  const res = await fetch(feed.url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return parseFeed(xml, feed.format);
}

// --- main handler ----------------------------------------------------------

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const run = {
    feeds_ok: 0,
    feeds_failed: 0,
    items_seen: 0,
    items_new: 0,
    candidates_queued: 0,
    errors: [] as Array<{ feed: string; message: string }>,
  };

  // Fetch all feeds in parallel (stays well under the 150s wall-clock limit).
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => ({ feed, items: await fetchFeed(feed) })),
  );

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "rejected") {
      run.feeds_failed++;
      run.errors.push({ feed: FEEDS[i].key, message: String(r.reason?.message ?? r.reason) });
      continue;
    }
    run.feeds_ok++;
    const { feed, items } = r.value;

    for (const item of items) {
      run.items_seen++;
      const link = normalizeLink(item.link);
      const urlHash = await sha256(link);

      // dedupe: already seen this item?
      const { data: seen } = await supabase
        .from("feed_seen")
        .select("url_hash")
        .eq("url_hash", urlHash)
        .maybeSingle();
      if (seen) continue;

      run.items_new++;
      // record as seen regardless of whether it passes the filter, so we don't
      // re-evaluate the same story every day.
      await supabase
        .from("feed_seen")
        .insert({ url_hash: urlHash, link, feed: feed.key })
        .then(() => {}, () => {}); // ignore race dup

      // cheap filter
      const matched = filterItem(item, feed.kind);
      if (!matched) continue;

      const category = guessCategory(item);
      const autoEligible =
        feed.kind === "primary" && !!category && AUTO_SAFE_CATEGORIES.has(category);

      const { error: insErr } = await supabase.from("entry_candidates").insert({
        source_feed: feed.key,
        source_kind: feed.kind,
        link,
        url_hash: urlHash,
        headline: item.title.slice(0, 500),
        published_at: toIso(item.publishedAt),
        raw_summary: item.summary.slice(0, 2000),
        matched_terms: matched,
        guessed_category: category,
        auto_eligible: autoEligible,
        status: "pending",
      });
      // unique(url_hash) protects against a candidate dup; ignore that specific error
      if (!insErr) run.candidates_queued++;
    }
  }

  // record the run for the digest + admin view
  await supabase.from("ingest_runs").insert({
    finished_at: new Date().toISOString(),
    ...run,
    errors: run.errors,
  });

  return new Response(JSON.stringify(run, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
