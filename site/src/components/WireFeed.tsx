"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface WireArticle {
  title: string;
  url: string;
  summary: string;
  published: string | null;
  source: string;
  bias_note: string;
}

interface Wire {
  updated: string;
  articles: WireArticle[];
}

function useWire(): Wire | null {
  const [wire, setWire] = useState<Wire | null>(null);
  useEffect(() => {
    fetch("/data/wire.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setWire)
      .catch(() => setWire(null));
  }, []);
  return wire;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3_600_000);
  if (h < 1) return `${Math.max(1, Math.floor(ms / 60_000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function ArticleCard({ a }: { a: WireArticle }) {
  return (
    <article className="border rule p-4" style={{ background: "var(--surface)" }}>
      <div
        className="font-mono text-[11px] uppercase tracking-widest mb-2 flex justify-between gap-2 flex-wrap"
        style={{ color: "var(--text-muted)" }}
      >
        <span>
          {a.source}
          {a.bias_note ? ` · ${a.bias_note}` : ""}
        </span>
        <span>{timeAgo(a.published)}</span>
      </div>
      <h3 className="font-serif text-base" style={{ color: "var(--primary)" }}>
        <a href={a.url} target="_blank" rel="noopener noreferrer">
          {a.title}
        </a>
      </h3>
      {a.summary && (
        <p className="font-ui text-sm mt-2" style={{ color: "var(--text)" }}>
          {a.summary.length > 220 ? a.summary.slice(0, 220) + "…" : a.summary}
        </p>
      )}
    </article>
  );
}

export function WireFeed({ limit }: { limit?: number }) {
  const wire = useWire();
  if (!wire?.articles?.length) return null;
  const items = limit ? wire.articles.slice(0, limit) : wire.articles;
  return (
    <div>
      <div
        className="font-mono text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        {wire.articles.length} sourced items · outlets across the spectrum ·
        refreshed every 2 hours
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((a) => (
          <ArticleCard key={a.url} a={a} />
        ))}
      </div>
    </div>
  );
}

/** Homepage strip: hides entirely until wire.json has data. */
export function HomeWireSection() {
  const wire = useWire();
  if (!wire?.articles?.length) return null;
  return (
    <Section className="border-t rule">
      <Container>
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <h2 className="font-serif">The live wire</h2>
          <Link href="/wire/" className="font-ui text-sm underline">
            All headlines
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wire.articles.slice(0, 6).map((a) => (
            <ArticleCard key={a.url} a={a} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
