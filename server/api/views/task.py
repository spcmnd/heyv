from rest_framework import generics

from app.models.task import Task

from ..serializers.task import TaskSerializer


class TaskListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class TaskRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def perform_update(self, serializer):
        instance = serializer.instance
        old_last_done_date = instance.last_done_date

        if old_last_done_date != instance.last_done_date:
            instance.recalculate_due_date()

        instance = serializer.save()
