from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from api.permissions.task_template import TaskTemplateAccessControl
from api.serializers.task_template import TaskTemplateSerializer
from app.models import TaskTemplate


class TaskTemplateListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TaskTemplate.objects.all()


class TaskTemplateRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TaskTemplate.objects.all()


class TaskTemplateArchiveAPIView(generics.GenericAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TaskTemplate.objects.all()

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.archived_at = timezone.now()
        instance.save(update_fields=("is_active", "archived_at", "updated_at"))

        return Response(self.get_serializer(instance).data)


class TaskTemplateRestoreAPIView(generics.GenericAPIView):
    serializer_class = TaskTemplateSerializer
    permission_classes = (TaskTemplateAccessControl,)
    queryset = TaskTemplate.objects.all()

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = True
        instance.archived_at = None
        instance.save(update_fields=("is_active", "archived_at", "updated_at"))

        return Response(self.get_serializer(instance).data)
