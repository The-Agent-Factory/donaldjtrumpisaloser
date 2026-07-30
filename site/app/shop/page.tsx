import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Merchandise",
  description: "Factual, text-only designs printed on demand.",
  alternates: { canonical: "/shop/" },
};

const PRODUCTS = [
  {
    title: "Six bankruptcies. Documented.",
    sub: "1991 · 1992 · 1992 · 2004 · 2009 · 2014",
    body: "Letterpress-style poster listing the six Chapter 11 filings of Trump-controlled or Trump-branded entities, with case numbers and courts.",
    citation: "Sources: ABI summaries; D.N.J., S.D.N.Y., D. Del. dockets.",
  },
  {
    title: "$88.3M",
    sub: "Carroll I + Carroll II, combined damages",
    body: "Single-figure mug with the combined federal jury awards in the two E. Jean Carroll defamation matters.",
    citation: "Sources: NPR, May 9, 2023; PBS NewsHour, Sept 8, 2025.",
  },
  {
    title: "Indictments: Manhattan, Mar-a-Lago, January 6, Fulton County",
    sub: "Four jurisdictions, 2023-2024",
    body: "Archival-style poster listing the four 2023-2024 indictments, with dates and dispositions through the most recent ruling.",
    citation: "Sources: SDNY, S.D. Fla., D.D.C., Fulton County dockets.",
  },
  {
    title: "$1, trebled to $3",
    sub: "USFL v. NFL antitrust verdict, July 29, 1986",
    body: "A poster commemorating the antitrust jury award of one dollar, trebled, in the USFL&apos;s suit against the NFL.",
    citation: "Sources: Washington Post, July 30, 1986; ESPN 30 for 30.",
  },
  {
    title: "30,573",
    sub: "False or misleading claims, term one (Washington Post Fact Checker)",
    body: "A single-figure print of the closed Washington Post dataset for the first term.",
    citation: "Source: Washington Post Fact Checker, term-one final tally.",
  },
];

export default function ShopPage() {
  const store = process.env.NEXT_PUBLIC_GELATO_STORE_URL;
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">Merchandise</h1>
        <p className="font-ui text-base mb-8 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          Factual, text-only designs. Printed on demand by Gelato (Toronto and
          Montreal hubs). No likenesses, no caricatures, no profanity. Every
          product cites a source on the design or in the product copy.
        </p>
        {!store && (
          <div className="border rule p-4 mb-8 font-ui text-sm" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
            Storefront is not yet open. Designs below are the launch catalog.
            Set <code>NEXT_PUBLIC_GELATO_STORE_URL</code> to point the buttons
            at the live store.
          </div>
        )}
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <li
              key={p.title}
              className="border rule p-5 flex flex-col gap-3"
              style={{ background: "var(--surface)" }}
            >
              <div>
                <h3 className="font-serif text-xl" style={{ color: "var(--primary)" }}>
                  {p.title}
                </h3>
                <div className="font-mono text-[11px] uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>
                  {p.sub}
                </div>
              </div>
              <p className="font-ui text-sm" style={{ color: "var(--text)" }}>
                {p.body}
              </p>
              <p className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                {p.citation}
              </p>
              {store && (
                <a
                  href={store}
                  target="_blank"
                  rel="noopener nofollow"
                  className="mt-auto self-start px-3 py-2 border rule font-ui text-xs uppercase tracking-wider"
                  style={{ color: "var(--primary)" }}
                >
                  View in store
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="font-ui text-xs mt-10 max-w-2xl" style={{ color: "var(--text-muted)" }}>
          Not affiliated with, endorsed by, sponsored by, or connected to
          Donald J. Trump, the Trump Organization, or any Trump family member,
          business, campaign, or charitable entity.
        </p>
      </Container>
    </Section>
  );
}
