import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { entries } from "@/content/entries";
import { categories } from "@/content/categories";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Documented entries arranged by date, banded by category.",
  alternates: { canonical: "/timeline/" },
};

const COLORS: Record<string, string> = {
  bankruptcies: "var(--color-archive-navy)",
  "civil-judgments": "var(--color-citation-burgundy)",
  "criminal-cases": "var(--color-charcoal-ink)",
  "failed-businesses": "var(--color-stamp-amber)",
  "failed-properties": "var(--color-ledger-olive)",
  defamation: "var(--color-citation-burgundy)",
  "election-losses": "var(--color-archive-navy)",
  "failed-lawsuits": "var(--color-microfilm-grey)",
  "convicted-associates": "var(--color-charcoal-ink)",
  "regulatory-penalties": "var(--color-stamp-amber)",
  "promises-vs-outcomes": "var(--color-ledger-olive)",
  "second-term-court-losses": "var(--color-citation-burgundy)",
};

export default function TimelinePage() {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));
  const byYear = sorted.reduce<Record<string, typeof entries>>((acc, e) => {
    const y = e.date.slice(0, 4);
    (acc[y] ||= []).push(e);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort();
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">Timeline</h1>
        <p className="font-ui text-base mb-8 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          {sorted.length} entries from {years[0]} to {years[years.length - 1]}.
          Categories are color-banded; tap any dot for the underlying entry.
        </p>

        <div className="flex flex-wrap gap-2 mb-8 font-mono text-[11px] uppercase tracking-widest">
          {categories.map((c) => (
            <span key={c.id} className="px-2 py-1 border rule flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <span
                aria-hidden
                className="inline-block"
                style={{ width: 10, height: 10, background: COLORS[c.id] }}
              />
              {c.label}
            </span>
          ))}
        </div>

        <div className="space-y-12">
          {years.map((y) => (
            <section key={y} className="border-l-2 pl-6 rule">
              <h2
                className="font-serif text-3xl mb-4"
                style={{ color: "var(--primary)" }}
              >
                {y}
              </h2>
              <ul className="space-y-3">
                {byYear[y].map((e) => (
                  <li key={e.id} className="flex gap-4 items-start">
                    <span
                      aria-hidden
                      className="mt-2 inline-block"
                      style={{
                        width: 12,
                        height: 12,
                        background: COLORS[e.category] || "var(--text-muted)",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="flex-1">
                      <Link
                        href={`/cases/${e.slug}/`}
                        className="font-serif text-lg hover:!text-[var(--accent)]"
                        style={{ color: "var(--primary)" }}
                      >
                        {e.title}
                      </Link>
                      <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {e.date}
                        {e.jurisdiction ? ` · ${e.jurisdiction}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
