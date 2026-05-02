import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Scoreboard } from "@/components/Scoreboard";

export const metadata: Metadata = {
  title: "Data",
  description: "Running totals across categories of documented loss.",
  alternates: { canonical: "/data/" },
};

export default function DataPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">By the numbers</h1>
        <p className="font-ui text-base mb-8 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          Running totals across the major categories. Each tile is sourced and
          dated. Numbers update when new primary documents arrive or when prior
          rulings are reversed on appeal. See methodology for sourcing rules.
        </p>
        <Scoreboard />

        <h2 className="font-serif mt-16 mb-3">Methodology, in brief</h2>
        <ul className="font-ui list-disc pl-6 space-y-2" style={{ color: "var(--text)" }}>
          <li>Each tile cites a primary or two independent secondary sources.</li>
          <li>Civil and criminal totals are gross, before settlement reductions, and exclude amounts vacated on appeal.</li>
          <li>Bankruptcy count includes all Chapter 11 filings of Trump-controlled or Trump-branded entities, not personal bankruptcies.</li>
          <li>Tiles refresh on the next publication cycle after a verifiable change.</li>
          <li>Where a figure has been reversed, the tile reflects the current legal status and the entry retains the original number with a vacated note.</li>
        </ul>
      </Container>
    </Section>
  );
}
