#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

usage() {
  cat <<EOF
Usage: restore.sh [-h <user@host>] [-d <dir>] <backup.sql[.gz] | latest>

Restores a database dump into the PostgreSQL container. Best restored into
an empty database. The dump file is read from the machine running this
script and streamed to the target.

Options:
  -h <user@host>   Restore into a deployment reached over SSH.
  -d <dir>         Deployment directory on the target (default: /opt/heyv).
      --help       Show this help.

Environment variables:
  HOST             Same as -h.
  DEPLOY_DIR       Same as -d.
  BACKUP_DIR       Where dumps are looked up (default: <repo>/backups).

Examples:
  ./scripts/restore.sh backups/heyv_2026-08-21_1200.sql.gz   local restore
  ./scripts/restore.sh latest                                newest dump in BACKUP_DIR
  ./scripts/restore.sh -h pi@pi latest                       restore onto a remote host
EOF
}

HOST="${HOST:-}"
DEPLOY_DIR="/opt/heyv"

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
    --help)
      usage
      exit 0
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
    *)
      DUMP="${DUMP:-$1}"
      shift
      ;;
  esac
done

DB_USER="${DB_USER:-}"
DB_NAME="${DB_NAME:-}"
ENV_FILE="$ROOT_DIR/.env"

if [ -z "$HOST" ]; then
  if [ -f "$ENV_FILE" ]; then
    [ -z "$DB_USER" ] && DB_USER="$(sed -n 's/^DB_USER=//p' "$ENV_FILE" | tail -1)"
    [ -z "$DB_NAME" ] && DB_NAME="$(sed -n 's/^DB_NAME=//p' "$ENV_FILE" | tail -1)"
  fi
else
  REMOTE_ENV="$DEPLOY_DIR/.env"
  if ssh "$HOST" "test -f '$REMOTE_ENV'"; then
    [ -z "$DB_USER" ] && DB_USER="$(ssh "$HOST" "sed -n 's/^DB_USER=//p' '$REMOTE_ENV' | tail -1")"
    [ -z "$DB_NAME" ] && DB_NAME="$(ssh "$HOST" "sed -n 's/^DB_NAME=//p' '$REMOTE_ENV' | tail -1")"
  fi
fi
DB_USER="${DB_USER:-heyv}"
DB_NAME="${DB_NAME:-heyv}"

BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"

if [ -z "${DUMP:-}" ]; then
  usage
  exit 1
fi

if [ "$DUMP" = "latest" ]; then
  DUMP="$(ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -1 || true)"
  if [ -z "$DUMP" ]; then
    echo "No backup found in $BACKUP_DIR" >&2
    exit 1
  fi
fi

if [ ! -f "$DUMP" ]; then
  echo "File not found: $DUMP" >&2
  exit 1
fi

echo "This will overwrite data in database '$DB_NAME' on '$([ -n "$HOST" ] && echo "$HOST" || echo "localhost")'. Type YES to confirm:"
read -r CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted."
  exit 1
fi

PSQL="docker compose exec -T postgres psql -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1"

echo "Restoring $DUMP..."
if [ -n "$HOST" ]; then
  if [[ "$DUMP" == *.gz ]]; then
    gzip -dc "$DUMP" | ssh "$HOST" "cd '$DEPLOY_DIR' && $PSQL"
  else
    ssh "$HOST" "cd '$DEPLOY_DIR' && $PSQL" < "$DUMP"
  fi
else
  cd "$ROOT_DIR"
  if [[ "$DUMP" == *.gz ]]; then
    gzip -dc "$DUMP" | docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1
  else
    docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 < "$DUMP"
  fi
fi

echo "Restore complete."
