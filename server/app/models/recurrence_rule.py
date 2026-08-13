from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

MIN_WEEKDAY, MAX_WEEKDAY = 1, 7
MIN_DAY_OF_MONTH, MAX_DAY_OF_MONTH = 1, 31
MIN_MONTH, MAX_MONTH = 1, 12
MIN_WEEK_POSITION, MAX_WEEK_POSITION = -1, 4


def validate_weekdays(value):
    """Validate that weekday values are within 1-7 and unique."""

    for day in value:
        if day < MIN_WEEKDAY or day > MAX_WEEKDAY:
            raise ValidationError(f"Invalid weekday {day}. Weekdays must be between 1 (Monday) and 7 (Sunday).")

    if len(set(value)) != len(value):
        raise ValidationError("Weekdays must not contain duplicates.")


class RecurrenceRule(models.Model):
    class Frequency(models.TextChoices):
        DAILY = "DAILY", "Daily"
        WEEKLY = "WEEKLY", "Weekly"
        MONTHLY = "MONTHLY", "Monthly"
        YEARLY = "YEARLY", "Yearly"

    frequency = models.CharField(
        max_length=10,
        choices=Frequency.choices,
    )

    interval = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
    )

    weekdays = models.JSONField(
        default=list,
        blank=True,
        validators=[validate_weekdays],
    )

    day_of_month = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(MIN_DAY_OF_MONTH), MaxValueValidator(MAX_DAY_OF_MONTH)],
    )

    week_position = models.SmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(MIN_WEEK_POSITION), MaxValueValidator(MAX_WEEK_POSITION)],
    )

    month = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(MIN_MONTH), MaxValueValidator(MAX_MONTH)],
    )

    start_date = models.DateField(
        null=True,
        blank=True,
    )

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def clean(self):
        super().clean()
        errors = {}

        if self.start_date and self.end_date and self.start_date > self.end_date:
            errors["end_date"] = "End date must be after start date."

        if self.frequency == self.Frequency.DAILY:
            errors.update(self._clean_daily())
        elif self.frequency == self.Frequency.WEEKLY:
            errors.update(self._clean_weekly())
        elif self.frequency == self.Frequency.MONTHLY:
            errors.update(self._clean_monthly())
        elif self.frequency == self.Frequency.YEARLY:
            errors.update(self._clean_yearly())

        if errors:
            raise ValidationError(errors)

    def _clean_daily(self):
        return {
            field_name: f"{field_name} is not allowed for DAILY recurrences."
            for field_name, value in (
                ("weekdays", self.weekdays),
                ("day_of_month", self.day_of_month),
                ("week_position", self.week_position),
                ("month", self.month),
            )
            if value not in (None, [])
        }

    def _clean_weekly(self):
        errors = {}

        if not self.weekdays:
            errors["weekdays"] = "Weekdays are required for WEEKLY recurrences."
        for field_name, value in (
            ("day_of_month", self.day_of_month),
            ("week_position", self.week_position),
            ("month", self.month),
        ):
            if value is not None:
                errors[field_name] = f"{field_name} is not allowed for WEEKLY recurrences."

        return errors

    def _clean_monthly(self):
        errors = {}

        if self.month is not None:
            errors["month"] = "month is not allowed for MONTHLY recurrences."
        if self.day_of_month is None:
            if self.week_position is None or not self.weekdays:
                errors[NON_FIELD_ERRORS] = (
                    "MONTHLY recurrences require either day_of_month or week_position combined with weekdays."
                )
        elif self.week_position is not None or self.weekdays:
            errors[NON_FIELD_ERRORS] = "day_of_month cannot be combined with week_position or weekdays."

        return errors

    def _clean_yearly(self):
        errors = {}

        if self.month is None:
            errors["month"] = "month is required for YEARLY recurrences."
        for field_name, value in (
            ("weekdays", self.weekdays),
            ("week_position", self.week_position),
        ):
            if value not in (None, []):
                errors[field_name] = f"{field_name} is not allowed for YEARLY recurrences."

        return errors
