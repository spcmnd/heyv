from django.db import models


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
    )

    weekdays = models.JSONField(
        default=list,
        blank=True,
    )

    day_of_month = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    week_position = models.SmallIntegerField(
        null=True,
        blank=True,
    )

    month = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
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
