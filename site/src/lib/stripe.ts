// src/lib/stripe.ts
// Server-only Stripe client and tier configuration.

import Stripe from "stripe";

// Lazily construct the client on first use. Building the client (and throwing
// on a missing key) at import time would break `next build`, which evaluates
// route modules without secrets present. This defers both to request time.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  // No apiVersion pin: the SDK uses its bundled default, which matches the
  // installed types. The account's own pinned version still applies server-side.
  _stripe = new Stripe(secret);
  return _stripe;
}

// A proxy so existing `stripe.checkout...` call sites keep working unchanged,
// while the underlying client is only created the first time it is touched.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export type Tier = "monthly" | "annual" | "founding";

export const PRICES: Record<Tier, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY, // recurring, $6/mo
  annual: process.env.STRIPE_PRICE_ANNUAL, // recurring, $60/yr
  founding: process.env.STRIPE_PRICE_FOUNDING, // one-time, $200
};

export const TIER_MODE: Record<Tier, "subscription" | "payment"> = {
  monthly: "subscription",
  annual: "subscription",
  founding: "payment",
};

export function isTier(v: unknown): v is Tier {
  return v === "monthly" || v === "annual" || v === "founding";
}
