# The Accountability Wire

An automated, open-source accountability journalism machine. It aggregates coverage of
Donald Trump, his administration, and the family business from **across the spectrum**
(deliberately including Fox News and whitehouse.gov primary sources), runs a daily
**24-Hour Panel** where three or four *rival* AI models independently analyze the day
journalistically, publishes everything to a citable static site, and generates
distribution content for X, TikTok, and Substack — with legal, disclosed monetization.

**The standard:** nothing is published without a source. Court records, government
filings, and on-the-record reporting only. The site is built for journalists to pull
from with confidence.

## How it works

```
config/feeds.json ──► scripts/aggregate.py ──► data/articles.json     (every 2h)
                                │
                                ▼
                      scripts/llm_panel.py ──► data/panel/DATE.json   (daily 11:00 UTC)
                      Claude + ChatGPT + Gemini (+ Grok) each analyze
                      the last 24h independently; consensus is computed
                                │
                                ▼
                      scripts/social_posts.py ─► data/posts/DATE/     (daily)
                      X thread (auto-posts if keys set) · TikTok script
                      · Substack "LLM News" edition (ready to paste)
                                │
                                ▼
                      scripts/build_site.py ──► docs/                 (GitHub Pages)
```

Everything is Python 3 **stdlib only** — no pip installs, nothing to break.
`.github/workflows/update.yml` runs the whole pipeline on a schedule and commits results.

## Setup (one-time, ~10 minutes)

**On GitLab** (primary home): `.gitlab-ci.yml` drives everything. Create two pipeline
schedules (CI/CD → Schedules): `0 */2 * * *` with variable `PIPELINE_MODE=wire`, and
`0 11 * * *` with `PIPELINE_MODE=panel`. Add the secrets below as CI/CD Variables
(Settings → CI/CD → Variables), plus `GITLAB_PUSH_TOKEN` (Project Access Token,
Developer role, `write_repository` scope) so runs commit data back. The site deploys
to GitLab Pages automatically from the `pages` job.

**On GitHub** (mirror, optional): `.github/workflows/update.yml` does the same job.

1. **Enable GitHub Pages** (GitHub only): repo Settings → Pages → Deploy from branch → `master` + `/docs`.
2. **Repo secrets** (Settings → Secrets and variables → Actions → Secrets) — each one is
   optional; the pipeline degrades gracefully:
   | Secret | Enables |
   |---|---|
   | `ANTHROPIC_API_KEY` | Claude panelist |
   | `OPENAI_API_KEY` | ChatGPT panelist |
   | `GEMINI_API_KEY` | Gemini panelist (free tier: aistudio.google.com) |
   | `XAI_API_KEY` | Grok panelist (optional 4th seat) |
   | `NEWSAPI_KEY` | NewsAPI firehose (free tier: newsapi.org) |
   | *(local runs only)* `LOCAL_LLM_URL` + `LOCAL_LLM_MODEL` | Free 5th seat via local Qwen/Ollama (`http://localhost:11434/v1/chat/completions`) — works when you run `python3 scripts/llm_panel.py` on your own machine |
   | `X_API_KEY` / `X_API_SECRET` / `X_ACCESS_TOKEN` / `X_ACCESS_SECRET` | Auto-posting threads to X |
3. **Repo variables** (same page → Variables):
   | Variable | Purpose |
   |---|---|
   | `SITE_URL` | Public site URL used in posts |
   | `AUTOPOST_X` | `true` to actually post to X (drafts are always saved regardless) |
   | `ADSENSE_CLIENT` | `ca-pub-…` → injects ad units + generates `ads.txt` |
   | `DONATE_URL` | Ko-fi / Buy Me a Coffee link |
   | `SUBSTACK_URL` | Your Substack — linked in every support CTA |
4. Run the workflow once manually (Actions → "Update wire, panel, site & posts" → Run).

## Monetization (all legal, all disclosed)

- **Display ads**: set `ADSENSE_CLIENT`; `ads.txt` is generated automatically. Note:
  AdSense reviews political content but factual news/commentary is allowed; keep the
  sourcing standard and approval odds are good.
- **Substack "LLM News"**: `scripts/social_posts.py` emits a ready-to-paste daily edition
  (`data/posts/DATE/substack_llm_news.md`). Substack has no posting API — paste it or
  use Substack's RSS import. Turn on paid subscriptions there; the unique
  three-rival-AIs-review-the-news format is the paid hook.
- **Donations**: set `DONATE_URL` (Ko-fi/BMAC — no platform approval needed, live today).
- **Disclosure**: every page footer discloses revenue sources and independence; the
  methodology page documents editorial standards. This is what keeps it credible *and*
  compliant (FTC disclosure norms).
- Explicitly out of scope: campaign/PAC money, undisclosed sponsorship, scraping paywalled
  text. Headlines + summaries + links = classic aggregation fair use; full-text
  republication is not done.

## Editorial standards

See the live **Methodology** page. Short version: label bias, cite everything, prefer
primary sources, publish rival AI analyses unedited and side-by-side, correct errors
publicly (the git history is the correction log). The point of view — accountability
journalism about documented conduct — is disclosed, not hidden.

## Repo map

- `config/feeds.json` — sources (Fox News, whitehouse.gov, NPR, Guardian, Politico, The
  Hill, PBS, ProPublica, ABC, CNN) + tracked keywords + NewsAPI config
- `data/facts_ledger.json` — **The Documented Record**: hand-curated, court-record-backed
  entries (convictions, judgments, settlements, bankruptcies, conflicts of interest).
  Add entries here; sources are mandatory.
- `data/articles.json` — rolling 14-day article store (bot-maintained)
- `data/panel/` — daily multi-LLM digests (bot-maintained)
- `data/posts/` — daily distribution drafts (bot-maintained)
- `docs/` — the published site (bot-built; enable Pages on it)
