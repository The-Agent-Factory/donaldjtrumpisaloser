"use client";

import { useState } from "react";

export interface Candidate {
  id: string;
  source_feed: string;
  source_kind: string;
  link: string;
  headline: string;
  published_at: string | null;
  raw_summary: string | null;
  matched_terms: string[];
  guessed_category: string | null;
  auto_eligible: boolean;
  created_at: string;
}

export function ReviewList({ initial, token }: { initial: Candidate[]; token: string }) {
  const [items, setItems] = useState<Candidate[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function act(id: string, action: "approve" | "reject") {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        // drop it from the pending list
        setItems((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(`Action failed: ${res.status}`);
      }
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="font-ui text-base" style={{ color: "var(--text-muted)" }}>
        No pending candidates. The daily job has nothing queued for review.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((c) => (
        <li key={c.id} className="border rule p-5" style={{ background: "var(--surface)" }}>
          <div className="flex flex-wrap gap-2 mb-2 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="px-2 py-0.5 border rule">{c.source_feed}</span>
            <span className="px-2 py-0.5 border rule">{c.source_kind}</span>
            {c.guessed_category && (
              <span className="px-2 py-0.5 border rule">guess: {c.guessed_category}</span>
            )}
            {c.auto_eligible && (
              <span className="px-2 py-0.5 border rule" style={{ color: "var(--primary)" }}>
                auto-eligible
              </span>
            )}
            {c.published_at && <span>{new Date(c.published_at).toLocaleDateString()}</span>}
          </div>

          <a
            href={c.link}
            target="_blank"
            rel="noopener"
            className="font-serif text-lg block mb-2"
            style={{ color: "var(--primary)" }}
          >
            {c.headline}
          </a>

          {c.raw_summary && (
            <p className="font-ui text-sm mb-3" style={{ color: "var(--text-muted)" }}>
              {c.raw_summary}
            </p>
          )}

          {c.matched_terms.length > 0 && (
            <p className="font-mono text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              matched: {c.matched_terms.join(", ")}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => act(c.id, "approve")}
              disabled={busy === c.id}
              className="font-ui text-sm px-4 py-1.5 border rule"
              style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
            >
              {busy === c.id ? "..." : "Approve"}
            </button>
            <button
              onClick={() => act(c.id, "reject")}
              disabled={busy === c.id}
              className="font-ui text-sm px-4 py-1.5 border rule"
              style={{ color: "var(--text-muted)" }}
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
