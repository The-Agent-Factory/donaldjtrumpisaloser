import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EntryCard } from "@/components/EntryCard";
import { categories } from "@/content/categories";
import { entries, getEntriesByCategory } from "@/content/entries";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: cat.label,
    description: cat.description,
    alternates: { canonical: `/topics/${cat.slug}/` },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  const list = getEntriesByCategory(cat.id);
  return (
    <Section>
      <Container>
        <div className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          Topic
        </div>
        <h1 className="font-serif mb-3">{cat.label}</h1>
        <p className="font-ui text-base mb-10 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          {cat.description}
        </p>
        {list.length === 0 ? (
          <p className="font-ui text-sm" style={{ color: "var(--text-muted)" }}>
            No entries published in this category yet.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <EntryCard key={e.id} entry={e} compact />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
