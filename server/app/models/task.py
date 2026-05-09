from django.db import models

from .category import Category


class Task(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, help_text="Name of the task.")
    description = models.TextField(blank=True, null=True, help_text="Description of the task.")
    interval = models.CharField(
        max_length=255, blank=False, null=False, help_text="Interval of the task. Format : d w m y."
    )
    due_date = models.DateField(blank=False, null=False, help_text="Next date when the date is due,")
    category = models.ForeignKey(Category, blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Task {self.name} with due date of {self.due_date}"
