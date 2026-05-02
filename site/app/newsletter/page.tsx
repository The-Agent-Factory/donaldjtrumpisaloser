import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SubstackEmbed } from "@/components/monetization/SubstackEmbed";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "A weekly digest of what changed in the archive.",
  alternates: { canonical: "/newsletter/" },
};

export default function NewsletterPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-3">Newsletter</h1>
        <p className="font-ui text-base mb-8" style={{ color: "var(--text-muted)" }}>
          One weekly digest. What changed in the archive, with citations. No
          mailing-list churn. No partisan framing. Free; a paid tier supports
          the work.
        </p>
        <SubstackEmbed />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="border rule p-5" style={{ background: "var(--surface)" }}>
            <div className="font-serif text-lg" style={{ color: "var(--primary)" }}>
              Free
            </div>
            <ul className="font-ui text-sm mt-3 list-disc pl-5 space-y-1">
              <li>Weekly &ldquo;What changed&rdquo; digest</li>
              <li>Daily &ldquo;On this day&rdquo; post</li>
              <li>Full access to all entries on the site</li>
            </ul>
          </div>
          <div className="border rule p-5" style={{ background: "var(--surface)" }}>
            <div className="font-serif text-lg" style={{ color: "var(--primary)" }}>
              Paid · $6 / month
            </div>
            <ul className="font-ui text-sm mt-3 list-disc pl-5 space-y-1">
              <li>Monthly deep-dive long-read</li>
              <li>Searchable database export (CSV / JSON)</li>
              <li>Private comment thread for paid members</li>
              <li>By-the-numbers email when major counters update</li>
            </ul>
            <p className="font-ui text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              $60 / year. $200 founding tier. Free for verified students,
              journalists, and educators.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
