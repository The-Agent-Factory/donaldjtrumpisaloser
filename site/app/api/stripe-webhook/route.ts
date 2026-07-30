// app/api/stripe-webhook/route.ts
// App Router gives us the raw body directly via req.text(), which is exactly
// what Stripe signature verification needs. No bodyParser config required.

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Webhook signature verification failed:", msg);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        metadata?: { tier?: string };
        customer_details?: { email?: string };
        customer_email?: string;
        customer?: string;
      };

      const tier = session.metadata?.tier;
      const email = session.customer_details?.email || session.customer_email;
      const customerId = session.customer;
      let isFounding = false;

      if (tier === "founding") {
        const { data: claimed, error: claimErr } = await supabaseAdmin.rpc("claim_founding_slot");
        if (claimErr) throw claimErr;
        isFounding = true;
        if (!claimed) {
          console.warn(`Founding cap overflow for ${email}. Manual review needed.`);
        }
      }

      const { error: upsertErr } = await supabaseAdmin.from("members").upsert(
        {
          email,
          stripe_customer_id: customerId,
          tier,
          status: "active",
          is_founding: isFounding,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );
      if (upsertErr) throw upsertErr;
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as { status: string; customer: string };
      const status =
        sub.status === "active" || sub.status === "trialing"
          ? "active"
          : sub.status === "past_due"
          ? "past_due"
          : "canceled";

      await supabaseAdmin
        .from("members")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", sub.customer);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
