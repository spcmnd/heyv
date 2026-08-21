from django.db.models.signals import post_save
from django.dispatch import receiver

from app.models import RecurrenceRule, TaskOccurrence, TaskTemplate
from app.services.task_occurrences import TaskOccurrenceService


@receiver(post_save, sender=TaskTemplate)
def sync_task_template_occurrences(sender, instance, **kwargs):
    """Create, purge, or realign occurrences when a task template is created, activated, restored, or updated."""

    if not instance.is_active:
        TaskOccurrenceService.purge_pending(instance)

        return

    TaskOccurrenceService.ensure_next_occurrence(instance, reschedule=True)


@receiver(post_save, sender=RecurrenceRule)
def sync_recurrence_rule_occurrences(sender, instance, **kwargs):
    """Realign the pending occurrence when a recurrence rule is updated."""

    task_template = getattr(instance, "task_template", None)

    if task_template is not None and task_template.is_active:
        TaskOccurrenceService.ensure_next_occurrence(task_template, reschedule=True)


@receiver(post_save, sender=TaskOccurrence)
def sync_next_task_occurrence(sender, instance, **kwargs):
    """Schedule the following occurrence once the current one is completed, skipped, or cancelled."""

    if instance.status != TaskOccurrence.Status.TODO:
        TaskOccurrenceService.ensure_next_occurrence(instance.task_template)
