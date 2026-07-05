// app/api/founding-status/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("founding_counter")
      .select("claimed, cap, closes_at")
      .eq("id", 1)
      .single();
    if (error) throw error;

    const open = data.claimed < data.cap && new Date() < new Date(data.closes_at);

    return NextResponse.json(
      { claimed: data.claimed, cap: data.cap, closesAt: data.closes_at, open },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  } catch (err) {
    console.error("founding-status error:", err);
    return NextResponse.json({ error: "Unavailable" }, { status: 500 });
  }
}
