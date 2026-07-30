import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Editorial standards",
  description: "Two-source rule, primary-source preference, and review process.",
  alternates: { canonical: "/standards/" },
};

export default function StandardsPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-6">Editorial standards</h1>
        <div className="entry-prose font-serif text-lg" style={{ color: "var(--text)" }}>
          <h2 className="font-serif text-2xl mt-6 mb-3">Two-source rule</h2>
          <p>
            Every factual assertion is anchored to at least one primary source
            (court filing, regulatory document, agency report) and one
            independent secondary source. Where a primary document is
            unavailable, two independent secondary sources are required.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Three content layers</h2>
          <p>
            Content is labelled in one of three layers: verified fact,
            attributed opinion, and editorial framing. Verified fact is the
            default and the only layer permitted in headlines and outcome
            lines.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Verb discipline</h2>
          <p>
            Use precise verbs. &ldquo;Found liable,&rdquo; &ldquo;ruled,&rdquo;
            &ldquo;ordered,&rdquo; &ldquo;filed,&rdquo; &ldquo;settled,&rdquo;
            &ldquo;dismissed with prejudice,&rdquo; &ldquo;affirmed on
            appeal.&rdquo; Avoid characterizations such as &ldquo;crooked,&rdquo;
            &ldquo;rigged,&rdquo; &ldquo;witch hunt,&rdquo; or
            &ldquo;criminal&rdquo; unless adjudicated.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Two-editor sign-off</h2>
          <p>
            No entry publishes without sign-off from two editors. The first
            editor verifies sources. The second reads for tone, legal risk,
            and accuracy.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Corrections</h2>
          <p>
            Corrections are published in a public log with date, what changed,
            and why. Major corrections trigger a top-of-entry notice for 30
            days. See the corrections page for the running register.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Conflict of interest</h2>
          <p>
            Editorial staff, contributors, and advisory board members disclose
            financial, political, or family relationships that bear on coverage.
            Disclosures are published on the about page and updated annually.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-3">Funding disclosure</h2>
          <p>
            Funding sources are disclosed in aggregate (newsletter
            subscriptions, donations, affiliate fees, advertising). No single
            funder receives editorial influence. The site does not accept funds
            from political campaigns, parties, or candidates.
          </p>
        </div>
      </Container>
    </Section>
  );
}
