from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255, help_text="Required. Name of the category.")

    class Meta:
        verbose_name_plural = "categories"
