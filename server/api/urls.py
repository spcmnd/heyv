from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from .views.auth import LoginAPIView
from .views.user import UserRetrieveAPIView

urlpatterns = [
    path("auth/login/", LoginAPIView.as_view(), name="api-auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="api-auth-refresh"),
    re_path(r"^user/(?P<pk>[0-9]+|me)/$", UserRetrieveAPIView.as_view(), name="api-user-retrieve"),
]
