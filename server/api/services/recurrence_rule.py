from app.models import RecurrenceRule

WEEKDAY_LABELS = {
    1: "lundi",
    2: "mardi",
    3: "mercredi",
    4: "jeudi",
    5: "vendredi",
    6: "samedi",
    7: "dimanche",
}

MONTH_LABELS = {
    1: "janvier",
    2: "février",
    3: "mars",
    4: "avril",
    5: "mai",
    6: "juin",
    7: "juillet",
    8: "août",
    9: "septembre",
    10: "octobre",
    11: "novembre",
    12: "décembre",
}

WEEK_POSITION_LABELS = {-1: "dernier", 1: "premier", 2: "deuxième", 3: "troisième", 4: "quatrième"}


def _day_label(day):
    """Return the day with its French ordinal form, e.g. 1 -> "1er"."""

    return "1er" if day == 1 else str(day)


class RecurrenceRuleService:
    @classmethod
    def build_label(cls, rule: RecurrenceRule):
        """Build a human-readable label describing the recurrence rule."""

        base = cls._build_base(rule)
        detail = cls._build_detail(rule)

        return f"{base} {detail}" if detail else base

    @classmethod
    def _build_base(cls, rule: RecurrenceRule):
        prefix = "Toutes" if rule.frequency == RecurrenceRule.Frequency.WEEKLY else "Tous"

        if rule.interval == 1:
            return f"{prefix} les {cls._frequency_unit(rule.frequency)}"

        return f"{prefix} les {rule.interval} {cls._frequency_unit(rule.frequency)}"

    @staticmethod
    def _frequency_unit(frequency):
        return {
            RecurrenceRule.Frequency.DAILY: "jours",
            RecurrenceRule.Frequency.WEEKLY: "semaines",
            RecurrenceRule.Frequency.MONTHLY: "mois",
            RecurrenceRule.Frequency.YEARLY: "ans",
        }[frequency]

    @classmethod
    def _build_detail(cls, rule: RecurrenceRule):
        return {
            RecurrenceRule.Frequency.DAILY: cls._daily_detail,
            RecurrenceRule.Frequency.WEEKLY: cls._weekly_detail,
            RecurrenceRule.Frequency.MONTHLY: cls._monthly_detail,
            RecurrenceRule.Frequency.YEARLY: cls._yearly_detail,
        }[rule.frequency](rule)

    @staticmethod
    def _daily_detail(rule):
        return ""

    @classmethod
    def _weekly_detail(cls, rule):
        if not rule.weekdays:
            return ""

        return f"le {cls._join_names(cls._weekday_names(rule.weekdays))}"

    @classmethod
    def _monthly_detail(cls, rule):
        if rule.day_of_month:
            return f"le {_day_label(rule.day_of_month)}"

        if rule.week_position is not None and rule.weekdays:
            position = WEEK_POSITION_LABELS[rule.week_position]
            return f"le {position} {cls._join_names(cls._weekday_names(rule.weekdays))}"

        return ""

    @classmethod
    def _yearly_detail(cls, rule):
        if not rule.month:
            return ""

        if rule.day_of_month:
            return f"le {_day_label(rule.day_of_month)} {MONTH_LABELS[rule.month]}"

        return f"en {MONTH_LABELS[rule.month]}"

    @staticmethod
    def _weekday_names(weekdays):
        return [WEEKDAY_LABELS[day] for day in sorted(weekdays)]

    @staticmethod
    def _join_names(names):
        if len(names) == 1:
            return names[0]

        return f"{', '.join(names[:-1])} et {names[-1]}"