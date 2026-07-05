"use client";

// src/components/monetization/MembershipTiers.tsx
// Three tiers wired to the checkout route. Founding disables itself when closed.

import { useEffect, useState } from "react";

type Tier = "monthly" | "annual" | "founding";

const TIERS: { tier: Tier; name: string; price: string; unit: string; cta: string; primary?: boolean; note?: string }[] = [
  { tier: "monthly", name: "Monthly", price: "$6", unit: "/ month", cta: "Support monthly" },
  { tier: "annual", name: "Annual", price: "$60", unit: "/ year", cta: "Support annually" },
  {
    tier: "founding",
    name: "Founding",
    price: "$200",
    unit: "once",
    cta: "Become a founding member",
    primary: true,
    note: "First 30 days only \u00B7 never reopens",
  },
];

export function MembershipTiers() {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<Tier | null>(null);
  const [foundingOpen, setFoundingOpen] = useState(true);

  useEffect(() => {
    fetch("/api/founding-status")
      .then((r) => r.json())
      .then((d) => setFoundingOpen(Boolean(d.open)))
      .catch(() => setFoundingOpen(true));
  }, []);

  async function checkout(tier: Tier) {
    setErr(null);
    setBusy(tier);
    try {
      const r = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const d = await r.json();
      if (!r.ok || !d.url) throw new Error(d.error || "Could not start checkout.");
      window.location.href = d.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setBusy(null);
    }
  }

  return (
    <div>
      {err && (
        <p className="font-mono" style={{ fontSize: 12, color: "var(--color-citation-burgundy)", marginBottom: 12 }}>
          {err}
        </p>
      )}
      <div style={{ border: "1.5px solid var(--primary)" }}>
        {TIERS.map((t, i) => {
          const closed = t.tier === "founding" && !foundingOpen;
          const isBusy = busy === t.tier;
          return (
            <div
              key={t.tier}
              className={t.primary ? "surface" : undefined}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                padding: "20px",
                borderBottom: i < TIERS.length - 1 ? "1px solid var(--rule)" : "none",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  className="font-mono"
                  style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}
                >
                  {t.name}
                </div>
                <div className="font-serif" style={{ fontSize: "1.5rem", color: "var(--primary)", marginTop: 3 }}>
                  {t.price}{" "}
                  <span className="font-ui" style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {t.unit}
                  </span>
                </div>
                {t.note && (
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--color-citation-burgundy)",
                      marginTop: 4,
                    }}
                  >
                    {closed ? "Closed \u00B7 does not reopen" : t.note}
                  </div>
                )}
              </div>
              <button
                onClick={() => checkout(t.tier)}
                disabled={closed || isBusy}
                className="font-mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "12px 20px",
                  cursor: closed || isBusy ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  border: "1.5px solid var(--primary)",
                  background: closed ? "var(--color-foolscap)" : t.primary ? "var(--color-ledger-olive)" : "var(--primary)",
                  color: closed ? "var(--text-muted)" : "var(--color-bond-paper)",
                  borderColor: closed ? "var(--rule)" : t.primary ? "var(--color-ledger-olive)" : "var(--primary)",
                }}
              >
                {closed ? "Founding closed" : isBusy ? "Opening checkout\u2026" : t.cta}
              </button>
            </div>
          );
        })}
      </div>
      <p className="font-mono" style={{ fontSize: 11, letterSpacing: "0.03em", color: "var(--text-muted)", textAlign: "center", marginTop: 18 }}>
        Secure checkout through Stripe. Cancel any time. The archive stays free either way.
      </p>
    </div>
  );
}
