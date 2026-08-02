import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PanelDigest } from "@/components/PanelDigest";

export const metadata: Metadata = {
  title: "The 24-Hour Panel",
  description:
    "Every day, the last 24 hours of coverage — Fox News through the Guardian, plus whitehouse.gov primary sources — is independently analyzed by rival AI models. Their verdicts are published side by side, unedited.",
};

export default function PanelPage() {
  return (
    <>
      <Section as="header" className="pt-20 md:pt-28 pb-10 border-b rule">
        <Container>
          <h1 className="font-serif" style={{ color: "var(--primary)" }}>
            The 24-Hour Panel
          </h1>
          <p className="font-ui text-lg mt-6 max-w-3xl" style={{ color: "var(--text)" }}>
            Each day, the last 24 hours of reporting on the administration — from
            Fox News to the Guardian, plus whitehouse.gov primary sources — goes to
            rival AI models built by competing companies. Each writes an independent
            journalistic analysis under identical instructions: attribute every
            claim, flag falsehoods, note where outlets diverge. Where rivals agree,
            that&apos;s signal. Outputs are published unedited; the full per-model
            JSON is archived in the repository.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <PanelDigest />
          <p className="font-ui text-sm mt-12" style={{ color: "var(--text-muted)" }}>
            No panel published yet today? The panel runs daily at 11:00 UTC. AI
            analysis is clearly labeled and is never a source for the curated
            archive — entries there pass human review against primary sources.
          </p>
        </Container>
      </Section>
    </>
  );
}
