import Link from "next/link";
import type { Entry } from "@/content/entries";
import { categories } from "@/content/categories";

const STATUS_LABEL: Record<string, string> = {
  closed: "Closed",
  ongoing: "Ongoing",
  "on-appeal": "On appeal",
  vacated: "Vacated",
};

export function EntryCard({ entry, compact = false }: { entry: Entry; compact?: boolean }) {
  const cat = categories.find((c) => c.id === entry.category);
  return (
    <article
      className="border rule p-5 flex flex-col gap-3 h-full hover:border-[var(--accent)] transition-colors"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        <span>{cat?.label || entry.category}</span>
        <span>{STATUS_LABEL[entry.status]}</span>
      </div>
      <h3 className="font-serif text-xl leading-tight">
        <Link href={`/cases/${entry.slug}/`} className="hover:!text-[var(--accent)]" style={{ color: "var(--primary)" }}>
          {entry.title}
        </Link>
      </h3>
      {!compact && (
        <p className="font-ui text-sm" style={{ color: "var(--text)" }}>
          {entry.summary}
        </p>
      )}
      <div className="font-mono text-[11px] mt-auto pt-2" style={{ color: "var(--text-muted)" }}>
        {entry.date}
        {entry.jurisdiction ? ` · ${entry.jurisdiction}` : ""}
        {entry.dollarAmount ? ` · $${entry.dollarAmount.toLocaleString()}` : ""}
      </div>
    </article>
  );
}
