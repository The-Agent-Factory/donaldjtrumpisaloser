export const SITE = {
  name: "donaldjtrumpisaloser.com",
  tagline: "A documented historical record.",
  secondary: "Citations, not commentary.",
  description:
    "Citation-anchored archive of Donald J. Trump's documented losses across business, law, elections, and policy. Every entry links to a primary source.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://donaldjtrumpisaloser.com",
  publisher: "Independent project, published from Ottawa, Canada.",
  established: 2026,
};

export const NAV = [
  { href: "/cases/", label: "Cases" },
  { href: "/timeline/", label: "Timeline" },
  { href: "/topics/", label: "Topics" },
  { href: "/data/", label: "Data" },
  { href: "/about/", label: "About" },
  { href: "/submit/", label: "Submit" },
];

export const FOOTER_LINKS = {
  editorial: [
    { href: "/standards/", label: "Editorial standards" },
    { href: "/methodology/", label: "Methodology" },
    { href: "/corrections/", label: "Corrections" },
    { href: "/about/", label: "About" },
  ],
  connect: [
    { href: "/newsletter/", label: "Newsletter" },
    { href: "/submit/", label: "Submit a tip" },
    { href: "/support/", label: "Support civic groups" },
    { href: "/shop/", label: "Merchandise" },
    { href: "/reading-list/", label: "Reading list" },
  ],
};
