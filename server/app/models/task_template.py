from django.conf import settings
from django.db import models

from app.models.category import Category
from app.models.recurrence_rule import RecurrenceRule
from app.models.room import Room

User = settings.AUTH_USER_MODEL


class TaskTemplate(models.Model):
    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    title = models.CharField(help_text="Title of the task.")
    description = models.TextField(blank=True, null=True)

    category = models.ManyToManyField(
        to=Category,
        blank=True,
        related_name="task_templates",
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name="task_templates",
    )

    priority = models.CharField(choices=Priority.choices, default=Priority.MEDIUM)
    estimated_duration_minutes = models.PositiveIntegerField(blank=True, null=True)

    recurrence_rule = models.OneToOneField(
        RecurrenceRule, on_delete=models.SET_NULL, blank=True, null=True, related_name="task_template"
    )

    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(blank=True, null=True)
