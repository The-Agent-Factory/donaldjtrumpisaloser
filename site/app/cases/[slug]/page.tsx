import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EntryCard } from "@/components/EntryCard";
import { AdSlot } from "@/components/monetization/AdSlot";
import { SubstackEmbed } from "@/components/monetization/SubstackEmbed";
import { entries, getEntryBySlug } from "@/content/entries";
import { categories } from "@/content/categories";
import { entryJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary.slice(0, 200),
    alternates: { canonical: `/cases/${entry.slug}/` },
    openGraph: {
      title: entry.title,
      description: entry.summary.slice(0, 200),
      type: "article",
      publishedTime: entry.date,
      modifiedTime: entry.lastUpdated,
    },
  };
}

const STATUS_LABEL: Record<string, string> = {
  closed: "Closed",
  ongoing: "Ongoing",
  "on-appeal": "On appeal",
  vacated: "Monetary penalty vacated",
};

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const cat = categories.find((c) => c.id === entry.category);
  const related = (entry.relatedIds || [])
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .slice(0, 6);

  const ld = entryJsonLd(entry);
  const url = `${SITE.url}/cases/${entry.slug}/`;

  return (
    <>
      {ld.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
      <Section as="article" className="pt-12 pb-6">
        <Container size="narrow">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: "var(--text-muted)" }}>
            <Link href="/cases/">Cases</Link>
            {" / "}
            <Link href={`/topics/${cat?.slug || ""}/`}>{cat?.label}</Link>
          </nav>

          <header className="mb-8">
            <h1 className="font-serif" style={{ color: "var(--primary)" }}>
              {entry.title}
            </h1>
            <div className="flex flex-wrap gap-3 items-center font-mono text-xs uppercase tracking-widest mt-5" style={{ color: "var(--text-muted)" }}>
              <time dateTime={entry.date}>{entry.date}</time>
              {entry.jurisdiction && <span>· {entry.jurisdiction}</span>}
              <span
                className="px-2 py-0.5 border rule"
                style={{
                  color: entry.status === "vacated" ? "var(--accent)" : "var(--text)",
                }}
              >
                {STATUS_LABEL[entry.status]}
              </span>
              {entry.dollarAmount && (
                <span>· ${entry.dollarAmount.toLocaleString()}</span>
              )}
            </div>
          </header>

          <p className="font-serif text-xl leading-relaxed mb-6" style={{ color: "var(--text)" }}>
            {entry.summary}
          </p>

          <div
            className="border-l-4 pl-5 py-2 mb-10"
            style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
          >
            <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
              Measurable outcome
            </div>
            <div className="font-serif text-lg">{entry.outcome}</div>
          </div>

          {entry.narrative ? (
            <div className="entry-prose font-serif text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              {entry.narrative.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            <div
              className="border rule p-5 font-ui text-sm"
              style={{ background: "var(--surface)", color: "var(--text-muted)" }}
            >
              Extended narrative pending citation expansion. Summary, outcome,
              and source list above are verified against the source inventory.
            </div>
          )}

          <AdSlot className="my-10" />

          <h2 className="font-serif text-2xl mt-12 mb-4">Sources</h2>
          <ol className="list-decimal pl-5 space-y-2 font-ui text-sm">
            {entry.sources.map((s, i) => (
              <li key={i}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener" className="underline">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="border rule p-4" style={{ background: "var(--surface)" }}>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                Last updated
              </div>
              <div className="font-ui text-sm">{entry.lastUpdated}</div>
              <Link href="/corrections/" className="font-ui text-sm underline mt-2 inline-block">
                View change log
              </Link>
            </div>
            <div className="border rule p-4" style={{ background: "var(--surface)" }}>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                Cite this page
              </div>
              <div className="font-mono text-xs leading-relaxed">
                {SITE.name}. &ldquo;{entry.title}.&rdquo; Last updated{" "}
                {entry.lastUpdated}. {url}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 border rule"
                style={{ color: "var(--text-muted)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="border-t rule">
          <Container size="narrow">
            <h2 className="font-serif mb-6">Related entries</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <EntryCard key={e.id} entry={e} compact />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="border-t rule">
        <Container size="narrow">
          <h2 className="font-serif mb-4">Stay current</h2>
          <SubstackEmbed variant="compact" />
        </Container>
      </Section>
    </>
  );
}
