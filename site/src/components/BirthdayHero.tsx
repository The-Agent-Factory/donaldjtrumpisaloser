"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Birthday edition hero. Editorial commentary in the same deadpan, sourced
 * register as the rest of the archive: the framing is the joke, the figures
 * are the record. Donald John Trump was born June 14, 1946, in Queens, NY.
 */

const BIRTH_YEAR = 1946;
const BIRTH_MONTH = 6; // June
const BIRTH_DAY = 14;

function ageOn(d: Date): number {
  let age = d.getFullYear() - BIRTH_YEAR;
  const beforeBirthday =
    d.getMonth() + 1 < BIRTH_MONTH ||
    (d.getMonth() + 1 === BIRTH_MONTH && d.getDate() < BIRTH_DAY);
  if (beforeBirthday) age -= 1;
  return age;
}

/** True on June 13–15 (visitor local time) so the banner is evergreen. */
function inBirthdayWindow(d: Date): boolean {
  return d.getMonth() + 1 === BIRTH_MONTH && d.getDate() >= 13 && d.getDate() <= 15;
}

// Decade candles: eight candles, one per decade. Deterministic so server and
// client render identically; the flicker timing is pure CSS.
const CANDLES = Array.from({ length: 8 }, (_, i) => ({
  x: 26 + i * 17.7,
  delay: (i % 4) * 0.18,
}));

// Deterministic confetti burst fired when the candles are blown out. Fixed
// values (no Math.random) keep hydration stable.
const CONFETTI = [
  { l: 8, c: "var(--color-citation-burgundy)", d: 0, x: -14, r: 14 },
  { l: 17, c: "var(--color-stamp-amber)", d: 0.05, x: 10, r: -20 },
  { l: 24, c: "var(--color-archive-navy)", d: 0.12, x: -6, r: 8 },
  { l: 33, c: "var(--color-ledger-olive)", d: 0.02, x: 16, r: -12 },
  { l: 41, c: "var(--color-stamp-amber)", d: 0.18, x: -10, r: 22 },
  { l: 49, c: "var(--color-citation-burgundy)", d: 0.09, x: 8, r: -6 },
  { l: 57, c: "var(--color-archive-navy)", d: 0.14, x: -16, r: 18 },
  { l: 64, c: "var(--color-ledger-olive)", d: 0.04, x: 12, r: -16 },
  { l: 72, c: "var(--color-stamp-amber)", d: 0.2, x: -8, r: 10 },
  { l: 80, c: "var(--color-citation-burgundy)", d: 0.07, x: 14, r: -22 },
  { l: 88, c: "var(--color-archive-navy)", d: 0.16, x: -12, r: 6 },
  { l: 93, c: "var(--color-stamp-amber)", d: 0.11, x: 6, r: -10 },
];

interface LedgerItem {
  value: string;
  label: string;
  asOf: string;
  href: string;
}

const LEDGER: LedgerItem[] = [
  {
    value: "80",
    label: "Candles, one per year on the public record",
    asOf: "Born June 14, 1946",
    href: "/timeline/",
  },
  {
    value: "6",
    label: "Corporate Chapter 11 filings, 1991–2014",
    asOf: "As of 2014-09-09",
    href: "/topics/bankruptcies/",
  },
  {
    value: "34",
    label: "Felony counts returned by a New York jury",
    asOf: "As of 2024-05-30",
    href: "/cases/ny-felony-conviction-34-counts-2024/",
  },
  {
    value: "$88.3M",
    label: "Carroll defamation damages, combined",
    asOf: "As of 2024-09-08",
    href: "/topics/defamation/",
  },
];

export function BirthdayHero({ gated = false }: { gated?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [lit, setLit] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  // Computed after mount so a static build never bakes in a stale age.
  const [age, setAge] = useState(80);

  useEffect(() => {
    setMounted(true);
    setAge(ageOn(new Date()));
  }, []);

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 1700);
    return () => clearTimeout(t);
  }, [celebrate]);

  // When date-gated (homepage), stay invisible until mounted and in-window so
  // the rest of the year is untouched and there is no hydration flash.
  if (gated && (!mounted || !inBirthdayWindow(new Date()))) return null;

  const blowOut = () => {
    if (lit) setCelebrate(true);
    setLit((v) => !v);
  };

  return (
    <section
      className="relative overflow-hidden border-b rule"
      aria-labelledby="birthday-heading"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, color-mix(in srgb, var(--color-stamp-amber) 16%, transparent), transparent 60%), radial-gradient(90% 70% at 85% 120%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%)",
      }}
    >
      {/* faint dotted "foolscap" texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(var(--rule) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
        }}
      />

      {/* confetti burst on blow-out (post-interaction only) */}
      {celebrate && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="bh-confetti"
              style={{
                left: `${c.l}%`,
                background: c.c,
                animationDelay: `${c.d}s`,
                ["--bh-x" as string]: `${c.x}px`,
                ["--bh-r" as string]: `${c.r}deg`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 pt-24 md:pt-28 pb-14 md:pb-20">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Birthday Edition · 14 June {mounted ? new Date().getFullYear() : 2026} ·
          Dossier DJT-{age}
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Left: the message */}
          <div>
            <h1
              id="birthday-heading"
              className="font-serif leading-[0.95]"
              style={{
                color: "var(--primary)",
                fontSize: "clamp(2.6rem, 7vw, 5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Happy Birthday,
              <br />
              <span style={{ color: "var(--accent)" }}>Loser.</span>
            </h1>

            <p
              className="font-serif text-xl md:text-2xl mt-6 max-w-xl"
              style={{ color: "var(--text)" }}
            >
              Donald John Trump — born June 14, 1946, in Queens, New York —
              turns {age} today. The archive marks the occasion the only way it
              knows how: with the record, fully sourced.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/cases/"
                className="px-5 py-3 border rule font-ui text-sm uppercase tracking-wider"
                style={{ background: "var(--primary)", color: "var(--bg)" }}
              >
                Read the full record
              </Link>
              <Link
                href="/data/"
                className="px-5 py-3 border rule font-ui text-sm uppercase tracking-wider hover:border-[var(--accent)]"
                style={{ color: "var(--text)" }}
              >
                By the numbers
              </Link>
            </div>
          </div>

          {/* Right: the cake */}
          <div className="flex flex-col items-center">
            <svg
              role="img"
              aria-label={`A birthday cake with eight decade candles, iced with the number ${age}.`}
              viewBox="0 0 200 200"
              className="w-full max-w-[340px] h-auto"
            >
              {/* candles */}
              {CANDLES.map((c, i) => (
                <g key={i}>
                  <rect
                    x={c.x}
                    y={70}
                    width={5}
                    height={26}
                    rx={1}
                    fill={
                      i % 2 === 0
                        ? "var(--color-citation-burgundy)"
                        : "var(--color-archive-navy)"
                    }
                  />
                  {/* wick */}
                  <line
                    x1={c.x + 2.5}
                    y1={70}
                    x2={c.x + 2.5}
                    y2={66}
                    stroke="var(--color-charcoal-ink)"
                    strokeWidth={1}
                  />
                  {lit ? (
                    <g className="bh-flame" style={{ transformOrigin: `${c.x + 2.5}px 64px` }}>
                      <ellipse
                        cx={c.x + 2.5}
                        cy={61}
                        rx={3}
                        ry={6}
                        fill="var(--color-stamp-amber)"
                        style={{ animationDelay: `${c.delay}s` }}
                        className="bh-flame-outer"
                      />
                      <ellipse cx={c.x + 2.5} cy={62.5} rx={1.4} ry={3} fill="#FBF8F1" />
                    </g>
                  ) : (
                    <path
                      className="bh-smoke"
                      d={`M${c.x + 2.5} 66 q4 -6 0 -12 q-4 -6 0 -12`}
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    />
                  )}
                </g>
              ))}

              {/* plate */}
              <ellipse cx={100} cy={176} rx={86} ry={9} fill="var(--rule)" />
              {/* lower tier */}
              <rect
                x={22}
                y={120}
                width={156}
                height={52}
                rx={5}
                fill="var(--color-document-cream)"
                stroke="var(--color-archive-navy)"
                strokeWidth={2}
              />
              {/* burgundy drip band */}
              <path
                d="M22 120 h156 v10 q-13 9 -26 0 q-13 -9 -26 0 q-13 9 -26 0 q-13 -9 -26 0 q-13 9 -26 0 q-7 -5 -13 0 q-7 5 -13 0 z"
                fill="var(--accent)"
                opacity={0.92}
              />
              {/* upper tier */}
              <rect
                x={46}
                y={94}
                width={108}
                height={30}
                rx={4}
                fill="var(--color-bond-paper)"
                stroke="var(--color-archive-navy)"
                strokeWidth={2}
              />
              {/* iced number */}
              <text
                x={100}
                y={116}
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontSize={22}
                fontWeight={700}
                fill="var(--color-archive-navy)"
              >
                {age}
              </text>
            </svg>

            <button
              type="button"
              onClick={blowOut}
              aria-pressed={!lit}
              className="mt-4 font-ui text-xs uppercase tracking-wider px-4 py-2 border rule hover:border-[var(--accent)]"
              style={{ color: "var(--text-muted)", background: "var(--surface)" }}
            >
              {lit ? "Blow out the candles" : "Relight the candles"}
            </button>
            <p
              className="font-mono text-[11px] mt-3 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              {lit
                ? "Eight decade candles. One documented record."
                : "Make a wish. The judgments stand."}
            </p>
          </div>
        </div>

        {/* The birthday ledger */}
        <div className="mt-14">
          <div
            className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            The birthday ledger
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEDGER.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="border rule p-5 flex flex-col justify-between min-h-[150px] hover:border-[var(--accent)] hover:!text-inherit transition-colors"
                style={{ background: "var(--surface)" }}
              >
                <div
                  className="font-serif font-semibold leading-none"
                  style={{
                    color: "var(--primary)",
                    fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  }}
                >
                  {item.value}
                </div>
                <div className="font-ui text-sm mt-3" style={{ color: "var(--text)" }}>
                  {item.label}
                </div>
                <div
                  className="font-mono text-[11px] mt-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.asOf}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p
          className="font-ui text-xs mt-8 max-w-3xl"
          style={{ color: "var(--text-muted)" }}
        >
          &ldquo;Happy Birthday, Loser&rdquo; is editorial commentary, protected
          by free-expression principles in Canada and the United States, and is
          consistent with the name of this archive. Every figure above links to
          its underlying entries and primary sources. See{" "}
          <Link href="/about/" className="underline">
            about
          </Link>{" "}
          and{" "}
          <Link href="/methodology/" className="underline">
            methodology
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
