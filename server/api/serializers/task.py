from rest_framework import serializers

from app.models.task import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            "id",
            "name",
            "description",
            "created_at",
            "due_date",
            "last_done_date",
            "interval",
        )
        read_only_fields = (
            "id",
            "due_date",
            "created_at",
        )
