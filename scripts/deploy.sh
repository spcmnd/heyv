#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

usage() {
  cat <<EOF
Usage: deploy.sh [-h <user@host>] [-d <dir>] [-b <branch>]

Deploys heyv by syncing the repository to the target machine and building
the Docker images there.

Options:
  -h <user@host>   Deploy to a remote host over SSH. Omit to deploy locally.
  -d <dir>         Deployment directory on the target (default: /opt/heyv).
  -b <branch>      Safety guard: fail if the local checkout is not on <branch>.
      --help       Show this help.

Examples:
  ./scripts/deploy.sh                          build & run on this machine
  ./scripts/deploy.sh -h pi@192.168.1.50       deploy to a Raspberry Pi
  ./scripts/deploy.sh -h pi@pi -d /srv/heyv -b main
EOF
}

HOST=""
DEPLOY_DIR="/opt/heyv"
BRANCH=""

while [ $# -gt 0 ]; do
  case "$1" in
    -h)
      [ $# -ge 2 ] || { echo "Option $1 requires an argument" >&2; exit 1; }
      HOST="$2"
      shift 2
      ;;
    -d)
      [ $# -ge 2 ] || { echo "Option $1 requires an argument" >&2; exit 1; }
      DEPLOY_DIR="$2"
      shift 2
      ;;
    -b)
      [ $# -ge 2 ] || { echo "Option $1 requires an argument" >&2; exit 1; }
      BRANCH="$2"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "Error: $ROOT_DIR/.env is missing." >&2
  echo "Copy .env.example to .env and edit it before deploying." >&2
  exit 1
fi

if [ -n "$BRANCH" ]; then
  CURRENT_BRANCH="$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD)"
  if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "Error: current branch is '$CURRENT_BRANCH', expected '$BRANCH'." >&2
    echo "Checkout the branch you intend to deploy, then re-run." >&2
    exit 1
  fi
fi

if [ -z "$HOST" ]; then
  echo "Deploying locally..."
  cd "$ROOT_DIR"
  docker compose up --build -d
  docker image prune -f
  echo "Done."
  exit 0
fi

echo "Syncing repository to $HOST:$DEPLOY_DIR ..."
ssh "$HOST" "mkdir -p '$DEPLOY_DIR'"
rsync -az --delete \
  --exclude ".git/" \
  --exclude "client/node_modules/" \
  --exclude "client/dist/" \
  --exclude "server/.venv/" \
  --exclude "server/db.sqlite3" \
  --exclude ".ruff_cache/" \
  --exclude "__pycache__/" \
  --exclude "*.pyc" \
  --exclude ".env" \
  --exclude "backups/" \
  "$ROOT_DIR/" "$HOST:$DEPLOY_DIR/"

if ! ssh "$HOST" "test -f '$DEPLOY_DIR/.env'"; then
  echo "No .env on target, copying local one..."
  scp -q "$ROOT_DIR/.env" "$HOST:$DEPLOY_DIR/.env"
fi

echo "Building and starting services on $HOST ..."
ssh -t "$HOST" "cd '$DEPLOY_DIR' && docker compose up --build -d && docker image prune -f"

echo "Deployment to $HOST:$DEPLOY_DIR complete."
