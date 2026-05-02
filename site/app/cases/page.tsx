import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { entries } from "@/content/entries";
import { categories } from "@/content/categories";
import { CaseFilters } from "./CaseFilters";

export const metadata: Metadata = {
  title: "Cases",
  description: "Browse all documented entries by category, year, and status.",
  alternates: { canonical: "/cases/" },
};

export default function CasesPage() {
  const sorted = [...entries].sort((a, b) => (a.date > b.date ? -1 : 1));
  return (
    <>
      <Section as="header" className="pt-16 pb-6 border-b rule">
        <Container>
          <div className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Cases
          </div>
          <h1 className="font-serif">All documented entries</h1>
          <p className="font-ui text-base mt-3 max-w-3xl" style={{ color: "var(--text-muted)" }}>
            {sorted.length} entries spanning 1973 to {new Date().getFullYear()}.
            Each entry is sourced to at least two independent references and a
            primary document where available.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <Suspense fallback={<div className="font-ui text-sm" style={{ color: "var(--text-muted)" }}>Loading entries...</div>}>
            <CaseFilters entries={sorted} categories={categories} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
