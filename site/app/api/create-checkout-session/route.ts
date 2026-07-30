// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe, PRICES, TIER_MODE, isTier } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://donaldjtrumpisaloser.com";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier, email } = body as { tier?: string; email?: string };

    if (!isTier(tier) || !PRICES[tier]) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Founding pre-check: window open and under cap.
    if (tier === "founding") {
      const { data, error } = await supabaseAdmin
        .from("founding_counter")
        .select("claimed, cap, closes_at")
        .eq("id", 1)
        .single();
      if (error) throw error;

      const open = data.claimed < data.cap && new Date() < new Date(data.closes_at);
      if (!open) {
        return NextResponse.json({ error: "Founding membership is closed." }, { status: 409 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: TIER_MODE[tier],
      line_items: [{ price: PRICES[tier]!, quantity: 1 }],
      customer_email: email || undefined,
      metadata: { tier },
      success_url: `${SITE_URL}/founding/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/founding`,
      allow_promotion_codes: false,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
