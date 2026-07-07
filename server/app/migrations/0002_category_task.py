from django.db import migrations, models

import app.models.task


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Required. Name of the category.",
                        max_length=255,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "categories",
            },
        ),
        migrations.CreateModel(
            name="Task",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Required. Name of the task.",
                        max_length=255,
                    ),
                ),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        help_text="Description of the task.",
                        null=True,
                    ),
                ),
                (
                    "interval",
                    models.CharField(
                        default="1 0 0 0",
                        help_text="Required. Interval of the task. Format: d w m y.",
                        max_length=255,
                        validators=[app.models.task.validate_interval],
                    ),
                ),
                (
                    "last_done_date",
                    models.DateField(
                        blank=True,
                        help_text="Last date when the task has been done. It is the starting point for the interval. If not present, it will take the creation date.",
                        null=True,
                    ),
                ),
                (
                    "due_date",
                    models.DateField(
                        blank=True,
                        help_text="Due date of the task. Re-calculated when the last_done_date is updated.",
                        null=True,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True),
                ),
                (
                    "category",
                    models.ManyToManyField(to="app.category"),
                ),
            ],
        ),
    ]
