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
        date_from = self.request.query_params.get("from")
        date_to = self.request.query_params.get("to")

        if task_template is not None:
            queryset = queryset.filter(task_template_id=task_template)

        if status is not None:
            queryset = queryset.filter(status=status)

            if status == TaskOccurrence.Status.COMPLETED:
                queryset = queryset.order_by("-completed_at")

        if date_from is not None:
            queryset = queryset.filter(scheduled_for__date__gte=date_from)

        if date_to is not None:
            queryset = queryset.filter(scheduled_for__date__lte=date_to)

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
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            status=TaskOccurrence.Status.COMPLETED,
            completed_at=timezone.now(),
            completed_by=request.user,
        )

        return Response(serializer.data)
