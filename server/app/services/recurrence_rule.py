from datetime import date, datetime, time, timedelta

from django.utils import timezone

from app.models import RecurrenceRule

MIDNIGHT = time.min


class RecurrenceService:
    """Compute the next recurrence date for a recurrence rule."""

    _GENERATORS = {
        RecurrenceRule.Frequency.DAILY: "_generate_daily",
        RecurrenceRule.Frequency.WEEKLY: "_generate_weekly",
        RecurrenceRule.Frequency.MONTHLY: "_generate_monthly",
        RecurrenceRule.Frequency.YEARLY: "_generate_yearly",
    }

    @classmethod
    def next_recurrence_date(cls, rule, after):
        """Return the first recurrence datetime strictly after `after`, or None if the rule is exhausted."""

        generator = getattr(cls, cls._GENERATORS[rule.frequency])
        after_date = after.date()

        for candidate in generator(rule, after_date):
            if rule.end_date and candidate > rule.end_date:
                return None

            if candidate > after_date:
                return timezone.make_aware(datetime.combine(candidate, MIDNIGHT))

        return None

    @classmethod
    def _generate_daily(cls, rule, after_date):
        start = rule.start_date or after_date
        day_index = max(((after_date - start).days // rule.interval) - 1, 0)

        while True:
            yield start + timedelta(days=rule.interval * day_index)
            day_index += 1

    @classmethod
    def _generate_weekly(cls, rule, after_date):
        if not rule.weekdays:
            return

        start = rule.start_date or after_date
        week_start = start - timedelta(days=start.isoweekday() - 1)
        week_index = max(((after_date - week_start).days // 7 // rule.interval) - 1, 0)
        weekdays = sorted(rule.weekdays)

        while True:
            week_start_date = week_start + timedelta(weeks=rule.interval * week_index)

            for weekday in weekdays:
                yield week_start_date + timedelta(days=weekday - 1)

            week_index += 1

    @classmethod
    def _generate_monthly(cls, rule, after_date):
        if rule.day_of_month is None and (rule.week_position is None or not rule.weekdays):
            return

        start = rule.start_date or after_date
        elapsed_months = (after_date.year - start.year) * 12 + (after_date.month - start.month)
        month_index = max((elapsed_months // rule.interval) - 1, 0)

        while True:
            year, month = divmod(start.year * 12 + (start.month - 1) + month_index * rule.interval, 12)
            yield from cls._candidate_days(year, month + 1, rule)
            month_index += 1

    @classmethod
    def _generate_yearly(cls, rule, after_date):
        if rule.month is None:
            return

        start = rule.start_date or after_date
        year_index = max(((after_date.year - start.year) // rule.interval) - 1, 0)

        while True:
            try:
                yield date(start.year + rule.interval * year_index, rule.month, rule.day_of_month or 1)
            except ValueError:
                return

            year_index += 1

    @classmethod
    def _candidate_days(cls, year, month, rule):
        if rule.day_of_month:
            try:
                yield date(year, month, rule.day_of_month)
                return
            except ValueError:
                pass

        if rule.week_position is None or not rule.weekdays:
            return

        for weekday in sorted(rule.weekdays):
            yield cls._position_date(year, month, weekday, rule.week_position)

    @staticmethod
    def _position_date(year, month, weekday, position):
        first = date(year, month, 1)
        first_weekday = first + timedelta(days=(weekday - first.isoweekday()) % 7)

        if position < 0:
            next_month = date(year + month // 12, month % 12 + 1, 1)
            return next_month + timedelta(days=(weekday - next_month.isoweekday()) % 7 - 7)

        return first_weekday + timedelta(weeks=position - 1)
