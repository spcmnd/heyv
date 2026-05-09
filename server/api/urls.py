from django.urls import path, re_path

from .views.auth import LoginAPIView
from .views.task import TaskListCreateAPIView
from .views.user import UserRetrieveAPIView

urlpatterns = [
    path("auth/login/", LoginAPIView.as_view(), name="api-auth-login"),
    path("task/", TaskListCreateAPIView.as_view(), name="api-task-list-create"),
    re_path(r"^user/(?P<pk>[0-9]+|me)/$", UserRetrieveAPIView.as_view(), name="api-user-retrieve"),
]
