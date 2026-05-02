"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { NAV } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-50 border-b rule backdrop-blur"
      style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Logo />
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 font-ui text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cases/"
            aria-label="Search the archive"
            className="font-ui text-xs uppercase tracking-wider px-3 py-1.5 border rule hover:border-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}
          >
            Search
          </Link>
          <ThemeToggle />
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden font-ui text-sm px-2 py-1 border rule"
        >
          Menu
        </button>
      </div>
      {open && (
        <nav aria-label="Primary mobile" className="md:hidden border-t rule">
          <ul className="flex flex-col px-6 py-4 gap-3 font-ui">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block py-1"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t rule">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
