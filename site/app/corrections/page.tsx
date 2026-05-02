import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Corrections",
  description: "Public corrections register with date, what changed, and why.",
  alternates: { canonical: "/corrections/" },
};

const CORRECTIONS: { date: string; entry: string; what: string; why: string }[] = [
  // Seed empty for launch — populate as corrections accrue.
];

export default function CorrectionsPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-3">Corrections</h1>
        <p className="font-ui text-base mb-8" style={{ color: "var(--text-muted)" }}>
          A public register of every change made to a published entry after
          first publication. Date, entry affected, what changed, and why.
        </p>
        {CORRECTIONS.length === 0 ? (
          <div className="border rule p-5 font-ui text-sm" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
            No corrections logged yet. This page will be populated as the
            archive accrues entries and revisions.
          </div>
        ) : (
          <ul className="space-y-4">
            {CORRECTIONS.map((c, i) => (
              <li key={i} className="border rule p-4" style={{ background: "var(--surface)" }}>
                <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {c.date} · {c.entry}
                </div>
                <div className="font-serif text-base mt-2">{c.what}</div>
                <div className="font-ui text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {c.why}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
