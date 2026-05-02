"use client";

import { useEffect, useRef, useState } from "react";

export interface Tile {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  asOf: string;
  href?: string;
  format?: "number" | "currency" | "compact";
}

const TILES: Tile[] = [
  { value: 88_300_000, prefix: "$", label: "Damages awarded in E. Jean Carroll defamation cases (combined)", asOf: "2024-09-08", href: "/data/", format: "currency" },
  { value: 6, label: "Corporate Chapter 11 filings tied to Trump-controlled entities (1991-2014)", asOf: "2014-09-09", href: "/topics/bankruptcies/" },
  { value: 34, label: "Felony counts of falsifying business records, returned by jury", asOf: "2024-05-30", href: "/cases/ny-34-count-felony-conviction/" },
  { value: 1500, suffix: "+", label: "Clemency grants to January 6 defendants (Jan 20, 2025)", asOf: "2025-01-20", href: "/data/" },
  { value: 178_000, prefix: "−", label: "Net manufacturing jobs, January 2017 to January 2021 (BLS)", asOf: "2021-01-31", href: "/data/" },
  { value: 712_060_000, prefix: "$", label: "Trump Media (DJT) reported 2025 net loss", asOf: "2026-02-27", href: "/cases/djt-tmtg-stock-collapse/", format: "currency" },
  { value: 43, label: "Days of the October-November 2025 federal shutdown (longest in U.S. history)", asOf: "2025-11-12", href: "/data/" },
  { value: 9, label: "Cases dismissed or sanctioned where Trump or affiliated entities were the plaintiff (2009-2026)", asOf: "2026-04-13", href: "/topics/failed-lawsuits/" },
];

function formatValue(t: Tile): string {
  const v = t.value;
  if (t.format === "currency") {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return v.toLocaleString();
    return v.toString();
  }
  return v.toLocaleString();
}

function CounterTile({ t }: { t: Tile }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) {
      setShown(t.value);
      return;
    }
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(t.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [t.value, reduce]);

  const display: string = (() => {
    const v = shown;
    if (t.format === "currency") {
      if (t.value >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
      if (t.value >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    }
    return v.toLocaleString();
  })();

  const Wrap = ({ children }: { children: React.ReactNode }) =>
    t.href ? (
      <a href={t.href} className="block h-full hover:!text-inherit">
        {children}
      </a>
    ) : (
      <div className="h-full">{children}</div>
    );

  return (
    <div
      ref={ref}
      className="border rule p-5 flex flex-col justify-between min-h-[160px]"
      style={{ background: "var(--surface)" }}
    >
      <Wrap>
        <div
          className="font-serif font-semibold leading-none"
          style={{ color: "var(--primary)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
          aria-live="polite"
        >
          {t.prefix}
          {display}
          {t.suffix}
        </div>
        <div className="font-ui text-sm mt-3" style={{ color: "var(--text)" }}>
          {t.label}
        </div>
        <div className="font-mono text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
          As of {t.asOf}
        </div>
      </Wrap>
    </div>
  );
}

export function Scoreboard() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t, i) => (
          <CounterTile key={i} t={t} />
        ))}
      </div>
      <p className="font-ui text-xs mt-4" style={{ color: "var(--text-muted)" }}>
        Each figure links to its methodology and underlying entries. See{" "}
        <a href="/methodology/" className="underline">
          /methodology
        </a>{" "}
        for sourcing rules and update cadence.
      </p>
    </div>
  );
}

export { TILES };
