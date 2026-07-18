# heyv

Regular task manager

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

## Production

```bash
docker compose up --build -d        # → http://<host>:80
```

Set environment variables (see `.env.example`) before deploying.
