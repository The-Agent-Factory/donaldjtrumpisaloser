// Verified feed sources (fetched live 2026-07-05). See PLAN.md for provenance.
// `kind: 'primary'` = official primary source (court/regulator) -> Phase 2 auto-publish eligible.
// `kind: 'general'` = news outlet/aggregator -> always queues for review, never auto-publishes.

export type FeedKind = "primary" | "general";

export interface FeedSource {
  key: string; // stable id, stored on candidates
  url: string;
  kind: FeedKind;
  format: "atom" | "rss"; // CourtListener is Atom; the rest are RSS 2.0
}

export const FEEDS: FeedSource[] = [
  // --- PRIMARY SOURCE: legal / regulator ---------------------------------
  // CourtListener search feeds are the strongest legal signal (no key, near real-time).
  {
    key: "courtlistener-opinions",
    url: "https://www.courtlistener.com/feed/search/?q=Trump&type=o",
    kind: "primary",
    format: "atom",
  },
  {
    key: "courtlistener-recap",
    url: "https://www.courtlistener.com/feed/search/?q=Trump&type=r",
    kind: "primary",
    format: "atom",
  },
  {
    key: "sec-press",
    url: "https://www.sec.gov/news/pressreleases.rss",
    kind: "primary",
    format: "rss",
  },
  {
    key: "sec-admin-proceedings",
    url: "https://www.sec.gov/enforcement-litigation/administrative-proceedings/rss",
    kind: "primary",
    format: "rss",
  },
  {
    key: "ftc-press",
    url: "https://www.ftc.gov/feeds/press-release.xml",
    kind: "primary",
    format: "rss",
  },
  // NOTE: justice.gov/news/rss is intentionally omitted. It sits behind Akamai
  // bot rules that reject server fetches (401) even with browser headers, so it
  // would only ever error and pollute the run log. DOJ press releases surface
  // indirectly through the Google News feeds below, so we lose no coverage.

  // --- GENERAL NEWS (safety net; always queues) --------------------------
  // Google News RSS catches what direct feeds miss (NY AG, AP/Reuters resurfaced).
  {
    key: "google-news-verdicts",
    url:
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(
        '"Trump" (verdict OR judgment OR "found liable" OR sentenced OR penalty OR fraud) when:2d',
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
    kind: "general",
    format: "rss",
  },
  {
    key: "google-news-org",
    url:
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(
        '"Trump Organization" (fraud OR bankruptcy OR fined OR "court ruling") when:3d',
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
    kind: "general",
    format: "rss",
  },
  {
    key: "google-news-nyag",
    url:
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent('"New York Attorney General" Trump when:7d') +
      "&hl=en-US&gl=US&ceid=US:en",
    kind: "general",
    format: "rss",
  },
  {
    key: "guardian-trump",
    url: "https://www.theguardian.com/us-news/donaldtrump/rss",
    kind: "general",
    format: "rss",
  },
];

// Headers that fix the DOJ 401 / SEC 403 false-failures (verified 2026-07-05).
// SEC policy: UA must include contact info.
export const FETCH_HEADERS: Record<string, string> = {
  "User-Agent": "djtloser-archive/1.0 (+contact: denis@theagentfactory.ai)",
  "Accept": "application/xml, application/atom+xml, text/html;q=0.9, */*;q=0.8",
};

// ---------------------------------------------------------------------------
// Filter signal. A candidate must hit an OUTCOME term to be queued at all.
// This is the cheap rules pass that drops opinion/noise before any spend.
// ---------------------------------------------------------------------------

// Must mention Trump (the archive's subject). Kept broad; general feeds are
// already Trump-scoped, but government feeds are not.
export const SUBJECT_TERMS = ["trump"];

// Documentable OUTCOME signals. No hit = not a documentable event = dropped.
export const OUTCOME_TERMS = [
  "verdict",
  "judgment",
  "found liable",
  "convicted",
  "conviction",
  "sentenced",
  "sentence",
  "guilty",
  "penalty",
  "fined",
  "fine",
  "settlement",
  "bankruptcy",
  "bankrupt",
  "disbarred",
  "sanction",
  "injunction",
  "ruled against",
  "ordered to pay",
  "damages",
  "default judgment",
  "dismissed", // court dismissals of Trump suits (failed-lawsuits)
];

// Maps outcome/context terms to a best-effort category guess. First hit wins.
// This is a GUESS stored for the reviewer; it is not authoritative.
export const CATEGORY_HINTS: Array<{ terms: string[]; category: string }> = [
  { terms: ["convicted", "conviction", "guilty", "sentenced", "criminal"], category: "criminal-cases" },
  { terms: ["bankruptcy", "bankrupt", "chapter 11"], category: "bankruptcies" },
  { terms: ["defamation", "defamed"], category: "defamation" },
  { terms: ["sec ", "ftc ", "regulator", "penalty", "fined", "sanction"], category: "regulatory-penalties" },
  { terms: ["found liable", "damages", "ordered to pay", "judgment", "verdict"], category: "civil-judgments" },
  { terms: ["dismissed", "tossed", "thrown out"], category: "failed-lawsuits" },
  { terms: ["election", "lost the", "defeated"], category: "election-losses" },
];

// A candidate is auto-publish ELIGIBLE (Phase 2) only if it comes from a primary
// source AND its guessed category is one of the unambiguous types. Phase 1 just
// records this flag; nothing acts on it yet.
export const AUTO_SAFE_CATEGORIES = new Set([
  "criminal-cases",
  "civil-judgments",
  "regulatory-penalties",
  "bankruptcies",
]);
