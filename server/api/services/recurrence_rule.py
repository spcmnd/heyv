from app.models import RecurrenceRule

WEEKDAY_LABELS = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
}

MONTH_LABELS = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
}

WEEK_POSITION_LABELS = {-1: "last", 1: "first", 2: "second", 3: "third", 4: "fourth"}


def _ordinal(number):
    """Return the number with its English ordinal suffix, e.g. 1 -> "1st"."""

    if number % 100 in range(10, 21):
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(number % 10, "th")
    return f"{number}{suffix}"


class RecurrenceRuleService:
    @classmethod
    def build_label(cls, rule: RecurrenceRule):
        """Build a human-readable label describing the recurrence rule."""

        base = cls._build_base(rule)
        detail = cls._build_detail(rule)

        return f"{base} {detail}" if detail else base

    @classmethod
    def _build_base(cls, rule: RecurrenceRule):
        singular, plural = cls._frequency_units(rule.frequency)

        if rule.interval == 1:
            return f"Every {singular}"

        return f"Every {rule.interval} {plural}"

    @classmethod
    def _build_detail(cls, rule: RecurrenceRule):
        return {
            RecurrenceRule.Frequency.DAILY: cls._daily_detail,
            RecurrenceRule.Frequency.WEEKLY: cls._weekly_detail,
            RecurrenceRule.Frequency.MONTHLY: cls._monthly_detail,
            RecurrenceRule.Frequency.YEARLY: cls._yearly_detail,
        }[rule.frequency](rule)

    @staticmethod
    def _frequency_units(frequency):
        return {
            RecurrenceRule.Frequency.DAILY: ("day", "days"),
            RecurrenceRule.Frequency.WEEKLY: ("week", "weeks"),
            RecurrenceRule.Frequency.MONTHLY: ("month", "months"),
            RecurrenceRule.Frequency.YEARLY: ("year", "years"),
        }[frequency]

    @staticmethod
    def _daily_detail(rule):
        return ""

    @classmethod
    def _weekly_detail(cls, rule):
        if rule.weekdays:
            return f"on {cls._join_names(cls._weekday_names(rule.weekdays))}"

        return ""

    @classmethod
    def _monthly_detail(cls, rule):
        if rule.day_of_month:
            return f"on the {_ordinal(rule.day_of_month)}"

        if rule.week_position is not None and rule.weekdays:
            position = WEEK_POSITION_LABELS[rule.week_position]
            return f"on the {position} {cls._join_names(cls._weekday_names(rule.weekdays))}"

        return ""

    @classmethod
    def _yearly_detail(cls, rule):
        if not rule.month:
            return ""

        if rule.day_of_month:
            return f"on {MONTH_LABELS[rule.month]} {_ordinal(rule.day_of_month)}"

        return f"in {MONTH_LABELS[rule.month]}"

    @staticmethod
    def _weekday_names(weekdays):
        return [WEEKDAY_LABELS[day] for day in sorted(weekdays)]

    @staticmethod
    def _join_names(names):
        if len(names) == 1:
            return names[0]

        return f"{', '.join(names[:-1])} and {names[-1]}"
