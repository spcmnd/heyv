from datetime import datetime

from django.utils import timezone

from app.models import TaskOccurrence
from app.services.recurrence_rule import MIDNIGHT, RecurrenceService


class TaskOccurrenceService:
    """Keep TaskOccurrences synchronized with their TaskTemplate."""

    TERMINAL_STATUSES = (
        TaskOccurrence.Status.COMPLETED,
        TaskOccurrence.Status.SKIPPED,
        TaskOccurrence.Status.CANCELLED,
    )

    @classmethod
    def ensure_next_occurrence(cls, task_template, reschedule=False):
        """Make sure an active task template has a pending upcoming occurrence."""

        if not task_template.is_active:
            return

        next_date = cls._next_scheduled_for(task_template)

        if next_date is None:
            return

        occurrence = cls._pending_occurrence(task_template)

        if occurrence is None:
            TaskOccurrence.objects.create(task_template=task_template, scheduled_for=next_date)

            return

        if reschedule and occurrence.scheduled_for != next_date:
            occurrence.scheduled_for = next_date
            occurrence.save(update_fields=("scheduled_for", "updated_at"))

    @classmethod
    def purge_pending(cls, task_template):
        """Delete every non-completed occurrence of the task template."""

        task_template.occurrences.exclude(status=TaskOccurrence.Status.COMPLETED).delete()

    @classmethod
    def _next_scheduled_for(cls, task_template):
        rule = task_template.recurrence_rule
        anchor = cls._anchor(task_template)

        if rule is None:
            if task_template.occurrences.exists():
                return None

            return timezone.make_aware(datetime.combine(anchor.date(), MIDNIGHT))

        return RecurrenceService.next_recurrence_date(rule, anchor)

    @classmethod
    def _anchor(cls, task_template):
        last_terminal = (
            task_template.occurrences.filter(status__in=cls.TERMINAL_STATUSES).order_by("-scheduled_for").first()
        )

        if last_terminal is None:
            return timezone.now()

        return max(last_terminal.scheduled_for, timezone.now())

    @classmethod
    def _pending_occurrence(cls, task_template):
        return task_template.occurrences.filter(status=TaskOccurrence.Status.TODO).first()
