from django import apps


class AppConfig(apps.AppConfig):
    name = "app"

    def ready(self):
        from app import signals  # noqa: F401
