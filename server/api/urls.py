from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from .views.auth import LoginAPIView
from .views.category import CategoryListCreateAPIView, CategoryRetrieveUpdateDestroyAPIView
from .views.task import TaskListCreateAPIView, TaskRetrieveUpdateDestroyAPIView
from .views.user import UserRetrieveAPIView

urlpatterns = [
    path("category/", CategoryListCreateAPIView.as_view(), name="api-category-list-create"),
    path(
        "category/<int:pk>/",
        CategoryRetrieveUpdateDestroyAPIView.as_view(),
        name="api-category-retrieve-update-destroy",
    ),
    path("auth/login/", LoginAPIView.as_view(), name="api-auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="api-auth-refresh"),
    path("task/", TaskListCreateAPIView.as_view(), name="api-task-list-create"),
    path("task/<int:pk>/", TaskRetrieveUpdateDestroyAPIView.as_view(), name="api-task-retrieve-update-destroy"),
    re_path(r"^user/(?P<pk>[0-9]+|me)/$", UserRetrieveAPIView.as_view(), name="api-user-retrieve"),
]
