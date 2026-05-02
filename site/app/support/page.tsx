import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EveryOrgWidget } from "@/components/monetization/EveryOrgWidget";
import { DonorboxEmbed } from "@/components/monetization/DonorboxEmbed";

export const metadata: Metadata = {
  title: "Support civic groups",
  description: "Donation pass-through to vetted civic and legal organizations.",
  alternates: { canonical: "/support/" },
};

export default function SupportPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">Support the work</h1>
        <p className="font-ui text-base mb-10 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          The most useful thing you can do is fund the organizations doing the
          litigation, election protection, and watchdog work. Donations route
          directly to the named non-profits below; this site does not handle
          donor funds and does not receive a cut. Each link opens the
          recipient&apos;s own donation page.
        </p>
        <EveryOrgWidget />

        <div className="mt-16 border-t rule pt-12">
          <h2 className="font-serif mb-3">Support this archive</h2>
          <p className="font-ui text-sm mb-6 max-w-2xl" style={{ color: "var(--text-muted)" }}>
            If you would prefer to fund the archive directly, you can do so
            below. Funds cover hosting, legal review, and editorial staff time.
            For most readers, the civic organizations above are a better use of
            money.
          </p>
          <DonorboxEmbed />
        </div>
      </Container>
    </Section>
  );
}
