#!/bin/sh
set -e

if [ "${USE_POSTGRES:-True}" = "True" ]; then
  echo "Waiting for PostgreSQL..."
  python -c "
import socket, time, os
host = os.environ.get('DB_HOST', 'postgres')
port = int(os.environ.get('DB_PORT', 5432))
while True:
    try:
        socket.create_connection((host, port), timeout=2).close()
        break
    except (OSError, socket.error):
        time.sleep(1)
"
  echo "PostgreSQL is ready."
fi

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

exec "$@"
