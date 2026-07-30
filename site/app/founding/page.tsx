import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FoundingCounter } from "@/components/monetization/FoundingCounter";
import { MembershipTiers } from "@/components/monetization/MembershipTiers";

export const metadata: Metadata = {
  title: "Founding membership",
  description:
    "Fund the next year of the archive. Founding memberships keep the record free, permanent, and independent.",
  alternates: { canonical: "/founding/" },
};

const BENEFITS = [
  "Full commentary on the corrections log, showing what changed and why",
  "Early access to new entries before they publish",
  "Downloadable citation bundles for research use",
  "The quarterly State of the Record, a long-form review of what the archive added and corrected",
  "A permanent founding rate that never rises for you",
];

export default function FoundingPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">Keep the record free, permanent, and independent.</h1>
        <p className="font-ui text-base mb-10 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          This archive documents a sourced public record. Every entry cited, every claim
          timestamped. Founding memberships fund the next year of it.
        </p>

        <FoundingCounter />

        <div className="mt-16 border-t rule pt-12">
          <h2 className="font-serif mb-3">What your membership funds</h2>
          <p className="font-ui text-base mb-4 max-w-3xl" style={{ color: "var(--text-muted)" }}>
            Reference material only stays trustworthy if someone maintains it. Links rot. Sources
            move. Entries need re-verification. That upkeep is the whole reason this archive is worth
            citing.
          </p>
          <p className="font-ui text-base max-w-3xl" style={{ color: "var(--text-muted)" }}>
            Every dollar goes to keeping the record accurate and open: re-verifying citations, adding
            new documented entries, and keeping the archive free for anyone who needs it, including
            the students, researchers, and reporters who will always have free access.
          </p>
        </div>

        <div className="mt-16 border-t rule pt-12">
          <h2 className="font-serif mb-6">What founding members get</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {BENEFITS.map((b) => (
              <li
                key={b}
                style={{
                  display: "grid",
                  gridTemplateColumns: "22px 1fr",
                  gap: 14,
                  padding: "13px 0",
                  borderBottom: "1px solid var(--rule)",
                  alignItems: "start",
                }}
              >
                <span className="font-mono" style={{ color: "var(--color-ledger-olive)", fontWeight: 600, fontSize: 13 }}>
                  {"\u2713"}
                </span>
                <span className="font-ui" style={{ color: "var(--text)" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t rule pt-12">
          <h2 className="font-serif mb-6">Choose your support</h2>
          <MembershipTiers />
        </div>
      </Container>
    </Section>
  );
}
