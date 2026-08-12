# Runner image for the Accountability Wire cron services (wire + panel share it).
# python: pipeline scripts (stdlib only) · git: clone/commit-back ·
# ffmpeg/fonts: daily Short render · node: @railway/cli for the site redeploy.
FROM python:3.12-slim
RUN apt-get update -qq \
 && apt-get install -y -qq --no-install-recommends git ffmpeg fonts-dejavu-core curl ca-certificates \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y -qq nodejs \
 && npm install -g @railway/cli \
 && rm -rf /var/lib/apt/lists/*
COPY run.sh /run.sh
RUN chmod +x /run.sh
CMD ["/bin/bash", "/run.sh"]
