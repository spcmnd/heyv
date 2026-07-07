from rest_framework import generics

from app.models.task import Task

from ..serializers.task import TaskSerializer


class TaskListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.recalculate_due_date()
        instance.save(update_fields=["due_date"])


class TaskRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def perform_update(self, serializer):
        old_last_done_date = serializer.instance.last_done_date
        instance = serializer.save()

        if old_last_done_date != instance.last_done_date:
            instance.recalculate_due_date()
            instance.save(update_fields=["due_date"])
