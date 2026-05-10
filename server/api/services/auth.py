from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthService:
    @classmethod
    def get_tokens_for_user(cls, user):
        if not user.is_active:
            raise AuthenticationFailed("User is not active")

        refresh = RefreshToken.for_user(user)

        return {"access": str(refresh.access_token), "refresh": str(refresh)}
