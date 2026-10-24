#!/bin/bash
# Accountability Wire — Railway cron runner (replaces GitLab CI schedules,
# which burned the free tier's 400 min/month in under a week; moved 2026-08-12).
#
# Each run: fresh clone → aggregate (+ full panel/social/short when
# PIPELINE_MODE=panel) → export site JSON → commit data back to GitLab
# (ci.skip) → redeploy the site service so the static build bakes the new
# data (unless REDEPLOY_SITE=false).
#
# Required env on the Railway service: GITLAB_PUSH_TOKEN, RAILWAY_TOKEN,
# PIPELINE_MODE (wire|panel), SITE_URL. Panel mode also wants GEMINI_API_KEY
# (+ any other panel seats). Optional: REDEPLOY_SITE=false, NEWSAPI_KEY.
set -euo pipefail

: "${GITLAB_PUSH_TOKEN:?GITLAB_PUSH_TOKEN missing}"
MODE="${PIPELINE_MODE:-wire}"
REPO="https://wire-bot:${GITLAB_PUSH_TOKEN}@gitlab.com/the-agent-factory/donaldjtrumpisaloser.git"

echo "[cron] mode=${MODE} $(date -u +%Y-%m-%dT%H:%MZ)"
rm -rf /work
git clone --depth 20 "$REPO" /work
cd /work

python3 scripts/aggregate.py
if [ "$MODE" = "panel" ]; then
  python3 scripts/llm_panel.py
  python3 scripts/social_posts.py
  python3 scripts/shorts_video.py
fi
python3 scripts/export_to_site.py

git config user.name "accountability-wire-bot"
git config user.email "bot@users.noreply.gitlab.com"
git add -A data site/public/data ':!*.mp4'
git add -f site/public/shorts/latest.mp4 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "Automated update (railway-cron/${MODE}): $(date -u +%Y-%m-%dT%H:%MZ)"
  # Non-fatal: the site redeploy below uploads this clone, so the live site
  # still gets fresh data. But data/ does not persist between runs until the
  # push works (each run restarts from main's data), so say so loudly.
  if ! push_out=$(git push origin HEAD:main -o ci.skip 2>&1); then
    echo "$push_out" >&2
    if echo "$push_out" | grep -q "protected branches"; then
      echo "[cron] ACTION NEEDED (GitLab): GITLAB_PUSH_TOKEN cannot push to protected main. Allow its role to push to main (Settings > Repository > Protected branches) or use a Maintainer token. Data history is not being saved." >&2
    else
      echo "[cron] ACTION NEEDED (GitLab): commit-back push failed, see output above. Data history is not being saved." >&2
    fi
    echo "[cron] commit-back push failed (non-fatal)"
  fi
else
  echo "[cron] no data changes this run"
fi

if [ "${REDEPLOY_SITE:-true}" = "true" ]; then
  # Rebuild the static site so it serves the fresh JSON (same behavior the
  # old deploy_railway CI job had). RAILWAY_TOKEN is a project token.
  # Fatal on purpose: a failed redeploy means the live site goes stale, and
  # the crashed run is what alerts us. Name the cause so the log says what to fix.
  if ! up_out=$(railway up --service donaldjtrumpisaloser --ci 2>&1); then
    echo "$up_out" >&2
    if echo "$up_out" | grep -qi "invalid railway_token"; then
      echo "[cron] ACTION NEEDED (Railway): RAILWAY_TOKEN on this cron service is invalid or revoked. Create a new project token for donaldjtrumpisaloser.com (production) and set it as RAILWAY_TOKEN on wire-cron and panel-cron." >&2
    else
      echo "[cron] ACTION NEEDED (Railway): site redeploy failed, see output above." >&2
    fi
    exit 1
  fi
  echo "$up_out"
else
  echo "[cron] REDEPLOY_SITE=false — data pushed, site redeploy skipped"
fi
echo "[cron] done"
