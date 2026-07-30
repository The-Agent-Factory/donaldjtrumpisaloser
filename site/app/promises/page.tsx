import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { promises } from "@/content/promises";

export const metadata: Metadata = {
  title: "Promises versus outcomes",
  description: "Campaign and policy promises measured against documented results.",
  alternates: { canonical: "/promises/" },
};

const STATUS: Record<string, { label: string; color: string }> = {
  kept: { label: "Kept", color: "var(--color-ledger-olive)" },
  broken: { label: "Broken", color: "var(--color-citation-burgundy)" },
  "partially-kept": { label: "Partially kept", color: "var(--color-stamp-amber)" },
  reversed: { label: "Reversed", color: "var(--color-citation-burgundy)" },
  "no-measurable-outcome": {
    label: "No measurable outcome",
    color: "var(--color-microfilm-grey)",
  },
};

export default function PromisesPage() {
  const tally = promises.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">Promises versus outcomes</h1>
        <p className="font-ui text-base mb-8 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          Heavily-reported promises measured against documented results. Status
          uses five labels: kept, broken, partially kept, reversed, no
          measurable outcome.
        </p>
        <div className="flex flex-wrap gap-3 mb-10 font-mono text-xs uppercase tracking-widest">
          {Object.entries(STATUS).map(([k, v]) => (
            <span key={k} className="px-2 py-1 border rule flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <span aria-hidden style={{ width: 10, height: 10, background: v.color, display: "inline-block" }} />
              {v.label}: {tally[k] || 0}
            </span>
          ))}
        </div>

        <ul className="grid gap-5 md:grid-cols-2">
          {promises.map((p) => {
            const s = STATUS[p.status];
            return (
              <li
                key={p.id}
                className="border rule p-5 grid gap-3"
                style={{ background: "var(--surface)" }}
              >
                <div className="grid gap-1">
                  <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Said
                  </div>
                  <div className="font-serif text-lg">&ldquo;{p.said}&rdquo;</div>
                </div>
                <div className="grid gap-1">
                  <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    Happened
                  </div>
                  <div className="font-serif text-base">{p.happened}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t rule">
                  <span
                    className="font-mono text-[11px] uppercase tracking-widest px-2 py-1"
                    style={{ background: s.color, color: "#fff" }}
                  >
                    {s.label}
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {p.date}
                  </span>
                </div>
                <ol className="font-ui text-xs list-decimal pl-5 space-y-1" style={{ color: "var(--text-muted)" }}>
                  {p.sources.map((src, i) => (
                    <li key={i}>{src.label}</li>
                  ))}
                </ol>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
