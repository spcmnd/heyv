from rest_framework import serializers

from api.services.recurrence_rule import RecurrenceRuleService
from app.models import TaskOccurrence, TaskTemplate


class NestedTaskTemplateSerializer(serializers.ModelSerializer):
    room = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = TaskTemplate
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "room",
            "estimated_duration_minutes",
        )


class TaskOccurrenceSerializer(serializers.ModelSerializer):
    task = NestedTaskTemplateSerializer(source="task_template")
    completed_by = serializers.SlugRelatedField(slug_field="username", read_only=True)
    recurrence_label = serializers.SerializerMethodField()

    class Meta:
        model = TaskOccurrence
        fields = (
            "id",
            "scheduled_for",
            "recurrence_label",
            "status",
            "task",
            "completed_at",
            "completed_by",
            "actual_duration_minutes",
            "notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "task",
            "scheduled_for",
            "status",
            "completed_at",
            "completed_by",
            "created_at",
            "updated_at",
        )

    def get_recurrence_label(self, obj):
        rule = obj.task_template.recurrence_rule

        if rule is None:
            return ""

        return RecurrenceRuleService.build_label(rule)
