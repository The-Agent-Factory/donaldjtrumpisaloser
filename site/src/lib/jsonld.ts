import { SITE } from "./site";
import type { Entry } from "@/content/entries";

export function siteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      foundingDate: `${SITE.established}`,
      foundingLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: "Ottawa", addressRegion: "ON", addressCountry: "CA" },
      },
      description: SITE.description,
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE.url}/cases/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function entryJsonLd(entry: Entry) {
  const url = `${SITE.url}/cases/${entry.slug}/`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: entry.title,
      datePublished: entry.date,
      dateModified: entry.lastUpdated,
      mainEntityOfPage: url,
      url,
      author: { "@type": "Organization", name: SITE.name },
      publisher: { "@type": "Organization", name: SITE.name },
      description: entry.summary,
      articleSection: entry.category,
      keywords: entry.tags.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      datePublished: entry.lastUpdated,
      url,
      claimReviewed: entry.title,
      itemReviewed: {
        "@type": "Claim",
        appearance: entry.sources.map((s) => ({
          "@type": "CreativeWork",
          name: s.label,
          ...(s.url ? { url: s.url } : {}),
        })),
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
        alternateName: "Documented",
      },
      author: { "@type": "Organization", name: SITE.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Cases", item: `${SITE.url}/cases/` },
        { "@type": "ListItem", position: 2, name: entry.title, item: url },
      ],
    },
  ];
}

export function jsonLdScript(data: object | object[]) {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d, i) => ({
    key: i,
    __html: JSON.stringify(d),
  }));
}
