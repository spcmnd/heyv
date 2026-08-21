#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

usage() {
  cat <<EOF
Usage: backup.sh [-h <user@host>] [-d <dir>]

Dumps the PostgreSQL database into a gzip-compressed SQL file.
Dumps are always written to BACKUP_DIR on the machine running this script,
even when targeting a remote host, so backups survive an SD card failure.

Options:
  -h <user@host>   Dump the database of a deployment reached over SSH.
  -d <dir>         Deployment directory on the target (default: /opt/heyv).
      --help       Show this help.

Environment variables:
  HOST             Same as -h.
  DEPLOY_DIR       Same as -d.
  BACKUP_DIR       Where dumps are stored (default: <repo>/backups).
  KEEP_DAYS        Delete dumps older than this many days (default: 14).
  OFFSITE_TARGET   rsync destination to mirror backups to after each run.

Examples:
  ./scripts/backup.sh                          backup the local deployment
  ./scripts/backup.sh -h pi@192.168.1.50       backup a remote Raspberry Pi
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
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
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
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/heyv_$(date +%F_%H%M).sql.gz"

echo "Dumping database..."
if [ -n "$HOST" ]; then
  ssh "$HOST" "cd '$DEPLOY_DIR' && docker compose exec -T postgres pg_dump -U '$DB_USER' '$DB_NAME'" | gzip > "$OUT"
else
  cd "$ROOT_DIR"
  docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$OUT"
fi

if [ ! -s "$OUT" ]; then
  echo "Backup failed: $OUT is empty" >&2
  rm -f "$OUT"
  exit 1
fi

echo "Backup written: $OUT ($(du -h "$OUT" | cut -f1))"
find "$BACKUP_DIR" -name '*.sql.gz' -mtime +"$KEEP_DAYS" -delete

if [ -n "${OFFSITE_TARGET:-}" ]; then
  rsync -az "$BACKUP_DIR/" "$OFFSITE_TARGET"
  echo "Backups rsynced to: $OFFSITE_TARGET"
fi
