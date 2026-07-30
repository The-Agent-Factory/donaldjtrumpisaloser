import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t rule mt-24"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-serif text-lg" style={{ color: "var(--primary)" }}>
            {SITE.name}
          </div>
          <p className="font-ui text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            {SITE.tagline} {SITE.secondary}
          </p>
          <p className="font-ui text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            Not affiliated with, endorsed by, or connected to Donald J. Trump,
            the Trump Organization, the Office of the President, or any Trump
            family member, business, campaign, or charitable entity.
          </p>
        </div>
        <div>
          <div className="font-ui text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Editorial
          </div>
          <ul className="font-ui text-sm space-y-2">
            {FOOTER_LINKS.editorial.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-ui text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Connect
          </div>
          <ul className="font-ui text-sm space-y-2">
            {FOOTER_LINKS.connect.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t rule">
        <div className="max-w-6xl mx-auto px-6 py-6 font-ui text-xs flex flex-col md:flex-row justify-between gap-2" style={{ color: "var(--text-muted)" }}>
          <div>
            &copy; {year} {SITE.name}. {SITE.publisher}
          </div>
          <div>An independent, citation-based historical reference.</div>
        </div>
      </div>
    </footer>
  );
}
