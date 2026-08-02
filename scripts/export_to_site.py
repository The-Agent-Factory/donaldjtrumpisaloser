#!/usr/bin/env python3
"""Export pipeline data as JSON the Next.js site serves statically:
  site/public/data/wire.json          latest sourced headlines (trimmed)
  site/public/data/panel-latest.json  newest 24-Hour Panel digest
  site/public/data/panel-index.json   list of available panel dates
Stdlib only.
"""
import glob
import json
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "public", "data")


def main():
    os.makedirs(OUT, exist_ok=True)

    src = os.path.join(ROOT, "data", "articles.json")
    if os.path.exists(src):
        with open(src) as f:
            store = json.load(f)
        wire = [{k: a.get(k) for k in
                 ("title", "url", "summary", "published", "source", "bias_note")}
                for a in store.get("articles", [])[:60]]
        with open(os.path.join(OUT, "wire.json"), "w") as f:
            json.dump({"updated": store.get("updated"), "articles": wire}, f)
        print(f"export: wire.json ({len(wire)} articles)")

    panels = sorted(glob.glob(os.path.join(ROOT, "data", "panel", "*.json")))
    if panels:
        with open(panels[-1]) as f:
            latest = json.load(f)
        latest.pop("reviews", None)  # full per-model output stays in the repo
        with open(os.path.join(OUT, "panel-latest.json"), "w") as f:
            json.dump(latest, f)
        dates = [os.path.basename(p)[:-5] for p in panels]
        with open(os.path.join(OUT, "panel-index.json"), "w") as f:
            json.dump({"dates": dates}, f)
        print(f"export: panel-latest.json ({latest.get('date')}), "
              f"panel-index.json ({len(dates)} days)")

    # Daily content package -> /studio (posts-latest.json + the Short itself)
    post_dirs = sorted(glob.glob(os.path.join(ROOT, "data", "posts", "*")))
    post_dirs = [d for d in post_dirs if os.path.isdir(d)]
    if post_dirs:
        pd = post_dirs[-1]
        date = os.path.basename(pd)

        def read(name):
            p = os.path.join(pd, name)
            if os.path.exists(p):
                with open(p, encoding="utf-8") as f:
                    return f.read()
            return ""

        thread = []
        tj = os.path.join(pd, "x_thread.json")
        if os.path.exists(tj):
            with open(tj, encoding="utf-8") as f:
                thread = json.load(f)

        video_src = os.path.join(pd, "short.mp4")
        has_video = os.path.exists(video_src)
        if has_video:
            shorts_dir = os.path.join(ROOT, "site", "public", "shorts")
            os.makedirs(shorts_dir, exist_ok=True)
            shutil.copyfile(video_src, os.path.join(shorts_dir, "latest.mp4"))
        else:
            has_video = os.path.exists(
                os.path.join(ROOT, "site", "public", "shorts", "latest.mp4"))

        with open(os.path.join(OUT, "posts-latest.json"), "w", encoding="utf-8") as f:
            json.dump({"date": date, "thread": thread,
                       "tiktok_script": read("tiktok_script.md"),
                       "substack_md": read("substack_llm_news.md"),
                       "has_video": has_video}, f)
        print(f"export: posts-latest.json ({date}, video={has_video})")


if __name__ == "__main__":
    main()
