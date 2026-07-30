#!/usr/bin/env python3
"""Render a daily YouTube Short (vertical 1080x1920, <3 min) from the latest
panel digest: ticker-style slides for the hook, each model's verdict, the
top agreed stories, a fact flag, and a CTA. Optionally auto-uploads to
YouTube via the Data API.

Requires the `ffmpeg` binary (installed by CI; see .gitlab-ci.yml). Python is
stdlib-only. Output: data/posts/YYYY-MM-DD/short.mp4

Env:
  SHORT_MAX_SECONDS  target length, default 165 (Shorts cap is 180)
  FONT_FILE          .ttf path; auto-detects DejaVu Sans Bold if unset
  AUTOPOST_YOUTUBE   "true" to upload after rendering
  YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN   OAuth for upload
  YT_PRIVACY         public | unlisted | private (default: public)
  SITE_URL           shown on the CTA slide
"""
import glob
import json
import os
import subprocess
import sys
import tempfile
import textwrap
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PANEL_DIR = os.path.join(ROOT, "data", "panel")
POSTS_DIR = os.path.join(ROOT, "data", "posts")
SITE_URL = os.environ.get("SITE_URL", "donaldjtrumpisaloser.com")
MAX_SECONDS = int(os.environ.get("SHORT_MAX_SECONDS", "165"))

W, H = 1080, 1920
BG = "0x0f1115"
ACCENT = "0xe3b341"
INK = "0xe8e6e1"
RED = "0xe5534b"


def find_font():
    if os.environ.get("FONT_FILE"):
        return os.environ["FONT_FILE"]
    for pat in ("/usr/share/fonts/**/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/**/DejaVuSans.ttf",
                "/usr/share/fonts/**/*Bold*.ttf",
                "/usr/share/fonts/**/*.ttf"):
        hits = glob.glob(pat, recursive=True)
        if hits:
            return hits[0]
    sys.exit("no .ttf font found; set FONT_FILE")


def latest_panel():
    files = sorted(glob.glob(os.path.join(PANEL_DIR, "*.json")))
    if not files:
        return None
    with open(files[-1]) as f:
        return json.load(f)


def build_slides(panel):
    """Each slide: (kicker, main text, accent_color, seconds)."""
    c = panel.get("consensus", {})
    n = len(panel.get("reviews", {}))
    slides = [("THE 24-HOUR PANEL",
               f"We made {n} rival AIs read every Trump headline from the last "
               f"24 hours.\n\nFox News. The Guardian. The White House itself.\n\n"
               f"Here's what they agreed on.", ACCENT, 8)]
    for model, verdict in c.get("verdicts_by_model", {}).items():
        if verdict:
            slides.append((f"{model.upper()} SAYS", f"“{verdict}”", ACCENT, 9))
    for s in c.get("stories_ranked_by_panel_agreement", [])[:3]:
        picked = len(s.get("picked_by", []))
        slides.append((f"AGREED BY {picked} OF {n} MODELS",
                       f"{s.get('headline', '')}\n\n{s.get('why_it_matters', '')}", INK, 10))
    for fl in c.get("pooled_fact_flags", [])[:2]:
        slides.append(("FACT FLAG",
                       f"Claim: {fl.get('claim', '')}\n\n{fl.get('assessment', '')}", RED, 10))
    slides.append(("EVERY CLAIM CITED",
                   f"Full analysis, sources, and the documented record:\n\n{SITE_URL}\n\n"
                   f"Follow for tomorrow's panel.", ACCENT, 7))

    total = sum(s[3] for s in slides)
    while total > MAX_SECONDS and len(slides) > 4:
        slides.pop(-2)
        total = sum(s[3] for s in slides)
    return slides


def wrap(text, width=26):
    out = []
    for para in text.split("\n"):
        out.extend(textwrap.wrap(para, width=width) or [""])
    return "\n".join(out)


def render_slide(idx, kicker, body, color, seconds, font, tmpdir):
    """One vertical clip: dark bg, gold rule, kicker line, wrapped body."""
    kfile = os.path.join(tmpdir, f"k{idx}.txt")
    bfile = os.path.join(tmpdir, f"b{idx}.txt")
    with open(kfile, "w") as f:
        f.write(kicker)
    with open(bfile, "w") as f:
        f.write(wrap(body))
    out = os.path.join(tmpdir, f"slide{idx}.mp4")
    vf = (
        f"drawbox=x=0:y=300:w={W}:h=8:color={ACCENT}:t=fill,"
        f"drawbox=x=0:y={H-320}:w={W}:h=8:color={ACCENT}:t=fill,"
        f"drawtext=fontfile={font}:textfile={kfile}:fontsize=52:fontcolor={ACCENT}:"
        f"x=(w-text_w)/2:y=400,"
        f"drawtext=fontfile={font}:textfile={bfile}:fontsize=64:fontcolor={color}:"
        f"line_spacing=22:x=(w-text_w)/2:y=560,"
        f"drawtext=fontfile={font}:text='LIVE ACCOUNTABILITY TICKER':fontsize=36:"
        f"fontcolor=0x9a9790:x=(w-text_w)/2:y={H-260},"
        f"fade=t=in:st=0:d=0.4,fade=t=out:st={seconds - 0.4}:d=0.4"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-f", "lavfi", "-i", f"color=c={BG}:s={W}x{H}:d={seconds}:r=30",
         "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo:d={seconds}",
         "-vf", vf, "-shortest",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", out],
        check=True)
    return out


def render(panel):
    font = find_font()
    outdir = os.path.join(POSTS_DIR, panel["date"])
    os.makedirs(outdir, exist_ok=True)
    final = os.path.join(outdir, "short.mp4")
    with tempfile.TemporaryDirectory() as tmp:
        clips = [render_slide(i, k, b, c, s, font, tmp)
                 for i, (k, b, c, s) in enumerate(build_slides(panel))]
        concat = os.path.join(tmp, "list.txt")
        with open(concat, "w") as f:
            for c in clips:
                f.write(f"file '{c}'\n")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat",
                        "-safe", "0", "-i", concat, "-c", "copy", final], check=True)
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", final], capture_output=True, text=True)
    print(f"short: rendered {final} ({float(dur.stdout or 0):.0f}s)")
    return final


# ------------------------- YouTube upload (Data API v3) ----------------------

def yt_access_token():
    body = urllib.parse.urlencode({
        "client_id": os.environ["YT_CLIENT_ID"],
        "client_secret": os.environ["YT_CLIENT_SECRET"],
        "refresh_token": os.environ["YT_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=body)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())["access_token"]


def upload(video_path, panel):
    if os.environ.get("AUTOPOST_YOUTUBE", "").lower() not in ("1", "true", "yes"):
        print("  YouTube: auto-upload disabled (set AUTOPOST_YOUTUBE=true)")
        return
    for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"):
        if not os.environ.get(k):
            print(f"  YouTube: {k} not set, skipping upload")
            return
    token = yt_access_token()
    c = panel.get("consensus", {})
    top = c.get("stories_ranked_by_panel_agreement", [{}])
    title = f"3 rival AIs read ALL the Trump news — {panel['date']} #shorts"
    desc_lines = [f"The 24-Hour Panel for {panel['date']}: the day's coverage from across "
                  "the spectrum (Fox News to the Guardian, plus whitehouse.gov), "
                  "independently analyzed by rival AI models. Every claim cited.",
                  "", f"Full analysis & sources: {os.environ.get('SITE_URL', '')}"]
    meta = {"snippet": {"title": title[:100],
                        "description": "\n".join(desc_lines)[:4900],
                        "categoryId": "25",
                        "tags": ["news", "politics", "trump", "ai", "factcheck", "shorts"]},
            "status": {"privacyStatus": os.environ.get("YT_PRIVACY", "public"),
                       "selfDeclaredMadeForKids": False}}
    init = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable"
        "&part=snippet,status",
        data=json.dumps(meta).encode(), method="POST",
        headers={"Authorization": f"Bearer {token}",
                 "Content-Type": "application/json",
                 "X-Upload-Content-Type": "video/mp4"})
    with urllib.request.urlopen(init, timeout=60) as r:
        session_uri = r.headers["Location"]
    with open(video_path, "rb") as f:
        data = f.read()
    put = urllib.request.Request(session_uri, data=data, method="PUT",
                                 headers={"Content-Type": "video/mp4"})
    with urllib.request.urlopen(put, timeout=600) as r:
        vid = json.loads(r.read())["id"]
    print(f"  YouTube: uploaded https://youtube.com/shorts/{vid}")


def main():
    panel = latest_panel()
    if not panel:
        print("short: no panel digest yet; run llm_panel.py first")
        return
    video = render(panel)
    try:
        upload(video, panel)
    except Exception as e:
        print(f"  YouTube upload FAILED: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
