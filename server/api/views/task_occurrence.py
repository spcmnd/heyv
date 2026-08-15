from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from api.permissions.task_occurrence import TaskOccurrenceAccessControl
from api.serializers.task_occurrence import TaskOccurrenceSerializer
from app.models import TaskOccurrence

TASK_OCCURRENCE_QUERYSET = TaskOccurrence.objects.select_related(
    "task_template",
    "task_template__room",
    "task_template__created_by",
    "completed_by",
)


class TaskOccurrenceListAPIView(generics.ListAPIView):
    serializer_class = TaskOccurrenceSerializer
    permission_classes = (TaskOccurrenceAccessControl,)
    queryset = TASK_OCCURRENCE_QUERYSET

    def get_queryset(self):
        queryset = super().get_queryset()
        task_template = self.request.query_params.get("task_template")

        status = self.request.query_params.get("status")

        if task_template is not None:
            queryset = queryset.filter(task_template_id=task_template)

        if status is not None:
            queryset = queryset.filter(status=status)

        return queryset


class TaskOccurrenceRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = TaskOccurrenceSerializer
    permission_classes = (TaskOccurrenceAccessControl,)
    queryset = TASK_OCCURRENCE_QUERYSET


class TaskOccurrenceCompleteAPIView(generics.GenericAPIView):
    serializer_class = TaskOccurrenceSerializer
    permission_classes = (TaskOccurrenceAccessControl,)
    queryset = TASK_OCCURRENCE_QUERYSET

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = TaskOccurrence.Status.COMPLETED
        instance.completed_at = timezone.now()
        instance.completed_by = request.user
        instance.save(update_fields=("status", "completed_at", "completed_by", "updated_at"))

        return Response(self.get_serializer(instance).data)
