#!/usr/bin/env python3
"""The 24-Hour Panel: the last 24 hours of aggregated coverage, independently
analyzed by three (optionally four) frontier LLMs from a journalistic
perspective, then merged into a daily digest.

Panelists (each enabled by its API key being present):
  ANTHROPIC_API_KEY  -> Claude   (default model: claude-sonnet-5)
  OPENAI_API_KEY     -> ChatGPT  (default model: gpt-4o)
  GEMINI_API_KEY     -> Gemini   (default model: gemini-2.0-flash)
  XAI_API_KEY        -> Grok     (default model: grok-3, optional 4th seat)

Model overrides: ANTHROPIC_MODEL / OPENAI_MODEL / GEMINI_MODEL / XAI_MODEL.
Output: data/panel/YYYY-MM-DD.json. Stdlib only.
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORE = os.path.join(ROOT, "data", "articles.json")
OUTDIR = os.path.join(ROOT, "data", "panel")

PROMPT = """You are one member of an independent, multi-model editorial review panel.
Below are news headlines and summaries from the last 24 hours covering Donald Trump,
his administration, and his family's business dealings. Sources span the political
spectrum (Fox News through the Guardian) plus primary sources (whitehouse.gov).

Write a rigorous journalistic analysis. Rules:
- Stick strictly to what the sourced items support. No invented facts, no speculation
  presented as fact. Attribute claims to their outlets.
- Note where right-leaning and left-leaning outlets diverge on the same events.
- Flag verifiable falsehoods or unsupported claims made by officials, with what the
  record actually shows.
- Cover accountability angles: conflicts of interest, self-dealing, use of office for
  private gain, and impacts on ordinary people — when and only when the day's sourced
  reporting supports them.
- Tone: hard-nosed, factual, quotable. The standard is: a professional journalist
  could cite this analysis with confidence.

Respond in JSON with keys:
  "top_stories": [ {"headline": str, "why_it_matters": str, "sources": [str]} ] (max 5),
  "divergence": str (how outlets across the spectrum framed the day differently),
  "fact_flags": [ {"claim": str, "assessment": str} ],
  "accountability_watch": str,
  "one_line_verdict": str (a single sharp, factual sentence summarizing the day).

HEADLINES (last 24h):
{items}
"""


def post_json(url, headers, body, timeout=120):
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", **headers})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def extract_json(text):
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    start, end = text.find("{"), text.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            pass
    return {"raw": text}


def ask_claude(prompt):
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5")
    resp = post_json("https://api.anthropic.com/v1/messages",
                     {"x-api-key": key, "anthropic-version": "2023-06-01"},
                     {"model": model, "max_tokens": 4000,
                      "messages": [{"role": "user", "content": prompt}]})
    return {"model": model, "analysis": extract_json(resp["content"][0]["text"])}


def ask_openai(prompt):
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    resp = post_json("https://api.openai.com/v1/chat/completions",
                     {"Authorization": f"Bearer {key}"},
                     {"model": model, "max_tokens": 4000,
                      "messages": [{"role": "user", "content": prompt}]})
    return {"model": model, "analysis": extract_json(resp["choices"][0]["message"]["content"])}


def ask_gemini(prompt):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return None
    model = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{model}:generateContent?key={key}")
    resp = post_json(url, {}, {"contents": [{"parts": [{"text": prompt}]}]})
    text = resp["candidates"][0]["content"]["parts"][0]["text"]
    return {"model": model, "analysis": extract_json(text)}


def ask_grok(prompt):
    key = os.environ.get("XAI_API_KEY")
    if not key:
        return None
    model = os.environ.get("XAI_MODEL", "grok-3")
    resp = post_json("https://api.x.ai/v1/chat/completions",
                     {"Authorization": f"Bearer {key}"},
                     {"model": model, "max_tokens": 4000,
                      "messages": [{"role": "user", "content": prompt}]})
    return {"model": model, "analysis": extract_json(resp["choices"][0]["message"]["content"])}


def ask_local(prompt):
    """Free local seat: any OpenAI-compatible server (Ollama, LM Studio).
    e.g. LOCAL_LLM_URL=http://localhost:11434/v1/chat/completions
         LOCAL_LLM_MODEL=qwen2.5  (whatever `ollama list` shows)"""
    url = os.environ.get("LOCAL_LLM_URL")
    if not url:
        return None
    model = os.environ.get("LOCAL_LLM_MODEL", "qwen2.5")
    resp = post_json(url, {}, {"model": model, "max_tokens": 4000,
                               "messages": [{"role": "user", "content": prompt}]},
                     timeout=300)
    return {"model": model, "analysis": extract_json(resp["choices"][0]["message"]["content"])}


PANELISTS = [("claude", ask_claude), ("chatgpt", ask_openai),
             ("gemini", ask_gemini), ("grok", ask_grok), ("qwen-local", ask_local)]


def consensus(reviews):
    """Merge panelist output without another LLM call: verdicts side by side,
    fact flags pooled, top stories ranked by how many panelists picked them."""
    verdicts = {name: r["analysis"].get("one_line_verdict", "")
                for name, r in reviews.items() if isinstance(r.get("analysis"), dict)}
    flags = []
    story_votes = {}
    for name, r in reviews.items():
        a = r.get("analysis")
        if not isinstance(a, dict):
            continue
        for f in a.get("fact_flags", []) or []:
            if isinstance(f, dict):
                flags.append({**f, "flagged_by": name})
        for s in a.get("top_stories", []) or []:
            if isinstance(s, dict) and s.get("headline"):
                k = s["headline"].lower()[:60]
                story_votes.setdefault(k, {"story": s, "votes": []})["votes"].append(name)
    ranked = sorted(story_votes.values(), key=lambda v: -len(v["votes"]))
    return {
        "verdicts_by_model": verdicts,
        "pooled_fact_flags": flags,
        "stories_ranked_by_panel_agreement": [
            {**v["story"], "picked_by": v["votes"]} for v in ranked[:8]
        ],
    }


def main():
    with open(STORE) as f:
        data = json.load(f)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    recent = [a for a in data["articles"]
              if (a.get("published") or a.get("first_seen", "")) >= cutoff.isoformat()]
    if not recent:
        print("panel: no articles in the last 24h; skipping")
        return

    items = "\n".join(
        f"- [{a['source']}] {a['title']} — {a['summary'][:200]} ({a['url']})"
        for a in recent[:80])
    prompt = PROMPT.replace("{items}", items)

    reviews = {}
    for name, fn in PANELISTS:
        try:
            r = fn(prompt)
            if r:
                reviews[name] = r
                print(f"  panelist {name} ({r['model']}): ok")
            else:
                print(f"  panelist {name}: no API key, skipped")
        except Exception as e:
            print(f"  panelist {name} FAILED: {e}", file=sys.stderr)

    if not reviews:
        print("panel: no panelists available (set ANTHROPIC_API_KEY / OPENAI_API_KEY / "
              "GEMINI_API_KEY / XAI_API_KEY as repo secrets)")
        return

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    os.makedirs(OUTDIR, exist_ok=True)
    with open(os.path.join(OUTDIR, f"{today}.json"), "w") as f:
        json.dump({"date": today,
                   "generated": datetime.now(timezone.utc).isoformat(),
                   "article_count": len(recent),
                   "reviews": reviews,
                   "consensus": consensus(reviews)}, f, indent=1)
    print(f"panel: wrote data/panel/{today}.json with {len(reviews)} panelist(s)")


if __name__ == "__main__":
    main()
