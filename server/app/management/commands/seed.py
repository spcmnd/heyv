from pathlib import Path

from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError

FIXTURES_DIR = Path(__file__).resolve().parent.parent.parent / "fixtures"


class Command(BaseCommand):
    help = "Seed the database with initial data for local development."

    def add_arguments(self, parser):
        parser.add_argument("fixture_set", type=str, help='Fixture set to load (e.g. "dev")')

    def handle(self, *args, **options):
        fixture_set = options["fixture_set"]

        fixtures_dir = FIXTURES_DIR / fixture_set
        if not fixtures_dir.is_dir():
            raise CommandError(f'Unknown fixture set: "{fixture_set}"')

        labels = sorted(f"{fixture_set}/{path.stem}" for path in fixtures_dir.glob("*.json"))

        self.stdout.write(self.style.WARNING("This will flush the database (delete all data) and load dev fixtures."))
        answer = input("Are you sure? [y/N]: ")

        if answer.lower() != "y":
            self.stdout.write("Cancelled.")
            return

        self.stdout.write("Flushing database...")
        call_command("flush", "--noinput", interactive=False)

        for label in labels:
            self.stdout.write(f"Loading {label}.json...")
            call_command("loaddata", label)

        self.stdout.write(self.style.SUCCESS("Dev fixtures loaded successfully."))
