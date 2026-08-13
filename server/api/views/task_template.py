from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from api.permissions.task_template import TaskTemplateAccessControl
from api.serializers.task_template import TaskTemplateSerializer
from app.models import TaskTemplate

TASK_TEMPLATE_QUERYSET = TaskTemplate.objects.select_related("created_by", "room", "recurrence_rule").prefetch_related(
    "category"
)


class TaskTemplateListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TASK_TEMPLATE_QUERYSET

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get("is_active")

        if is_active is not None:
            if is_active.lower() in ("true", "1"):
                queryset = queryset.filter(is_active=True)
            elif is_active.lower() in ("false", "0"):
                queryset = queryset.filter(is_active=False)

        return queryset


class TaskTemplateRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TASK_TEMPLATE_QUERYSET


class TaskTemplateArchiveAPIView(generics.GenericAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TASK_TEMPLATE_QUERYSET

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.archived_at = timezone.now()
        instance.save(update_fields=("is_active", "archived_at", "updated_at"))

        return Response(self.get_serializer(instance).data)


class TaskTemplateRestoreAPIView(generics.GenericAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TASK_TEMPLATE_QUERYSET

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = True
        instance.archived_at = None
        instance.save(update_fields=("is_active", "archived_at", "updated_at"))

        return Response(self.get_serializer(instance).data)
