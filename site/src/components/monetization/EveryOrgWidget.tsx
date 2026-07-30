const ORGS = [
  { slug: "aclu", name: "ACLU", desc: "Civil liberties litigation, including First Amendment and voting rights." },
  { slug: "brennan-center-for-justice", name: "Brennan Center for Justice", desc: "Nonpartisan law and policy institute focused on democracy and justice." },
  { slug: "states-united-democracy-center", name: "States United Democracy Center", desc: "Bipartisan organization advancing free, fair, and secure elections." },
  { slug: "common-cause", name: "Common Cause", desc: "Pro-democracy nonpartisan grassroots organization." },
  { slug: "protect-democracy", name: "Protect Democracy", desc: "Cross-ideological nonprofit dedicated to preventing democratic decline." },
  { slug: "democracy-docket", name: "Democracy Docket / United Elections Fund", desc: "Voting rights litigation and election protection." },
  { slug: "citizens-for-responsibility-and-ethics-in-washington", name: "CREW", desc: "Government ethics and accountability watchdog." },
  { slug: "voto-latino-foundation", name: "Voto Latino", desc: "Latino civic engagement and voter registration." },
  { slug: "league-of-women-voters", name: "League of Women Voters", desc: "Nonpartisan voter education and election protection." },
];

const CANADIAN = [
  { name: "Fair Vote Canada", url: "https://www.fairvote.ca/donate/", desc: "Canadian electoral reform advocacy." },
  { name: "Democracy Watch Canada", url: "https://democracywatch.ca/donate/", desc: "Government accountability and democratic reform in Canada." },
];

export function EveryOrgWidget() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif text-xl mb-3" style={{ color: "var(--primary)" }}>
          U.S. civic and legal organizations
        </h3>
        <p className="font-ui text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Donations route directly to the named non-profit through Every.org.
          This site does not handle donor funds and does not receive a cut.
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {ORGS.map((o) => (
            <li
              key={o.slug}
              className="border rule p-4"
              style={{ background: "var(--surface)" }}
            >
              <a
                href={`https://www.every.org/${o.slug}`}
                target="_blank"
                rel="noopener"
                className="font-serif text-lg block mb-1"
                style={{ color: "var(--primary)" }}
              >
                {o.name}
              </a>
              <p className="font-ui text-sm" style={{ color: "var(--text-muted)" }}>
                {o.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-serif text-xl mb-3" style={{ color: "var(--primary)" }}>
          Canadian organizations
        </h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {CANADIAN.map((o) => (
            <li
              key={o.name}
              className="border rule p-4"
              style={{ background: "var(--surface)" }}
            >
              <a
                href={o.url}
                target="_blank"
                rel="noopener"
                className="font-serif text-lg block mb-1"
                style={{ color: "var(--primary)" }}
              >
                {o.name}
              </a>
              <p className="font-ui text-sm" style={{ color: "var(--text-muted)" }}>
                {o.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
