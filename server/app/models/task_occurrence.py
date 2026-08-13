from django.conf import settings
from django.db import models

from app.models.task_template import TaskTemplate

User = settings.AUTH_USER_MODEL


class TaskOccurrence(models.Model):
    class Status(models.TextChoices):
        TODO = "TODO", "To do"
        COMPLETED = "COMPLETED", "Completed"
        SKIPPED = "SKIPPED", "Skipped"
        CANCELLED = "CANCELLED", "Cancelled"

    task_template = models.ForeignKey(TaskTemplate, on_delete=models.CASCADE, related_name="occurrences")

    scheduled_for = models.DateTimeField()

    status = models.CharField(choices=Status.choices, default=Status.TODO)

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="completed_task_occurrences",
    )

    actual_duration_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["scheduled_for"]

        indexes = [
            models.Index(fields=["task_template", "scheduled_for"]),
            models.Index(fields=["status", "scheduled_for"]),
        ]

    def __str__(self):
        return f"{self.task_template.title} - {self.scheduled_for}"
