#!/usr/bin/env python3
"""Generate platform-ready distribution from the latest panel digest:
  - X/Twitter thread (auto-posts if X API credentials are set)
  - TikTok/Reels/Shorts video script (60-second, hook-first)
  - Substack-ready newsletter markdown ("LLM News" edition)

Drafts are always written to data/posts/YYYY-MM-DD/ so nothing is lost when
posting APIs are not configured. Stdlib only (X posting uses OAuth 1.0a
implemented by hand — no tweepy dependency).

Env for auto-posting to X (all four required):
  X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
"""
import base64
import hashlib
import hmac
import json
import os
import secrets
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PANEL_DIR = os.path.join(ROOT, "data", "panel")
POSTS_DIR = os.path.join(ROOT, "data", "posts")
SITE_URL = os.environ.get("SITE_URL", "https://donaldjtrumpisaloser.com/")


def latest_panel():
    if not os.path.isdir(PANEL_DIR):
        return None
    files = sorted(f for f in os.listdir(PANEL_DIR) if f.endswith(".json"))
    if not files:
        return None
    with open(os.path.join(PANEL_DIR, files[-1])) as f:
        return json.load(f)


def build_thread(panel):
    """X thread: hook, per-model verdicts, top consensus story, link."""
    c = panel["consensus"]
    date = panel["date"]
    tweets = [f"🧾 The 24-Hour Panel — {date}\n\nWe fed the last 24h of Trump/administration "
              f"coverage (Fox News ↔ Guardian, plus whitehouse.gov itself) to "
              f"{len(panel['reviews'])} rival AI models and asked for a straight "
              f"journalistic read.\n\nHere's what they agreed on. 🧵"]
    for model, verdict in c.get("verdicts_by_model", {}).items():
        if verdict:
            tweets.append(f"{model.upper()}'s one-line verdict:\n\n“{verdict}”"[:275])
    for s in c.get("stories_ranked_by_panel_agreement", [])[:2]:
        picked = ", ".join(s.get("picked_by", []))
        tweets.append(f"📌 {s.get('headline','')}\n\nWhy it matters: "
                      f"{s.get('why_it_matters','')}\n\n(Flagged by: {picked})"[:275])
    flags = c.get("pooled_fact_flags", [])
    if flags:
        f0 = flags[0]
        tweets.append(f"🚩 Fact flag: “{f0.get('claim','')}”\n\n"
                      f"Assessment: {f0.get('assessment','')}"[:275])
    tweets.append(f"Full multi-model analysis, sources, and the documented record:\n{SITE_URL}\n\n"
                  f"Every claim is cited. Grab it, quote it, check it.")
    return tweets


def build_tiktok_script(panel):
    c = panel["consensus"]
    verdicts = c.get("verdicts_by_model", {})
    top = c.get("stories_ranked_by_panel_agreement", [])
    lines = [
        f"# 60-Second Script — The 24-Hour Panel, {panel['date']}",
        "",
        "HOOK (0-3s, text on screen: 'We made 3 rival AIs read ALL the Trump news'):",
        "\"We fed 24 hours of Trump coverage — Fox News AND the Guardian AND the "
        "White House's own website — to three competing AIs. Here's what they all agreed on.\"",
        "",
        "BODY (3-45s):",
    ]
    for i, s in enumerate(top[:3], 1):
        lines.append(f"{i}. \"{s.get('headline','')}\" — {s.get('why_it_matters','')}")
    lines += ["", "VERDICTS (45-55s, show each model's logo as you read):"]
    for m, v in verdicts.items():
        lines.append(f"- {m.upper()}: \"{v}\"")
    lines += ["", "CTA (55-60s):",
              f"\"Every source is linked at the site — link in bio. This is all "
              f"public record. Follow for tomorrow's panel.\"", "",
              f"Link for bio: {SITE_URL}"]
    return "\n".join(lines)


def build_substack(panel):
    c = panel["consensus"]
    date = panel["date"]
    md = [f"# LLM News — {date}",
          "",
          "*Three rival AI models. One day of coverage from across the spectrum. "
          "Zero unsourced claims.*",
          "",
          f"Every day we feed the last 24 hours of reporting on the Trump "
          f"administration — from Fox News to the Guardian, plus whitehouse.gov "
          f"primary sources — to {len(panel['reviews'])} competing AI models "
          f"({', '.join(panel['reviews'].keys())}) and ask each for an independent "
          f"journalistic analysis. Where rivals built by rival companies agree, "
          f"that's signal.",
          "",
          "## The Panel's Verdicts",
          ""]
    for m, v in c.get("verdicts_by_model", {}).items():
        md.append(f"> **{m.capitalize()}:** “{v}”\n")
    md += ["## Stories the Panel Agreed Mattered", ""]
    for s in c.get("stories_ranked_by_panel_agreement", [])[:5]:
        md.append(f"### {s.get('headline','')}")
        md.append(f"{s.get('why_it_matters','')}")
        srcs = s.get("sources") or []
        if srcs:
            md.append(f"*Sources: {', '.join(str(x) for x in srcs)}*")
        md.append(f"*Picked by: {', '.join(s.get('picked_by', []))}*\n")
    flags = c.get("pooled_fact_flags", [])
    if flags:
        md += ["## Fact Flags", ""]
        for fl in flags[:6]:
            md.append(f"- **Claim:** {fl.get('claim','')}\n  **Assessment:** "
                      f"{fl.get('assessment','')} *(flagged by {fl.get('flagged_by','')})*")
    md += ["", "---",
           f"Full archive, methodology, and the documented record: {SITE_URL}",
           "",
           "*This newsletter is reader-supported. If this record is useful to you, "
           "share it or become a paid subscriber.*"]
    return "\n".join(md)


# ---------------- X (Twitter) auto-posting: OAuth 1.0a, stdlib only ----------

def oauth1_header(method, url, creds, params=None):
    ck, cs, at, ats = creds
    oauth = {
        "oauth_consumer_key": ck,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": at,
        "oauth_version": "1.0",
    }
    allp = {**oauth, **(params or {})}
    enc = lambda s: urllib.parse.quote(str(s), safe="")
    base_items = "&".join(f"{enc(k)}={enc(v)}" for k, v in sorted(allp.items()))
    base = f"{method.upper()}&{enc(url)}&{enc(base_items)}"
    key = f"{enc(cs)}&{enc(ats)}"
    sig = base64.b64encode(hmac.new(key.encode(), base.encode(), hashlib.sha1).digest()).decode()
    oauth["oauth_signature"] = sig
    return "OAuth " + ", ".join(f'{enc(k)}="{enc(v)}"' for k, v in sorted(oauth.items()))


def post_thread_to_x(tweets):
    creds = tuple(os.environ.get(k, "") for k in
                  ("X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET"))
    if not all(creds):
        print("  X: credentials not set, thread saved as draft only")
        return False
    url = "https://api.twitter.com/2/tweets"
    reply_to = None
    for t in tweets:
        body = {"text": t}
        if reply_to:
            body["reply"] = {"in_reply_to_tweet_id": reply_to}
        req = urllib.request.Request(
            url, data=json.dumps(body).encode(),
            headers={"Content-Type": "application/json",
                     "Authorization": oauth1_header("POST", url, creds)})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                reply_to = json.loads(r.read())["data"]["id"]
        except Exception as e:
            print(f"  X post FAILED: {e}", file=sys.stderr)
            return False
        time.sleep(2)
    print(f"  X: thread of {len(tweets)} posted")
    return True


def main():
    panel = latest_panel()
    if not panel:
        print("posts: no panel digest yet; run llm_panel.py first (needs LLM API keys)")
        return
    outdir = os.path.join(POSTS_DIR, panel["date"])
    os.makedirs(outdir, exist_ok=True)

    thread = build_thread(panel)
    with open(os.path.join(outdir, "x_thread.json"), "w") as f:
        json.dump(thread, f, indent=1)
    with open(os.path.join(outdir, "tiktok_script.md"), "w") as f:
        f.write(build_tiktok_script(panel))
    with open(os.path.join(outdir, "substack_llm_news.md"), "w") as f:
        f.write(build_substack(panel))
    anchor = panel.get("anchor_script") or {}
    if anchor.get("script"):
        with open(os.path.join(outdir, "anchor_script.md"), "w") as f:
            f.write(f"# THE CRIB REPORT — {panel['date']}\n\n"
                    f"*Baby-anchor broadcast script. All facts verbatim from "
                    f"sourced coverage; comedy is delivery-only. "
                    f"Written by {anchor.get('writer', '?')} "
                    f"({anchor.get('model', '?')}).*\n\n---\n\n"
                    + anchor["script"])
    print(f"posts: drafts written to data/posts/{panel['date']}/")

    if os.environ.get("AUTOPOST_X", "").lower() in ("1", "true", "yes"):
        post_thread_to_x(thread)
    else:
        print("  X auto-post disabled (set AUTOPOST_X=true + credentials to enable)")


if __name__ == "__main__":
    main()
