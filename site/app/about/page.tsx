import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "About",
  description: "An independent, citation-based historical reference.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-6">About this archive</h1>
        <div className="entry-prose font-serif text-lg" style={{ color: "var(--text)" }}>
          <p>
            donaldjtrumpisaloser.com is an independent, citation-anchored
            historical archive of Donald J. Trump&apos;s documented losses,
            covering court judgments, bankruptcies, failed business ventures,
            electoral defeats, policy decisions with measurably worse outcomes,
            and the convictions of close associates.
          </p>
          <p>
            The voice is closer to Wikipedia, ProPublica, and the Library of
            Congress than to any partisan publication. Every claim links to a
            primary source. Every entry has a last-verified date and a public
            corrections log. The site is published from Ottawa, Canada.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">What this site is not</h2>
          <p>
            It is not satire, not a partisan campaign tool, and not affiliated
            with any candidate, party, political action committee, or
            fundraising entity. The domain name is editorial commentary
            protected by free expression principles in Canada and the United
            States. The contents are sourced and may be cited.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">Editorial standards</h2>
          <p>
            Two independent sources for every factual claim, with a primary
            document where one exists. Three labelled content layers: verified
            fact, attributed opinion, and editorial framing. Precise verbs only:
            &ldquo;found liable,&rdquo; &ldquo;pleaded guilty,&rdquo;
            &ldquo;settled without admission,&rdquo; &ldquo;dismissed with
            prejudice.&rdquo; A two-editor sign-off before publication. A
            quarterly link-rot audit. A public corrections register.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">Disclaimer</h2>
          <p>
            This site is an independent, citation-based historical reference.
            It is not affiliated with, endorsed by, sponsored by, or connected
            to Donald J. Trump, the Trump Organization, the Office of the
            President, or any Trump family member, business, campaign, or
            charitable entity. All factual claims are sourced to publicly
            available primary documents, court records, regulatory filings, and
            reporting by established news organizations. Where a statement
            reflects opinion or analysis, it is labeled as such. Corrections
            are published in a public log.
          </p>
          <h2 className="font-serif text-2xl mt-10 mb-4">Newsletter and premium tier</h2>
          <p>
            A weekly digest is published on Substack and mirrored on this site.
            All daily and weekly archival posts are free. A paid tier ($6 /
            month, $60 / year, $200 founding) unlocks a deep-dive monthly
            long-read, the searchable database export, and the by-the-numbers
            email when major counters update. Free founding-member status is
            available to verified students, journalists, and educators by
            request.
          </p>
        </div>
      </Container>
    </Section>
  );
}
