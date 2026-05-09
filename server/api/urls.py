from django.urls import path

from .views.auth import LoginAPIView
from .views.task import TaskListCreateAPIView

urlpatterns = [
    path("auth/login/", LoginAPIView.as_view(), name="api-auth-login"),
    path("task/", TaskListCreateAPIView.as_view(), name="api-task-list-create"),
]
