#!/usr/bin/env python3
"""Render the static site into docs/ (GitHub Pages).
Pages: index (live wire + latest panel), ledger (the documented record),
panel archive, about (methodology & editorial standards), support (get help /
take action). Stdlib only.

Monetization slots are rendered when configured via env:
  ADSENSE_CLIENT   e.g. ca-pub-XXXXXXXX  -> injects AdSense units + writes ads.txt
  DONATE_URL       e.g. Ko-fi / BuyMeACoffee link
  SUBSTACK_URL     e.g. https://yourpub.substack.com  -> embeds signup
"""
import html
import json
import os
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")
SITE_NAME = "The Accountability Wire"
TAGLINE = "The documented record on Donald Trump, his administration, and the family business. Every claim cited. Built for journalists to steal from."

ADSENSE = os.environ.get("ADSENSE_CLIENT", "").strip()
DONATE = os.environ.get("DONATE_URL", "").strip()
SUBSTACK = os.environ.get("SUBSTACK_URL", "").strip()

CSS = """
:root{--bg:#0f1115;--card:#181b22;--ink:#e8e6e1;--dim:#9a9790;--accent:#e3b341;--red:#e5534b;--link:#79b8ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 Georgia,'Times New Roman',serif}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
header{border-bottom:3px double var(--accent);padding:28px 20px;text-align:center}
header h1{margin:0;font-size:2.1em;letter-spacing:.02em}
header p{color:var(--dim);margin:.4em auto 0;max-width:720px}
nav{display:flex;gap:18px;justify-content:center;padding:10px;border-bottom:1px solid #2a2e37;font-family:Helvetica,Arial,sans-serif;font-size:.85em;text-transform:uppercase;letter-spacing:.08em}
main{max-width:860px;margin:0 auto;padding:24px 20px}
.card{background:var(--card);border:1px solid #2a2e37;border-radius:8px;padding:16px 20px;margin:14px 0}
.card h3{margin:.2em 0}.meta{color:var(--dim);font-size:.82em;font-family:Helvetica,Arial,sans-serif}
.badge{display:inline-block;background:#2a2e37;color:var(--accent);border-radius:4px;padding:1px 8px;font-size:.75em;font-family:Helvetica,Arial,sans-serif;margin-right:6px}
.verdict{border-left:4px solid var(--accent);padding:10px 16px;margin:10px 0;background:var(--card);font-style:italic}
.flag{border-left:4px solid var(--red)}
.adslot{margin:22px 0;text-align:center;color:var(--dim);font-size:.8em}
footer{border-top:1px solid #2a2e37;margin-top:40px;padding:24px 20px;color:var(--dim);font-size:.85em;text-align:center}
h2{border-bottom:1px solid #2a2e37;padding-bottom:6px}
.support-cta{background:#1d2430;border:1px solid var(--accent);border-radius:8px;padding:14px 20px;margin:20px 0}
"""


def esc(s):
    return html.escape(str(s or ""))


def ad_slot():
    if not ADSENSE:
        return ""
    return f"""<div class="adslot">
<ins class="adsbygoogle" style="display:block" data-ad-client="{esc(ADSENSE)}"
 data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div>"""


def head_extra():
    s = ""
    if ADSENSE:
        s += (f'<script async src="https://pagead2.googlesyndication.com/pagead/js/'
              f'adsbygoogle.js?client={esc(ADSENSE)}" crossorigin="anonymous"></script>')
    return s


def support_cta():
    parts = ['<div class="support-cta"><strong>Keep the record running.</strong> '
             'This site is independent, ad- and reader-supported. ']
    if SUBSTACK:
        parts.append(f'<a href="{esc(SUBSTACK)}">Subscribe to the LLM News letter</a>. ')
    if DONATE:
        parts.append(f'<a href="{esc(DONATE)}">Chip in to keep the servers on</a>. ')
    parts.append('Sharing a citation is free and helps most.</div>')
    return "".join(parts)


def page(title, body, active=""):
    navlinks = [("index.html", "The Wire"), ("panel.html", "24-Hour Panel"),
                ("ledger.html", "The Record"), ("support.html", "Get Help / Act"),
                ("about.html", "Methodology")]
    active_style = ' style="color:var(--accent)"'
    nav = "".join(f'<a href="{u}"{active_style if u == active else ""}>{t}</a>'
                  for u, t in navlinks)
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} — {SITE_NAME}</title>
<meta name="description" content="{esc(TAGLINE)}">{head_extra()}
<style>{CSS}</style></head><body>
<header><h1>{SITE_NAME}</h1><p>{esc(TAGLINE)}</p></header>
<nav>{nav}</nav><main>{body}</main>
<footer><p><strong>{SITE_NAME}</strong> aggregates and cites reporting from outlets across the
political spectrum and primary government sources. We publish nothing we cannot cite.
Corrections: open an issue on the repository and it will be addressed publicly.</p>
<p>Disclosure: this site may earn revenue from advertising, reader donations, and paid
newsletter subscriptions. Revenue sources never influence what the record shows.
Not affiliated with any campaign, party, or PAC.</p>
<p>Generated {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}</p></footer>
</body></html>"""


def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return default


def build_index(articles, panel):
    b = [support_cta()]
    if panel:
        c = panel.get("consensus", {})
        b.append(f"<h2>Today's 24-Hour Panel — {esc(panel['date'])}</h2>")
        b.append(f"<p class='meta'>{panel.get('article_count', 0)} sourced items from the last "
                 f"24 hours, independently analyzed by {len(panel.get('reviews', {}))} rival AI "
                 f"models. <a href='panel.html'>Full analysis →</a></p>")
        for m, v in c.get("verdicts_by_model", {}).items():
            if v:
                b.append(f"<div class='verdict'><span class='badge'>{esc(m)}</span>“{esc(v)}”</div>")
        b.append(ad_slot())
    b.append("<h2>The Wire — latest sourced coverage</h2>")
    if not articles:
        b.append("<p class='meta'>First aggregation run pending — the scheduled workflow "
                 "populates this automatically every 2 hours.</p>")
    for i, a in enumerate(articles[:40]):
        b.append(f"""<div class="card"><span class="badge">{esc(a['source'])}</span>
<span class="meta">{esc((a.get('published') or '')[:16].replace('T', ' '))}</span>
<h3><a href="{esc(a['url'])}" rel="noopener">{esc(a['title'])}</a></h3>
<p>{esc(a['summary'][:280])}</p></div>""")
        if i in (7, 19):
            b.append(ad_slot())
    return page("The Wire", "".join(b), "index.html")


def build_panel_page(panels):
    b = ["<h2>The 24-Hour Panel</h2>",
         "<p>Every day, the last 24 hours of coverage — Fox News through the Guardian, plus "
         "whitehouse.gov primary sources — goes to three or four <em>competing</em> AI models "
         "(Claude, ChatGPT, Gemini, Grok). Each writes an independent journalistic analysis. "
         "Where rivals agree, that's signal. Full JSON for every day is in the repo.</p>",
         support_cta()]
    if not panels:
        b.append("<p class='meta'>No panel digests yet — the daily workflow generates the "
                 "first one once LLM API keys are configured as repository secrets.</p>")
    for p in panels[:14]:
        c = p.get("consensus", {})
        b.append(f"<h2>{esc(p['date'])}</h2>")
        for m, v in c.get("verdicts_by_model", {}).items():
            b.append(f"<div class='verdict'><span class='badge'>{esc(m)}</span>“{esc(v)}”</div>")
        for s in c.get("stories_ranked_by_panel_agreement", [])[:5]:
            picked = ", ".join(s.get("picked_by", []))
            b.append(f"""<div class="card"><h3>{esc(s.get('headline'))}</h3>
<p>{esc(s.get('why_it_matters'))}</p>
<p class="meta">Independently flagged by: {esc(picked)}</p></div>""")
        flags = c.get("pooled_fact_flags", [])
        if flags:
            b.append("<h3>🚩 Fact flags</h3>")
            for fl in flags[:8]:
                b.append(f"""<div class="card flag"><p><strong>Claim:</strong> {esc(fl.get('claim'))}</p>
<p><strong>Assessment:</strong> {esc(fl.get('assessment'))}
<span class="meta">(flagged by {esc(fl.get('flagged_by'))})</span></p></div>""")
        b.append(ad_slot())
    return page("24-Hour Panel", "".join(b), "panel.html")


def build_ledger(ledger):
    b = ["<h2>The Documented Record</h2>",
         "<p>Court records, government filings, and on-the-record reporting only. "
         "This is the citable backbone of the site — every entry carries its sources. "
         "Journalists: take anything, verify against the linked primary sources.</p>",
         support_cta()]
    for e in ledger.get("entries", []):
        srcs = " · ".join(f"<a href='{esc(s['url'])}' rel='noopener'>{esc(s['outlet'])}</a>"
                          for s in e.get("sources", []))
        b.append(f"""<div class="card"><span class="badge">{esc(e['category'])}</span>
<span class="meta">{esc(e['date'])}</span>
<p>{esc(e['fact'])}</p><p class="meta">Sources: {srcs}</p></div>""")
    b.append(ad_slot())
    return page("The Documented Record", "".join(b), "ledger.html")


def build_about():
    b = ["""<h2>Methodology & Editorial Standards</h2>
<div class="card"><h3>What this is</h3>
<p>An automated, open-source accountability record. Software aggregates coverage of Donald
Trump, his administration, and his family's business dealings from outlets across the
political spectrum — deliberately including Fox News and whitehouse.gov itself — and a
panel of competing AI models produces a daily comparative analysis. Everything is
reproducible from the public repository.</p></div>
<div class="card"><h3>Sourcing rules</h3>
<ul><li>Nothing is published without a source link. The Documented Record cites court
records, government filings, or on-the-record reporting by major outlets.</li>
<li>Sources are labeled with their general orientation so readers can weigh framing.</li>
<li>Primary sources (whitehouse.gov, SEC, court dockets) are preferred wherever they exist.</li>
<li>Opinion is labeled as analysis; facts are labeled with citations. The site's point of
view is disclosed openly: this is accountability journalism about documented conduct.</li></ul></div>
<div class="card"><h3>The AI panel</h3>
<p>Each panelist model (Claude, ChatGPT, Gemini, and optionally Grok — built by four rival
companies) receives the identical set of sourced headlines and the identical instructions:
analyze journalistically, attribute every claim, flag falsehoods, note where outlets
diverge. Their outputs are published side by side, unedited, with per-model attribution.
Agreement across rival models is highlighted; disagreement is shown, not hidden.</p></div>
<div class="card"><h3>Corrections</h3>
<p>Errors are corrected publicly. Open an issue on the GitHub repository; the correction
history is the git history — permanent and auditable.</p></div>
<div class="card"><h3>Funding & independence</h3>
<p>Revenue comes from display advertising, reader donations, and newsletter subscriptions
— all disclosed in the footer of every page. No campaign, PAC, or party money. Ads are
served programmatically and advertisers have no influence on content.</p></div>"""]
    return page("Methodology", "".join(b), "about.html")


def build_support():
    b = ["""<h2>Get Help / Take Action</h2>
<p>Documentation matters most to the people living the consequences. If you or someone
you know is affected — or you want to do something concrete — start here. These are
established, independent organizations; we receive nothing for listing them.</p>
<div class="card"><h3>If you need legal help</h3><ul>
<li><a href="https://www.aclu.org/know-your-rights" rel="noopener">ACLU — Know Your Rights guides</a> (free, multiple languages)</li>
<li><a href="https://www.lawhelp.org" rel="noopener">LawHelp.org</a> — free legal aid lookup by state</li>
<li><a href="https://www.immigrationadvocates.org/nonprofit/legaldirectory/" rel="noopener">National Immigration Legal Services Directory</a></li>
</ul></div>
<div class="card"><h3>If federal cuts hit your benefits or services</h3><ul>
<li><a href="https://www.findhelp.org" rel="noopener">FindHelp.org</a> — food, housing, health programs by ZIP code</li>
<li><a href="https://www.feedingamerica.org/find-your-local-foodbank" rel="noopener">Feeding America food bank locator</a></li>
<li><a href="https://www.211.org" rel="noopener">211.org</a> — call 211 for local emergency assistance</li>
</ul></div>
<div class="card"><h3>If you're a journalist or source</h3><ul>
<li><a href="https://freedom.press" rel="noopener">Freedom of the Press Foundation</a> — digital security for reporters</li>
<li><a href="https://cpj.org" rel="noopener">Committee to Protect Journalists</a></li>
<li><a href="https://rcfp.org" rel="noopener">Reporters Committee for Freedom of the Press</a> — free legal hotline</li>
</ul></div>
<div class="card"><h3>If you want to act</h3><ul>
<li><a href="https://www.vote.org" rel="noopener">Vote.org</a> — register, check registration, find your ballot</li>
<li><a href="https://www.usa.gov/elected-officials" rel="noopener">Find and contact your elected officials</a></li>
<li>Support local news and the outlets doing the original reporting cited across this site.</li>
</ul></div>"""]
    b.append(support_cta())
    return page("Get Help / Take Action", "".join(b), "support.html")


def main():
    os.makedirs(DOCS, exist_ok=True)
    articles = load_json(os.path.join(ROOT, "data", "articles.json"),
                         {"articles": []})["articles"]
    ledger = load_json(os.path.join(ROOT, "data", "facts_ledger.json"), {"entries": []})

    panels = []
    pdir = os.path.join(ROOT, "data", "panel")
    if os.path.isdir(pdir):
        for fn in sorted(os.listdir(pdir), reverse=True):
            if fn.endswith(".json"):
                panels.append(load_json(os.path.join(pdir, fn), {}))
    latest = panels[0] if panels else None

    pages = {
        "index.html": build_index(articles, latest),
        "panel.html": build_panel_page(panels),
        "ledger.html": build_ledger(ledger),
        "about.html": build_about(),
        "support.html": build_support(),
    }
    for name, content in pages.items():
        with open(os.path.join(DOCS, name), "w") as f:
            f.write(content)
    with open(os.path.join(DOCS, ".nojekyll"), "w") as f:
        f.write("")
    if ADSENSE:
        with open(os.path.join(DOCS, "ads.txt"), "w") as f:
            f.write(f"google.com, {ADSENSE.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n")
    print(f"site: built {len(pages)} pages into docs/ "
          f"({len(articles)} articles, {len(panels)} panel days)")


if __name__ == "__main__":
    main()
