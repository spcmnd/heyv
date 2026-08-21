from datetime import datetime

from django.db import IntegrityError, transaction
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
        """Make sure an active task template has a pending upcoming occurrence matching its schedule."""

        if not task_template.is_active:
            return

        next_date = cls._next_scheduled_for(task_template)

        if next_date is None:
            # An exhausted recurrence rule leaves any pending occurrence stale, so drop it.
            # Templates without a rule are one-shot: their pending occurrence must be kept.
            if reschedule and task_template.recurrence_rule is not None:
                occurrence = cls._pending_occurrence(task_template)

                if occurrence is not None:
                    occurrence.delete()

            return

        occurrence = cls._pending_occurrence(task_template)

        if occurrence is None:
            try:
                with transaction.atomic():
                    TaskOccurrence.objects.create(task_template=task_template, scheduled_for=next_date)
            except IntegrityError:
                # Lost a race against a concurrent request that created the pending occurrence.
                pass

            return

        if reschedule and occurrence.scheduled_for != next_date:
            occurrence.scheduled_for = next_date
            occurrence.save(update_fields=("scheduled_for", "updated_at"))

    @classmethod
    def purge_pending(cls, task_template):
        """Delete every pending occurrence of the task template, keeping terminal ones as history."""

        task_template.occurrences.filter(status=TaskOccurrence.Status.TODO).delete()

    @classmethod
    def _next_scheduled_for(cls, task_template):
        rule = task_template.recurrence_rule

        if rule is None:
            if task_template.occurrences.exists():
                return None

            anchor = timezone.now()

            return timezone.make_aware(datetime.combine(anchor.date(), MIDNIGHT))

        return RecurrenceService.next_recurrence_date(rule, cls._anchor(task_template))

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
        return task_template.occurrences.filter(status=TaskOccurrence.Status.TODO).order_by("scheduled_for").first()
