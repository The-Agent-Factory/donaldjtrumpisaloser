import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WireFeed } from "@/components/WireFeed";

export const metadata: Metadata = {
  title: "The Live Wire",
  description:
    "Sourced coverage of the administration from outlets across the spectrum — Fox News through the Guardian, plus whitehouse.gov primary sources. Refreshed every two hours.",
};

export default function WirePage() {
  return (
    <>
      <Section as="header" className="pt-20 md:pt-28 pb-10 border-b rule">
        <Container>
          <h1 className="font-serif" style={{ color: "var(--primary)" }}>
            The Live Wire
          </h1>
          <p className="font-ui text-lg mt-6 max-w-3xl" style={{ color: "var(--text)" }}>
            Automated aggregation of coverage from outlets across the political
            spectrum — deliberately including Fox News and whitehouse.gov itself —
            refreshed every two hours. Each item links to the original source and
            carries the outlet&apos;s general orientation so you can weigh the
            framing. Aggregation is not endorsement; the curated archive holds
            only human-verified entries.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <WireFeed />
        </Container>
      </Section>
    </>
  );
}
