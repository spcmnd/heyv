from datetime import date

from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from django.db import models

from .category import Category


def validate_interval(value: str) -> None:
    """Validate the interval string is 4 non-negative space-separated integers."""

    parts = value.split()
    expected_parts = 4

    if len(parts) != expected_parts:
        raise ValidationError("Interval must have exactly 4 space-separated integers (d w m y).")
    try:
        days, weeks, months, years = map(int, parts)
    except ValueError:
        raise ValidationError("All interval values must be integers.")
    if any(v < 0 for v in (days, weeks, months, years)):
        raise ValidationError("Interval values must not be negative.")
    if all(v == 0 for v in (days, weeks, months, years)):
        raise ValidationError("Interval must not be all zeros.")


class Task(models.Model):
    name = models.CharField(max_length=255, help_text="Required. Name of the task.")
    description = models.TextField(blank=True, null=True, help_text="Description of the task.")
    interval = models.CharField(
        max_length=255,
        validators=[validate_interval],
        help_text="Required. Interval of the task. Format: d w m y.",
        default="1 0 0 0",
    )

    last_done_date = models.DateField(
        blank=True,
        null=True,
        help_text="Last date when the task has been done. It is the starting point for the interval. If not present, it will take the creation date.",
    )
    due_date = models.DateField(
        blank=True, null=True, help_text="Due date of the task. Re-calculated when the last_done_date is updated."
    )

    category = models.ForeignKey(Category, blank=True, null=True, on_delete=models.SET_NULL)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def recalculate_due_date(self):
        if self.last_done_date:
            start_date = self.last_done_date
        else:
            start_date = self.created_at.date()

        days, weeks, months, years = map(int, self.interval.split())
        interval_delta = relativedelta(days=days, weeks=weeks, months=months, years=years)

        self.due_date = start_date + interval_delta
        now = date.today()

        self.due_date = max(self.due_date, now)

    def __str__(self):
        return f"Task {self.name} with due date of {self.due_date}"
