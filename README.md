# donaldjtrumpisaloser.com

A documented historical record. Citation-anchored archive of Donald J. Trump's documented losses across business, law, elections, and policy.

The voice is closer to Wikipedia, ProPublica, and the Library of Congress than to any partisan publication. Every entry links to a primary source. Every claim has a last-verified date and a public corrections log.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (theme inline in `app/globals.css`)
- `next-themes` for light / dark / high-contrast
- Static export (`output: 'export'`) — deploys to Cloudflare Pages, Vercel, or Netlify
- Content as typed TypeScript at `site/src/content/entries.ts`

## Run locally

```bash
cd site
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
cd site
npm run build
```

Output is written to `site/out/`. Upload `out/` to any static host.

## Deploy: Railway (primary)

This repo deploys to Railway from GitHub. `railway.json` and `nixpacks.toml`
at the repo root tell Railway how to install, build, and start the Next.js
app inside `site/`.

1. In Railway, click **New Project → Deploy from GitHub repo** and pick
   `The-Agent-Factory/donaldjtrumpisaloser`.
2. Railway auto-detects Next.js. No build settings need to be entered;
   the configs in `railway.json` and `nixpacks.toml` cover it.
3. After the first deploy, click **Settings → Networking → Generate Domain**
   to get a public URL.
4. Set env vars from `site/.env.example` under **Variables**. All are
   optional — components render nothing when their var is unset.

Subsequent `git push` to `main` redeploys automatically.

## Deploy: Cloudflare Pages (alternate, static)

To deploy as a static site instead, set `output: "export"` in
`site/next.config.ts`, then:

1. Connect this repo in Cloudflare Pages.
2. Build command: `cd site && npm install && npm run build`
3. Build output directory: `site/out`
4. Set env vars from `site/.env.example` as needed.

## Environment variables

All optional; components render nothing when their var is unset.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in sitemap and metadata. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense client ID. |
| `NEXT_PUBLIC_SUBSTACK_URL` | Substack newsletter URL for embed. |
| `NEXT_PUBLIC_DONORBOX_ID` | Donorbox campaign ID for site-operated drives. |
| `NEXT_PUBLIC_BOOKSHOP_ID` | Bookshop.org affiliate ID. |
| `NEXT_PUBLIC_GELATO_STORE_URL` | Print-on-demand storefront URL. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Submission form POST endpoint (e.g. Formspree). |

## Content model

Entries live in `site/src/content/entries.ts` as typed records:

```ts
{
  id: "B3",
  slug: "ny-civil-fraud-judgment-2024",
  title: "New York civil fraud judgment",
  date: "2024-02-16",
  category: "civil-judgments",
  status: "vacated",
  summary: "...",
  outcome: "...",
  narrative: "...",     // optional 200-400 word long-form
  sources: [...],
  lastUpdated: "2026-04-29"
}
```

Categories are defined in `site/src/content/categories.ts`.
Promise cards are in `site/src/content/promises.ts`.

## Editorial standards

- Two independent sources for every factual claim.
- Three labelled content layers: verified fact, attributed opinion, editorial framing.
- Precise verbs: "found liable," "ruled," "settled," "dismissed with prejudice," "affirmed on appeal."
- Two-editor sign-off before publication.
- Public corrections register at `/corrections`.

## Disclaimer

This site is an independent, citation-based historical reference. It is not affiliated with, endorsed by, sponsored by, or connected to Donald J. Trump, the Trump Organization, the Office of the President, or any Trump family member, business, campaign, or charitable entity. The site name is editorial commentary protected by free expression principles in Canada and the United States. All factual claims are sourced to publicly available primary documents, court records, regulatory filings, and reporting by established news organizations.

## License

MIT for the code (`LICENSE`). Content is licensed for non-commercial reuse with attribution.
