import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { StudioDaily } from "@/components/StudioDaily";

export const metadata: Metadata = {
  title: "The Studio",
  description:
    "The daily distribution package, auto-generated from the 24-Hour Panel: the rendered Short, the X thread, the TikTok script, and the Substack edition — ready to post.",
  robots: { index: false },
};

export default function StudioPage() {
  return (
    <>
      <Section as="header" className="pt-20 md:pt-28 pb-10 border-b rule">
        <Container>
          <h1 className="font-serif" style={{ color: "var(--primary)" }}>
            The Studio
          </h1>
          <p className="font-ui text-lg mt-6 max-w-3xl" style={{ color: "var(--text)" }}>
            Everything the machine produced today, ready to distribute: the
            auto-rendered Short, the X thread, the TikTok script, and the
            Substack edition. Regenerated every morning after the 11:00 UTC
            panel run.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <StudioDaily />
        </Container>
      </Section>
    </>
  );
}
