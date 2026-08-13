from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from api.views.task_template import (
    TaskTemplateArchiveAPIView,
    TaskTemplateListCreateAPIView,
    TaskTemplateRestoreAPIView,
    TaskTemplateRetrieveUpdateAPIView,
)

from .views.auth import LoginAPIView
from .views.category import CategoryListCreateAPIView, CategoryRetrieveUpdateDestroyAPIView
from .views.room import RoomListCreateAPIView, RoomRetrieveUpdateDestroyAPIView
from .views.user import UserRetrieveAPIView

urlpatterns = [
    path("auth/login/", LoginAPIView.as_view(), name="api-auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="api-auth-refresh"),
    re_path(r"^user/(?P<pk>[0-9]+|me)/$", UserRetrieveAPIView.as_view(), name="api-user-retrieve"),
    path("rooms/", RoomListCreateAPIView.as_view(), name="api-room-list-create"),
    path("rooms/<int:pk>/", RoomRetrieveUpdateDestroyAPIView.as_view(), name="api-room-retrieve-update-destroy"),
    path("categories/", CategoryListCreateAPIView.as_view(), name="api-category-list-create"),
    path(
        "categories/<int:pk>/",
        CategoryRetrieveUpdateDestroyAPIView.as_view(),
        name="api-category-retrieve-update-destroy",
    ),
    path("task-templates/", TaskTemplateListCreateAPIView.as_view(), name="api-task-template-list-create"),
    path(
        "task-templates/<int:pk>/",
        TaskTemplateRetrieveUpdateAPIView.as_view(),
        name="api-task-template-retrieve-update",
    ),
    path(
        "task-templates/<int:pk>/archive/",
        TaskTemplateArchiveAPIView.as_view(),
        name="api-task-template-archive",
    ),
    path(
        "task-templates/<int:pk>/restore/",
        TaskTemplateRestoreAPIView.as_view(),
        name="api-task-template-restore",
    ),
]
