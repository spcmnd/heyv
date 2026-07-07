from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError

from app.models import Task


class Command(BaseCommand):
    help = "Seed the database with initial data for local development."

    def add_arguments(self, parser):
        parser.add_argument("fixture_set", type=str, help='Fixture set to load (e.g. "dev")')

    def handle(self, *args, **options):
        fixture_set = options["fixture_set"]

        if fixture_set != "dev":
            raise CommandError(f'Unknown fixture set: "{fixture_set}"')

        self.stdout.write(self.style.WARNING("This will flush the database (delete all data) and load dev fixtures."))
        answer = input("Are you sure? [y/N]: ")

        if answer.lower() != "y":
            self.stdout.write("Cancelled.")
            return

        self.stdout.write("Flushing database...")
        call_command("flush", "--noinput", interactive=False)

        for label in ("dev/01_users", "dev/02_categories_tasks"):
            self.stdout.write(f"Loading {label}.json...")
            call_command("loaddata", label)

        for task in Task.objects.all():
            task.recalculate_due_date()
            task.save()

        self.stdout.write(self.style.SUCCESS("Dev fixtures loaded successfully."))
