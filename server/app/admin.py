from typing import Any

from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.core.exceptions import ValidationError
from django.http import HttpRequest

from .forms import UserChangeForm, UserCreationForm
from .models import Category, RecurrenceRule, Room, TaskOccurrence, TaskTemplate, User

WEEKDAY_CHOICES = [
    (1, "Monday"),
    (2, "Tuesday"),
    (3, "Wednesday"),
    (4, "Thursday"),
    (5, "Friday"),
    (6, "Saturday"),
    (7, "Sunday"),
]


class TaskTemplateAdminForm(forms.ModelForm):
    """Task template admin form including the recurrence rule fields."""

    recurrence_frequency = forms.ChoiceField(
        label="Frequency",
        choices=[("", "---------"), *RecurrenceRule.Frequency.choices],
        required=False,
        help_text="How often the task recurs.",
    )
    recurrence_interval = forms.IntegerField(
        label="Interval",
        min_value=1,
        initial=1,
        required=False,
        help_text="Repeat every N days, weeks, months or years depending on the frequency.",
    )
    recurrence_weekdays = forms.MultipleChoiceField(
        label="Weekdays",
        choices=WEEKDAY_CHOICES,
        required=False,
        widget=forms.CheckboxSelectMultiple,
        help_text="Required for WEEKLY. Combined with week position for MONTHLY.",
    )
    recurrence_day_of_month = forms.IntegerField(
        label="Day of month",
        min_value=1,
        max_value=31,
        required=False,
        help_text="For MONTHLY: day of the month (1-31).",
    )
    recurrence_week_position = forms.IntegerField(
        label="Week position",
        min_value=-1,
        max_value=4,
        required=False,
        help_text="For MONTHLY: occurrence within the month (-1 for last, 1 to 4 otherwise).",
    )
    recurrence_month = forms.IntegerField(
        label="Month",
        min_value=1,
        max_value=12,
        required=False,
        help_text="Required for YEARLY.",
    )
    recurrence_start_date = forms.DateField(label="Start date", required=False)
    recurrence_end_date = forms.DateField(label="End date", required=False)

    class Meta:
        model = TaskTemplate
        fields = "__all__"

    def __init__(self, *args: Any, **kwargs: Any):
        """Initialize the form and populate the recurrence rule fields from the instance."""
        super().__init__(*args, **kwargs)

        rule = self.instance.recurrence_rule if self.instance and self.instance.pk else None
        if rule:
            self.fields["recurrence_frequency"].initial = rule.frequency
            self.fields["recurrence_interval"].initial = rule.interval
            self.fields["recurrence_weekdays"].initial = [str(day) for day in (rule.weekdays or [])]
            self.fields["recurrence_day_of_month"].initial = rule.day_of_month
            self.fields["recurrence_week_position"].initial = rule.week_position
            self.fields["recurrence_month"].initial = rule.month
            self.fields["recurrence_start_date"].initial = rule.start_date
            self.fields["recurrence_end_date"].initial = rule.end_date

    def clean(self) -> dict[str, Any] | None:
        cleaned_data = super().clean()
        if not cleaned_data:
            return cleaned_data

        frequency = cleaned_data.get("recurrence_frequency")
        if not frequency:
            return cleaned_data

        rule = RecurrenceRule(
            frequency=frequency,
            interval=cleaned_data.get("recurrence_interval") or 1,
            weekdays=[int(day) for day in cleaned_data.get("recurrence_weekdays") or []],
            day_of_month=cleaned_data.get("recurrence_day_of_month"),
            week_position=cleaned_data.get("recurrence_week_position"),
            month=cleaned_data.get("recurrence_month"),
            start_date=cleaned_data.get("recurrence_start_date"),
            end_date=cleaned_data.get("recurrence_end_date"),
        )

        try:
            rule.clean()
        except ValidationError as exc:
            error_dict = exc.message_dict if hasattr(exc, "message_dict") else {None: exc.messages}
            for field_name, messages in error_dict.items():
                form_field = f"recurrence_{field_name}" if field_name in RecurrenceRule._meta.fields_map else None
                if form_field and form_field in self.fields:
                    self.add_error(form_field, messages)
                else:
                    self.add_error(None, messages)

        return cleaned_data


class CustomUserAdmin(UserAdmin):
    """User admin class to configure how the user is displayed in Django admin."""

    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = [
        "email",
        "username",
        "is_staff",
        "is_active",
    ]


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    """Room admin class to configure how the room is displayed in Django admin."""

    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Category admin class to configure how the category is displayed in Django admin."""

    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(TaskTemplate)
class TaskTemplateAdmin(admin.ModelAdmin):
    """Task template admin class to configure how the task template is displayed in Django admin."""

    form = TaskTemplateAdminForm
    list_display = ["title", "room", "priority", "is_active", "has_recurrence_rule", "created_by", "created_at"]
    list_filter = ["priority", "is_active", "room", "category"]
    search_fields = ["title", "description"]
    autocomplete_fields = ["room", "created_by"]
    filter_horizontal = ["category"]
    readonly_fields = ["created_at", "updated_at"]
    list_select_related = ["room", "created_by", "recurrence_rule"]
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "title",
                    "description",
                    "category",
                    "room",
                    "priority",
                    "estimated_duration_minutes",
                    "is_active",
                ),
            },
        ),
        (
            "Recurrence rule",
            {
                "fields": (
                    "recurrence_frequency",
                    "recurrence_interval",
                    "recurrence_weekdays",
                    "recurrence_day_of_month",
                    "recurrence_week_position",
                    "recurrence_month",
                    "recurrence_start_date",
                    "recurrence_end_date",
                ),
            },
        ),
        (
            "Metadata",
            {
                "fields": ("created_by", "created_at", "updated_at", "archived_at"),
            },
        ),
    ]

    @admin.display(boolean=True, description="Recurring")
    def has_recurrence_rule(self, obj: TaskTemplate) -> bool:
        return obj.recurrence_rule is not None

    def save_model(self, request: HttpRequest, obj: TaskTemplate, form: Any, change: Any) -> None:
        if not change and obj.created_by is None:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def save_related(self, request: HttpRequest, form: TaskTemplateAdminForm, formsets: Any, change: Any) -> None:
        super().save_related(request, form, formsets, change)

        cleaned_data = form.cleaned_data
        template = form.instance

        frequency = cleaned_data.get("recurrence_frequency")
        if not frequency:
            existing_rule = template.recurrence_rule
            if existing_rule is not None:
                existing_rule.delete()
                template.recurrence_rule = None
            return

        rule = template.recurrence_rule or RecurrenceRule()
        rule.frequency = frequency
        rule.interval = cleaned_data.get("recurrence_interval") or 1
        rule.weekdays = [int(day) for day in cleaned_data.get("recurrence_weekdays") or []]
        rule.day_of_month = cleaned_data.get("recurrence_day_of_month")
        rule.week_position = cleaned_data.get("recurrence_week_position")
        rule.month = cleaned_data.get("recurrence_month")
        rule.start_date = cleaned_data.get("recurrence_start_date")
        rule.end_date = cleaned_data.get("recurrence_end_date")
        rule.save()

        template.recurrence_rule = rule
        template.save(update_fields=["recurrence_rule"])


@admin.register(TaskOccurrence)
class TaskOccurrenceAdmin(admin.ModelAdmin):
    """Task occurrence admin class to configure how the task occurrence is displayed in Django admin."""

    list_display = [
        "task_template",
        "scheduled_for",
        "status",
        "completed_at",
        "completed_by",
        "actual_duration_minutes",
    ]
    list_filter = ["status"]
    search_fields = ["task_template__title", "notes"]
    autocomplete_fields = ["task_template", "completed_by"]
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "scheduled_for"
    list_select_related = ["task_template", "completed_by"]


admin.site.register(User, CustomUserAdmin)
