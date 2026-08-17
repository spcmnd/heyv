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

## Production

```bash
docker compose up --build -d        # → http://<host>:80
```

Set environment variables (see `.env.example`) before deploying.
