import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Scoreboard } from "@/components/Scoreboard";
import { EntryCard } from "@/components/EntryCard";
import { SubstackEmbed } from "@/components/monetization/SubstackEmbed";
import { entries } from "@/content/entries";
import { categories } from "@/content/categories";
import { SITE } from "@/lib/site";

export default function Home() {
  const featured = ["B3", "B2", "A18"]
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const recent = [...entries]
    .sort((a, b) => (a.lastUpdated > b.lastUpdated ? -1 : 1))
    .slice(0, 5);

  return (
    <>
      <Section as="header" className="pt-20 md:pt-28 pb-10 border-b rule">
        <Container>
          <div className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Established {SITE.established} · Published from Ottawa, Canada
          </div>
          <h1 className="font-serif" style={{ color: "var(--primary)" }}>
            A documented historical record of Donald J. Trump&apos;s losses.
          </h1>
          <p className="font-ui text-lg mt-6 max-w-3xl" style={{ color: "var(--text)" }}>
            A unified, citation-anchored archive of court judgments, bankruptcies,
            failed ventures, electoral defeats, and policy decisions with
            measurably worse outcomes. Every entry links to a primary source.
            Every claim has a last-verified date and a public corrections log.
          </p>
          <form action="/cases/" className="mt-8 flex gap-2 max-w-xl" role="search">
            <label htmlFor="q" className="sr-only">
              Search the archive
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Search 26 entries by name, year, or amount"
              className="flex-1 px-4 py-3 border rule font-ui"
              style={{ background: "var(--surface)", color: "var(--text)" }}
            />
            <button
              type="submit"
              className="px-5 py-3 border rule font-ui text-sm uppercase tracking-wider"
              style={{ background: "var(--primary)", color: "var(--bg)" }}
            >
              Search
            </button>
          </form>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
            <h2 className="font-serif">By the numbers</h2>
            <Link href="/data/" className="font-ui text-sm underline">
              Full dashboard
            </Link>
          </div>
          <Scoreboard />
        </Container>
      </Section>

      <Section className="border-t rule">
        <Container>
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
            <h2 className="font-serif">Updated this week</h2>
            <Link href="/cases/" className="font-ui text-sm underline">
              All cases
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((e) => (
              <EntryCard key={e.id} entry={e} compact />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t rule">
        <Container>
          <h2 className="font-serif mb-8">Featured entries</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t rule">
        <Container>
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
            <h2 className="font-serif">Browse by topic</h2>
            <Link href="/topics/" className="font-ui text-sm underline">
              All topics
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/topics/${c.slug}/`}
                className="border rule p-4 hover:border-[var(--accent)]"
                style={{ background: "var(--surface)" }}
              >
                <div className="font-serif text-base" style={{ color: "var(--primary)" }}>
                  {c.label}
                </div>
                <div className="font-ui text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {c.description}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t rule">
        <Container size="narrow">
          <h2 className="font-serif mb-3">Newsletter</h2>
          <p className="font-ui text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            One weekly digest. What changed in the archive, with citations. No
            mailing-list churn, no partisan framing. Free; paid tier supports
            the work.
          </p>
          <SubstackEmbed />
          <p className="font-ui text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            Paid tier: $6 / month, $60 / year, $200 founding. Free for verified
            students, journalists, and educators.
          </p>
        </Container>
      </Section>
    </>
  );
}
