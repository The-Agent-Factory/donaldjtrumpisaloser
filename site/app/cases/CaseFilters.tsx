"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EntryCard } from "@/components/EntryCard";
import type { Entry, EntryStatus } from "@/content/entries";
import type { CategoryDef } from "@/content/categories";

const STATUSES: { id: EntryStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "closed", label: "Closed" },
  { id: "ongoing", label: "Ongoing" },
  { id: "on-appeal", label: "On appeal" },
  { id: "vacated", label: "Vacated" },
];

export function CaseFilters({
  entries,
  categories,
}: {
  entries: Entry[];
  categories: CategoryDef[];
}) {
  const params = useSearchParams();
  const initialQ = params?.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "title">("date");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let out = entries.filter((e) => {
      if (cat !== "all" && e.category !== cat) return false;
      if (status !== "all" && e.status !== status) return false;
      if (ql) {
        const hay = `${e.title} ${e.summary} ${e.tags.join(" ")} ${e.id}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
    if (sortBy === "date") out = out.sort((a, b) => (a.date > b.date ? -1 : 1));
    if (sortBy === "amount")
      out = out.sort((a, b) => (b.dollarAmount || 0) - (a.dollarAmount || 0));
    if (sortBy === "title") out = out.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }, [entries, q, cat, status, sortBy]);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-4 mb-8">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Keyword"
          className="px-3 py-2 border rule font-ui"
          style={{ background: "var(--surface)" }}
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="px-3 py-2 border rule font-ui"
          style={{ background: "var(--surface)" }}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border rule font-ui"
          style={{ background: "var(--surface)" }}
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "title")}
          className="px-3 py-2 border rule font-ui"
          style={{ background: "var(--surface)" }}
        >
          <option value="date">Sort: most recent</option>
          <option value="amount">Sort: dollar amount</option>
          <option value="title">Sort: title A-Z</option>
        </select>
      </div>
      <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <EntryCard key={e.id} entry={e} compact />
        ))}
      </div>
    </div>
  );
}
