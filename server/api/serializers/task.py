from rest_framework import serializers

from app.models.category import Category
from app.models.task import Task


class TaskSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="name", many=True, queryset=Category.objects.all())

    class Meta:
        model = Task
        fields = ("id", "name", "description", "created_at", "due_date", "last_done_date", "interval", "category")
        read_only_fields = (
            "id",
            "due_date",
            "created_at",
        )
