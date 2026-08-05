FROM python:3.13-alpine

ENV PYTHONUNBUFFERED=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PATH="/app/.venv/bin:$PATH" \
  DJANGO_SETTINGS_MODULE=heyv.settings.production

RUN apk add --no-cache postgresql-libs \
  && apk add --no-cache --virtual .build-deps gcc make musl-dev postgresql-dev linux-headers \
  && pip install --no-cache-dir -U uv

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --group production --no-install-project && apk del .build-deps

COPY . .

RUN chmod +x entrypoint.sh && adduser -D django && chown -R django:django /app
USER django

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "heyv.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
