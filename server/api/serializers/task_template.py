from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from app.models import Category, RecurrenceRule, Room, TaskTemplate


class NestedRecurrenceRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurrenceRule
        fields = (
            "frequency",
            "interval",
            "weekdays",
            "day_of_month",
            "week_position",
            "month",
            "start_date",
            "end_date",
        )


class TaskTemplateSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all(), many=True, required=False
    )
    room = serializers.SlugRelatedField(slug_field="name", queryset=Room.objects.all(), required=False, allow_null=True)
    recurrence_rule = NestedRecurrenceRuleSerializer(required=False, allow_null=True)
    created_by = serializers.SlugRelatedField(slug_field="username", read_only=True)

    class Meta:
        model = TaskTemplate
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "estimated_duration_minutes",
            "is_active",
            "recurrence_rule",
            "room",
            "category",
            "created_by",
            "created_at",
            "updated_at",
            "archived_at",
        )
        read_only_fields = (
            "created_by",
            "created_at",
            "updated_at",
            "archived_at",
            "is_active",
        )

    def create(self, validated_data):
        recurrence_rule_data = validated_data.pop("recurrence_rule", None)
        categories = validated_data.pop("category", [])
        if recurrence_rule_data:
            recurrence_rule = RecurrenceRule(**recurrence_rule_data)
            self._validate_recurrence_rule(recurrence_rule)
            recurrence_rule.save()
        else:
            recurrence_rule = None
        validated_data["created_by"] = self.context["request"].user

        task_template = TaskTemplate.objects.create(recurrence_rule=recurrence_rule, **validated_data)
        task_template.category.set(categories)

        return task_template

    def update(self, instance, validated_data):
        if "recurrence_rule" in validated_data:
            recurrence_rule_data = validated_data.pop("recurrence_rule")

            if not recurrence_rule_data:
                if instance.recurrence_rule:
                    instance.recurrence_rule.delete()
                    instance.recurrence_rule = None
            elif instance.recurrence_rule:
                for key, value in recurrence_rule_data.items():
                    setattr(instance.recurrence_rule, key, value)

                self._validate_recurrence_rule(instance.recurrence_rule)
                instance.recurrence_rule.save()
            else:
                instance.recurrence_rule = RecurrenceRule(**recurrence_rule_data)
                self._validate_recurrence_rule(instance.recurrence_rule)
                instance.recurrence_rule.save()

        return super().update(instance, validated_data)

    def _validate_recurrence_rule(self, recurrence_rule):
        try:
            recurrence_rule.full_clean(exclude=("created_at", "updated_at"))
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"recurrence_rule": exc.message_dict}) from exc
