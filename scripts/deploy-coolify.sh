#!/usr/bin/env bash
# Deploy Class 365 to Coolify via API.
# Required env:
#   COOLIFY_TOKEN  - API token (e.g. 2|...)
#   COOLIFY_URL    - Base URL of your Coolify instance (e.g. https://coolify.example.com)
# Optional:
#   COOLIFY_PROJECT_UUID / COOLIFY_SERVER_UUID / COOLIFY_ENVIRONMENT_NAME
#   GIT_REPO / GIT_BRANCH
set -euo pipefail

TOKEN="${COOLIFY_TOKEN:?Set COOLIFY_TOKEN}"
BASE="${COOLIFY_URL:?Set COOLIFY_URL to your Coolify instance (https://...)}"
BASE="${BASE%/}"
API="$BASE/api/v1"
REPO="${GIT_REPO:-https://github.com/pnamak/class365}"
BRANCH="${GIT_BRANCH:-cursor/opensis-classic-base-b544}"
ENV_NAME="${COOLIFY_ENVIRONMENT_NAME:-production}"
APP_NAME="${COOLIFY_APP_NAME:-class365}"

auth_hdr=(-H "Authorization: Bearer ${TOKEN}" -H "Accept: application/json" -H "Content-Type: application/json")

echo "[coolify] Checking $API/version ..."
curl -fsS "${auth_hdr[@]}" "$API/version"
echo

echo "[coolify] Listing servers..."
SERVERS_JSON=$(curl -fsS "${auth_hdr[@]}" "$API/servers")
echo "$SERVERS_JSON" | head -c 2000; echo

if [ -z "${COOLIFY_SERVER_UUID:-}" ]; then
  COOLIFY_SERVER_UUID=$(python3 - <<'PY' <<<"$SERVERS_JSON"
import json,sys
data=json.load(sys.stdin)
items=data if isinstance(data,list) else data.get('data',data.get('servers',[]))
if not items:
    raise SystemExit('No servers found — set COOLIFY_SERVER_UUID')
print(items[0].get('uuid') or items[0].get('id'))
PY
)
fi
echo "[coolify] server_uuid=$COOLIFY_SERVER_UUID"

echo "[coolify] Listing projects..."
PROJECTS_JSON=$(curl -fsS "${auth_hdr[@]}" "$API/projects")
if [ -z "${COOLIFY_PROJECT_UUID:-}" ]; then
  COOLIFY_PROJECT_UUID=$(python3 - <<'PY' <<<"$PROJECTS_JSON"
import json,sys
data=json.load(sys.stdin)
items=data if isinstance(data,list) else data.get('data',data.get('projects',[]))
if not items:
    raise SystemExit('No projects found — create one in Coolify UI or set COOLIFY_PROJECT_UUID')
print(items[0].get('uuid') or items[0].get('id'))
PY
)
fi
echo "[coolify] project_uuid=$COOLIFY_PROJECT_UUID"

# Prefer public git + dockercompose build pack
PAYLOAD=$(python3 - <<PY
import json, pathlib
compose = pathlib.Path('docker-compose.yml').read_text()
print(json.dumps({
  "project_uuid": "${COOLIFY_PROJECT_UUID}",
  "server_uuid": "${COOLIFY_SERVER_UUID}",
  "environment_name": "${ENV_NAME}",
  "git_repository": "${REPO}",
  "git_branch": "${BRANCH}",
  "build_pack": "dockercompose",
  "ports_exposes": "80",
  "name": "${APP_NAME}",
  "description": "Class 365 — Vanuatu school management (openSIS)",
  "instant_deploy": True,
  "docker_compose_location": "/docker-compose.yml",
}))
PY
)

echo "[coolify] Creating public application..."
CREATE=$(curl -sS -w "\nHTTP:%{http_code}" "${auth_hdr[@]}" \
  -X POST "$API/applications/public" \
  -d "$PAYLOAD")
echo "$CREATE"

# Fallback: raw dockercompose create
if echo "$CREATE" | grep -q 'HTTP:4'; then
  echo "[coolify] Public create failed — trying /applications/dockercompose with raw compose..."
  COMPOSE_B64=$(base64 -w0 docker-compose.yml 2>/dev/null || base64 docker-compose.yml | tr -d '\n')
  RAW_PAYLOAD=$(python3 - <<PY
import json, pathlib
print(json.dumps({
  "project_uuid": "${COOLIFY_PROJECT_UUID}",
  "server_uuid": "${COOLIFY_SERVER_UUID}",
  "environment_name": "${ENV_NAME}",
  "name": "${APP_NAME}",
  "description": "Class 365 — Vanuatu school management (openSIS)",
  "instant_deploy": True,
  "docker_compose_raw": pathlib.Path('docker-compose.yml').read_text(),
}))
PY
)
  curl -sS -w "\nHTTP:%{http_code}" "${auth_hdr[@]}" \
    -X POST "$API/applications/dockercompose" \
    -d "$RAW_PAYLOAD"
  echo
fi

echo "[coolify] Done. Open $BASE and confirm the Class 365 deployment."
