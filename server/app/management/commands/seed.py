import json
import re
import tempfile
from datetime import timedelta
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

FIXTURES_DIR = Path(__file__).resolve().parent.parent.parent / "fixtures"

RELATIVE_DATE_RE = re.compile(r"__TODAY([+-]\d+)?__")


def resolve_relative_dates(data, today):
    """Replace __TODAY(+/-N)__ date tokens with absolute dates relative to today."""
    if isinstance(data, str):
        return RELATIVE_DATE_RE.sub(
            lambda match: (today + timedelta(days=int(match.group(1) or 0))).isoformat(),
            data,
        )
    if isinstance(data, list):
        return [resolve_relative_dates(item, today) for item in data]
    if isinstance(data, dict):
        return {key: resolve_relative_dates(value, today) for key, value in data.items()}
    return data


class Command(BaseCommand):
    help = "Seed the database with initial data for local development."

    def add_arguments(self, parser):
        parser.add_argument("fixture_set", type=str, help='Fixture set to load (e.g. "dev")')

    def handle(self, *args, **options):
        fixture_set = options["fixture_set"]

        fixtures_dir = FIXTURES_DIR / fixture_set
        if not fixtures_dir.is_dir():
            raise CommandError(f'Unknown fixture set: "{fixture_set}"')

        fixture_paths = sorted(fixtures_dir.glob("*.json"))

        if not fixture_paths:
            raise CommandError(f'No fixtures found in fixture set: "{fixture_set}"')

        self.stdout.write(self.style.WARNING("This will flush the database (delete all data) and load dev fixtures."))
        answer = input("Are you sure? [y/N]: ")

        if answer.lower() != "y":
            self.stdout.write("Cancelled.")
            return

        today = timezone.localdate()

        self.stdout.write("Flushing database...")
        call_command("flush", "--noinput", interactive=False)

        for path in fixture_paths:
            self.stdout.write(f"Loading {path.name}...")
            with path.open() as fixture_file:
                data = json.load(fixture_file)

            data = resolve_relative_dates(data, today)

            with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as tmp:
                json.dump(data, tmp, ensure_ascii=False)
                tmp_path = Path(tmp.name)

            try:
                call_command("loaddata", tmp_path)
            finally:
                tmp_path.unlink(missing_ok=True)

        self.stdout.write(self.style.SUCCESS("Dev fixtures loaded successfully."))
