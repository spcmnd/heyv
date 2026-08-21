# heyv

Regular task manager

> **Disclaimer:** this app is still in **alpha** and should not be used in production yet. The main reasons are the lack of features and the vibe coding that has been done on some parts to gain time. For future versions, the code will be carefully reviewed and refactored if needed.

## Codebase status

Parts of this codebase are "vibe coded" because of time constraints. Notable examples include the `TaskOccurrence` next occurrence calculation and most of the frontend code. This means the code can be sloppy and some edge cases may not be handled. These parts will be refactored as needed during the usage of the app and possibly in future versions.

## Local development

```bash
# Server
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py runserver          # → http://127.0.0.1:8000

# Client
cd client
npm install
npm run dev                         # → http://localhost:5173
```

Or with Docker:

```bash
docker compose up --build           # → http://localhost
```

## Deployment

heyv is a local, self-hosted app currently in **alpha**. The deployment setup is intentionally minimal: a single Docker Compose stack whose images are built directly on the target machine. There is no registry, no CI/CD and no TLS — for a personal app served over the LAN, this keeps iteration fast and the operational surface tiny.

This will be upgraded later as the app stabilizes (prebuilt images in a registry, automated deploys, HTTPS behind a reverse proxy, monitoring). Until then, every script takes the target host and directory as parameters, so nothing below is tied to a specific machine: any Linux host with Docker works, a Raspberry Pi running a **64-bit OS** is just the most common case. 32-bit OSes are not supported.

### First-time setup

```bash
cp .env.example .env                 # then edit .env with real values
```

### Deploying

The deploy script syncs the repository to the target and builds the images there.

```bash
./scripts/deploy.sh                              # build & run on this machine
./scripts/deploy.sh -h pi@192.168.1.50           # build & run on a remote host
./scripts/deploy.sh -h pi@pi -d /srv/heyv -b main
```

- `-h <user@host>` — target host over SSH; omit to deploy locally.
- `-d <dir>` — deployment directory on the target (default `/opt/heyv`).
- `-b <branch>` — safety guard: fails if the local checkout is not on `<branch>`.

On first deployment, if the target has no `.env`, the local one is copied over. Subsequent deploys never touch it.

Once deployed, the app is available at `http://<host>:<APP_PORT>` (`APP_PORT` defaults to `80`).

### Backups

Dumps the PostgreSQL database into `backups/` as a gzip-compressed SQL file. Dumps are always written on the machine running the script — even when targeting a remote host — so backups survive an SD card failure on the database machine.

```bash
./scripts/backup.sh                          # backup the local deployment
./scripts/backup.sh -h pi@192.168.1.50       # backup a remote deployment
```

Options via environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `BACKUP_DIR` | `<repo>/backups` | Where dumps are stored |
| `KEEP_DAYS` | `14` | Delete dumps older than this many days |
| `OFFSITE_TARGET` | *(empty)* | rsync destination mirrored after each run |

To run nightly backups from cron:

```bash
0 3 * * * cd /opt/heyv && ./scripts/backup.sh >> backups/cron.log 2>&1
```

Or from another machine, so dumps never live on the Pi at all:

```bash
0 4 * * * /path/to/heyv/scripts/backup.sh -h pi@raspberrypi >> /path/to/backups/cron.log 2>&1
```

### Restore

Restores a dump read from the machine running the script and streams it to the target. Best restored into an empty database.

```bash
./scripts/restore.sh backups/heyv_2026-08-21_1200.sql.gz   # restore locally
./scripts/restore.sh latest                                # newest dump in BACKUP_DIR
./scripts/restore.sh -h pi@pi latest                       # restore onto a remote host
```

The script asks for a explicit `YES` confirmation before overwriting data.

### Tunables

| Variable (in `.env`) | Default | Purpose |
|---|---|---|
| `APP_PORT` | `80` | Port exposed by nginx on the host |
| `GUNICORN_WORKERS` | `2` | Django worker processes (keep low on small hosts) |

Container logs are rotated by Docker Compose (`10 MB` × 3 files per service) to avoid filling the disk of small devices.
