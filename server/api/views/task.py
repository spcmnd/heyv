from rest_framework import generics

from ..serializers.task import TaskSerializer


class TaskListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
