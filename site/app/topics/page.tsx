import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { categories } from "@/content/categories";
import { entries } from "@/content/entries";

export const metadata: Metadata = {
  title: "Topics",
  description: "Twelve categories of documented loss.",
  alternates: { canonical: "/topics/" },
};

export default function TopicsPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-serif mb-3">Topics</h1>
        <p className="font-ui text-base mb-10 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          Twelve neutral, descriptive categories. Every entry carries one
          primary category and may also appear under related tags.
        </p>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = entries.filter((e) => e.category === c.id).length;
            return (
              <li key={c.id}>
                <Link
                  href={`/topics/${c.slug}/`}
                  className="block border rule p-5 h-full hover:border-[var(--accent)]"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="font-serif text-lg" style={{ color: "var(--primary)" }}>
                    {c.label}
                  </div>
                  <div className="font-ui text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                    {c.description}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-widest mt-3" style={{ color: "var(--text-muted)" }}>
                    {count} {count === 1 ? "entry" : "entries"}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
