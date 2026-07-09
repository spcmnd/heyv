FROM python:3.12-alpine

RUN apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev linux-headers && \
    pip install --no-cache-dir -U pip

WORKDIR /app

COPY requirements/ requirements/
RUN pip install --no-cache-dir -r requirements/production.txt && \
    apk del .build-deps

COPY . .

RUN chmod +x entrypoint.sh

ENV DJANGO_SETTINGS_MODULE=heyv.settings.production

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "heyv.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
