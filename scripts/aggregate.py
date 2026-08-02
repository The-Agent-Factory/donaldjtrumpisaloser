#!/usr/bin/env python3
"""Fetch RSS/Atom feeds (Fox News, whitehouse.gov, wires) + NewsAPI, normalize,
dedupe, and store in data/articles.json. Stdlib only — no dependencies.

Run: python3 scripts/aggregate.py
Env: NEWSAPI_KEY (optional) enables NewsAPI pull.
"""
import json
import os
import re
import sys
import hashlib
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "config", "feeds.json")
STORE = os.path.join(ROOT, "data", "articles.json")
UA = "Mozilla/5.0 (compatible; AccountabilityWire/1.0; +https://github.com/the-agent-factory/donaldjtrumpisaloser)"
MAX_AGE_DAYS = 14
ATOM = "{http://www.w3.org/2005/Atom}"


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def text_of(el):
    if el is None:
        return ""
    return re.sub(r"<[^>]+>", "", "".join(el.itertext())).strip()


def parse_date(s):
    if not s:
        return None
    for fn in (parsedate_to_datetime,):
        try:
            dt = fn(s)
            return dt.astimezone(timezone.utc) if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except Exception:
            pass
    for fmt in ("%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            dt = datetime.strptime(s.strip()[:len(fmt) + 6], fmt)
            return dt.astimezone(timezone.utc) if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except Exception:
            pass
    return None


def parse_feed(raw, source):
    """Parse RSS 2.0 or Atom into normalized article dicts."""
    out = []
    try:
        root = ET.fromstring(raw)
    except ET.ParseError as e:
        print(f"  parse error for {source['id']}: {e}", file=sys.stderr)
        return out

    items = root.findall(".//item") or root.findall(f".//{ATOM}entry")
    for it in items:
        title = text_of(it.find("title")) or text_of(it.find(f"{ATOM}title"))
        link_el = it.find("link")
        link = (link_el.text or "").strip() if link_el is not None and link_el.text else ""
        if not link:
            for l in it.findall(f"{ATOM}link"):
                if l.get("rel") in (None, "alternate"):
                    link = l.get("href", "")
                    break
        desc = text_of(it.find("description")) or text_of(it.find(f"{ATOM}summary"))
        pub = (text_of(it.find("pubDate")) or text_of(it.find(f"{ATOM}published"))
               or text_of(it.find(f"{ATOM}updated")))
        dt = parse_date(pub)
        if not title or not link:
            continue
        out.append({
            "id": hashlib.sha1(link.encode()).hexdigest()[:16],
            "title": title,
            "url": link,
            "summary": desc[:600],
            "published": dt.isoformat() if dt else None,
            "source": source["name"],
            "source_id": source["id"],
            "bias_note": source.get("bias_note", ""),
        })
    return out


def fetch_newsapi(cfg):
    key = os.environ.get("NEWSAPI_KEY", "").strip()
    if not key:
        return []
    api = cfg.get("newsapi", {})
    since = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S")
    params = urllib.parse.urlencode({
        "q": api.get("query", "Trump"),
        "from": since,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 100,
        "apiKey": key,
    })
    try:
        data = json.loads(fetch(f"{api['endpoint']}?{params}"))
    except Exception as e:
        print(f"  newsapi error: {e}", file=sys.stderr)
        return []
    out = []
    for a in data.get("articles", []):
        url = a.get("url") or ""
        if not url or not a.get("title"):
            continue
        out.append({
            "id": hashlib.sha1(url.encode()).hexdigest()[:16],
            "title": a["title"],
            "url": url,
            "summary": (a.get("description") or "")[:600],
            "published": a.get("publishedAt"),
            "source": (a.get("source") or {}).get("name", "NewsAPI"),
            "source_id": "newsapi",
            "bias_note": "mixed",
        })
    return out


def relevant(article, keywords):
    # Official/primary-source and investigative feeds are kept wholesale;
    # everything else must match a tracked keyword.
    if article["source_id"] in ("whitehouse", "propublica"):
        return True
    hay = (article["title"] + " " + article["summary"]).lower()
    return any(k in hay for k in keywords)


def main():
    with open(CONFIG) as f:
        cfg = json.load(f)
    keywords = [k.lower() for k in cfg.get("keywords", [])]

    existing = {}
    if os.path.exists(STORE):
        with open(STORE) as f:
            for a in json.load(f).get("articles", []):
                existing[a["id"]] = a

    fetched = 0
    for src in cfg["feeds"]:
        try:
            raw = fetch(src["url"])
            arts = parse_feed(raw, src)
            fetched += len(arts)
            for a in arts:
                if relevant(a, keywords) and a["id"] not in existing:
                    a["first_seen"] = datetime.now(timezone.utc).isoformat()
                    existing[a["id"]] = a
            print(f"  {src['id']}: {len(arts)} items")
        except Exception as e:
            print(f"  {src['id']} FAILED: {e}", file=sys.stderr)

    for a in fetch_newsapi(cfg):
        if relevant(a, keywords) and a["id"] not in existing:
            a["first_seen"] = datetime.now(timezone.utc).isoformat()
            existing[a["id"]] = a

    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)
    kept = []
    for a in existing.values():
        dt = parse_date(a.get("published") or a.get("first_seen") or "")
        if dt is None or dt >= cutoff:
            kept.append(a)
    kept.sort(key=lambda a: a.get("published") or a.get("first_seen") or "", reverse=True)

    os.makedirs(os.path.dirname(STORE), exist_ok=True)
    with open(STORE, "w") as f:
        json.dump({"updated": datetime.now(timezone.utc).isoformat(),
                   "count": len(kept), "articles": kept}, f, indent=1)
    print(f"aggregate: {fetched} fetched, {len(kept)} stored")


if __name__ == "__main__":
    main()
