from datetime import date

from dateutil.relativedelta import relativedelta
from django.db import models

from .category import Category


class Task(models.Model):
    name = models.CharField(max_length=255, help_text="Required. Name of the task.")
    description = models.TextField(blank=True, null=True, help_text="Description of the task.")
    interval = models.CharField(max_length=255, help_text="Required. Interval of the task. Format : d w m y.")

    last_done_date = models.DateField(
        blank=True,
        null=True,
        help_text="Last date when the task has been done. It is the starting point for the internal. If not present, it will take the creation date.",
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

        while self.due_date < now:
            self.due_date += interval_delta

    def __str__(self):
        return f"Task {self.name} with due date of {self.due_date}"
