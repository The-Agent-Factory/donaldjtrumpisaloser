"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface PanelStory {
  headline: string;
  why_it_matters: string;
  picked_by: string[];
}

interface PanelFlag {
  claim: string;
  assessment: string;
  flagged_by: string;
}

interface Panel {
  date: string;
  article_count: number;
  consensus: {
    verdicts_by_model: Record<string, string>;
    pooled_fact_flags: PanelFlag[];
    stories_ranked_by_panel_agreement: PanelStory[];
  };
}

const MODEL_LABELS: Record<string, string> = {
  claude: "Claude (Anthropic)",
  chatgpt: "ChatGPT (OpenAI)",
  gemini: "Gemini (Google)",
  grok: "Grok (xAI)",
  "qwen-local": "Qwen (local)",
};

function usePanel(): Panel | null {
  const [panel, setPanel] = useState<Panel | null>(null);
  useEffect(() => {
    fetch("/data/panel-latest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setPanel)
      .catch(() => setPanel(null));
  }, []);
  return panel;
}

/** Homepage strip: whole section (heading included) hides until the first
 *  automated panel run has published data. */
export function HomePanelSection() {
  const panel = usePanel();
  if (!panel?.consensus) return null;
  return (
    <Section className="border-t rule">
      <Container>
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <h2 className="font-serif">Today&apos;s 24-Hour Panel</h2>
          <Link href="/panel/" className="font-ui text-sm underline">
            Full analysis
          </Link>
        </div>
        <PanelBody panel={panel} compact />
      </Container>
    </Section>
  );
}

export function PanelDigest({ compact = false }: { compact?: boolean }) {
  const panel = usePanel();
  // Renders nothing until the first automated panel run has published data.
  if (!panel?.consensus) return null;
  return <PanelBody panel={panel} compact={compact} />;
}

function PanelBody({ panel, compact }: { panel: Panel; compact?: boolean }) {

  const verdicts = Object.entries(panel.consensus.verdicts_by_model || {}).filter(
    ([, v]) => v
  );
  const stories = panel.consensus.stories_ranked_by_panel_agreement || [];
  const flags = panel.consensus.pooled_fact_flags || [];

  return (
    <div>
      <div
        className="font-mono text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        {panel.date} · {panel.article_count} sourced items · {verdicts.length}{" "}
        independent AI panelists
      </div>

      <div className="grid gap-4">
        {verdicts.map(([model, verdict]) => (
          <blockquote
            key={model}
            className="border-l-4 pl-4 py-2"
            style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
          >
            <p className="font-serif text-lg" style={{ color: "var(--text)" }}>
              &ldquo;{verdict}&rdquo;
            </p>
            <footer
              className="font-ui text-xs mt-2 uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              — {MODEL_LABELS[model] || model}
            </footer>
          </blockquote>
        ))}
      </div>

      {!compact && stories.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif mb-4">Stories the panel agreed mattered</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {stories.slice(0, 6).map((s) => (
              <article
                key={s.headline}
                className="border rule p-4"
                style={{ background: "var(--surface)" }}
              >
                <h4 className="font-serif text-base" style={{ color: "var(--primary)" }}>
                  {s.headline}
                </h4>
                <p className="font-ui text-sm mt-2" style={{ color: "var(--text)" }}>
                  {s.why_it_matters}
                </p>
                <div
                  className="font-mono text-[11px] uppercase tracking-widest mt-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Independently flagged by {s.picked_by?.length ?? 0} rival models
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {!compact && flags.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif mb-4">Fact flags</h3>
          <div className="grid gap-4">
            {flags.slice(0, 6).map((f) => (
              <div
                key={f.claim}
                className="border-l-4 pl-4 py-2"
                style={{ borderColor: "var(--danger, #b91c1c)", background: "var(--surface)" }}
              >
                <p className="font-ui text-sm" style={{ color: "var(--text)" }}>
                  <strong>Claim:</strong> {f.claim}
                </p>
                <p className="font-ui text-sm mt-1" style={{ color: "var(--text)" }}>
                  <strong>Assessment:</strong> {f.assessment}
                </p>
                <div
                  className="font-mono text-[11px] uppercase tracking-widest mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  flagged by {MODEL_LABELS[f.flagged_by] || f.flagged_by}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {compact && (
        <Link href="/panel/" className="font-ui text-sm underline mt-4 inline-block">
          Full panel analysis, agreed stories, and fact flags →
        </Link>
      )}
    </div>
  );
}
