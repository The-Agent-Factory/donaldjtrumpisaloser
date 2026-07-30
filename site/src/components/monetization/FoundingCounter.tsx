"use client";

// src/components/monetization/FoundingCounter.tsx
// The signature element: a live ledger counter styled with the archive's own
// tokens (ledger-olive for the live/verified state, citation-burgundy for closed).

import { useEffect, useState } from "react";

type Status = {
  claimed: number;
  cap: number;
  closesAt: string;
  open: boolean;
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function FoundingCounter() {
  const [status, setStatus] = useState<Status | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetch("/api/founding-status", { headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error("status");
        const d = (await r.json()) as Status;
        if (active) {
          setStatus(d);
          setFailed(false);
        }
      } catch {
        if (active) setFailed(true);
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  const open = status?.open ?? true;
  const pct = status ? Math.min(100, Math.round((status.claimed / status.cap) * 100)) : 0;
  const remaining = status ? status.cap - status.claimed : 0;
  const liveColor = open ? "var(--color-ledger-olive)" : "var(--color-citation-burgundy)";

  return (
    <div
      className="surface"
      style={{ border: "1.5px solid var(--primary)" }}
      aria-live="polite"
    >
      <div
        className="font-mono"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          borderBottom: "1px solid var(--rule)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: liveColor,
              display: "inline-block",
            }}
          />
          {open ? "Founding window open" : "Founding window closed"}
        </span>
        <span>30-day window</span>
      </div>

      <div style={{ padding: "22px 18px 20px" }}>
        <div
          className="font-mono"
          style={{
            fontWeight: 600,
            fontSize: "clamp(2.4rem, 9vw, 3.6rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: "var(--primary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {status ? status.claimed : "--"}
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
            {" / "}
            {status ? status.cap : 250}
          </span>
        </div>

        <div
          className="font-mono"
          style={{ fontSize: 12, letterSpacing: "0.06em", color: "var(--text-muted)", marginTop: 8 }}
        >
          founding memberships claimed
        </div>

        <div
          style={{
            marginTop: 18,
            height: 6,
            background: "var(--color-foolscap)",
            border: "1px solid var(--rule)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "var(--color-ledger-olive)",
              transition: "width 900ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>

        <div
          className="font-mono"
          style={{ marginTop: 14, fontSize: 11, letterSpacing: "0.04em", color: "var(--text-muted)" }}
        >
          {failed
            ? "Counter unavailable. Support options below remain open."
            : !status
            ? "Verifying window\u2026"
            : open
            ? `${remaining} remaining \u00B7 closes ${fmtDate(status.closesAt)}`
            : "Founding is closed. Monthly and annual remain open."}
        </div>
      </div>
    </div>
  );
}
