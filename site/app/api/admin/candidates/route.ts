// Admin API for the news-ingestion review queue (Phase 1).
// Protected by a shared secret (ADMIN_TOKEN) passed as ?token= or x-admin-token.
// GET  -> list candidates (optionally by status)
// POST -> { id, action: 'approve'|'reject', note? } updates one candidate
//
// Phase 1 is review-only: 'approve' just marks the row approved (a human still
// adds it to entries.ts). Phase 2 will turn an approved row into a GitLab MR.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false; // fail closed if unset
  const supplied =
    req.headers.get("x-admin-token") ??
    req.nextUrl.searchParams.get("token") ??
    "";
  // constant-ish comparison
  return supplied.length === expected.length && supplied === expected;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  try {
    const { data, error } = await supabaseAdmin
      .from("entry_candidates")
      .select(
        "id, source_feed, source_kind, link, headline, published_at, raw_summary, matched_terms, guessed_category, auto_eligible, status, created_at",
      )
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return NextResponse.json({ candidates: data });
  } catch (err) {
    console.error("admin candidates GET error:", err);
    return NextResponse.json({ error: "Unavailable" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; action?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { id, action, note } = body;
  if (!id || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "id and action (approve|reject) required" }, { status: 400 });
  }
  try {
    const { error } = await supabaseAdmin
      .from("entry_candidates")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        reviewer_note: note ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true, id, status: action === "approve" ? "approved" : "rejected" });
  } catch (err) {
    console.error("admin candidates POST error:", err);
    return NextResponse.json({ error: "Unavailable" }, { status: 500 });
  }
}
