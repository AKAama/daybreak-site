#!/usr/bin/env bash
# Run on the production host from /opt/daybreak-site
# Usage: DAYBREAK_IMAGE=registry/repo:tag ./scripts/remote-update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
IMAGE="${DAYBREAK_IMAGE:?Set DAYBREAK_IMAGE to the full image ref}"
printf '%s\n' "DAYBREAK_IMAGE=${IMAGE}" > .image.env
docker pull "$IMAGE"
docker compose --env-file .env --env-file .image.env up -d --force-recreate --no-deps web
docker compose --env-file .env --env-file .image.env ps
