import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How entries are selected, sourced, scored, and updated.",
  alternates: { canonical: "/methodology/" },
};

export default function MethodologyPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-6">Methodology</h1>
        <div className="entry-prose font-serif text-lg" style={{ color: "var(--text)" }}>
          <h2 className="font-serif text-2xl mt-6 mb-3">Inclusion criteria</h2>
          <p>
            An entry qualifies for the archive when it is (a) a court judgment,
            settlement, or jury finding adverse to Donald Trump or a
            Trump-controlled entity; or (b) a corporate Chapter 11 filing of a
            Trump-controlled or Trump-branded entity; or (c) a brand,
            partnership, or product that closed, was discontinued, or was
            de-branded under documented circumstances; or (d) a certified
            electoral defeat of Trump or a Trump-endorsed candidate; or (e) a
            policy decision with a measurable, sourced negative outcome; or (f)
            a criminal conviction or guilty plea by a close associate or
            co-defendant.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Counters</h2>
          <p>
            Each scoreboard tile reflects a current, verifiable total drawn
            from the published entries below it. When a ruling is reversed on
            appeal, the tile reflects the current legal status; the underlying
            entry retains the original number with a vacated note and a link to
            the reversing opinion.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Date conventions</h2>
          <p>
            Primary date for a court matter is the date of the operative
            ruling, judgment, or filing. Bankruptcy primary date is the
            petition date. Election entries use the certification date.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Update cadence</h2>
          <p>
            New entries publish on a rolling basis. Entries are reviewed
            quarterly for status changes (appeals, settlements, vacaturs) and
            link rot. A &ldquo;What changed this week&rdquo; index regenerates
            each Friday and feeds the newsletter digest.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Mirroring</h2>
          <p>
            Every external source URL is mirrored to the Internet Archive
            Wayback Machine on day of publication. The Wayback URL is stored
            alongside the live URL so the archive remains usable when sources
            move or disappear.
          </p>
        </div>
      </Container>
    </Section>
  );
}
