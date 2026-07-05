// Admin review queue for news-ingestion candidates (Phase 1).
// Protected by ADMIN_TOKEN: visit /admin/candidates?token=YOUR_TOKEN.
// Server component: reads the queue with the service role, never exposes it.

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ReviewList, type Candidate } from "./ReviewList";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Keep this page out of search + AI crawlers; it is an internal tool.
export const metadata: Metadata = {
  title: "Review queue",
  robots: { index: false, follow: false },
};

export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected || !token || token !== expected) {
    return (
      <Section>
        <Container size="narrow">
          <h1 className="font-serif mb-3">Review queue</h1>
          <p className="font-ui text-base" style={{ color: "var(--text-muted)" }}>
            {expected
              ? "Access token required. Append ?token=... to the URL."
              : "ADMIN_TOKEN is not configured on the server."}
          </p>
        </Container>
      </Section>
    );
  }

  // last run summary + pending candidates
  const [{ data: candidates }, { data: runs }] = await Promise.all([
    supabaseAdmin
      .from("entry_candidates")
      .select(
        "id, source_feed, source_kind, link, headline, published_at, raw_summary, matched_terms, guessed_category, auto_eligible, created_at",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("ingest_runs")
      .select("started_at, feeds_ok, feeds_failed, items_new, candidates_queued, errors")
      .order("started_at", { ascending: false })
      .limit(1),
  ]);

  const lastRun = runs?.[0];

  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-3">Review queue</h1>
        <p className="font-ui text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Candidate timeline entries surfaced by the daily news job. Approving one
          marks it for inclusion; it does not publish on its own. Nothing here is
          live on the archive.
        </p>

        {lastRun && (
          <div
            className="border rule p-4 mb-8 font-mono text-xs"
            style={{ background: "var(--surface)", color: "var(--text-muted)" }}
          >
            last run {new Date(lastRun.started_at).toLocaleString()} · feeds ok{" "}
            {lastRun.feeds_ok} · failed {lastRun.feeds_failed} · new items{" "}
            {lastRun.items_new} · queued {lastRun.candidates_queued}
            {Array.isArray(lastRun.errors) && lastRun.errors.length > 0 && (
              <div className="mt-1" style={{ color: "var(--color-citation-burgundy)" }}>
                errors: {lastRun.errors.map((e: { feed: string; message: string }) => `${e.feed} (${e.message})`).join("; ")}
              </div>
            )}
          </div>
        )}

        <ReviewList initial={(candidates ?? []) as Candidate[]} token={token} />
      </Container>
    </Section>
  );
}
