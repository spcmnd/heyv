from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_401_UNAUTHORIZED
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from ..serializers.auth import LoginSerializer
from ..services.auth import AuthService


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        error_response = Response(data={"error": "Username or password is invalid."}, status=HTTP_401_UNAUTHORIZED)

        if not serializer.is_valid():
            return error_response

        user = authenticate(
            request=request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if not user:
            return error_response

        try:
            tokens = AuthService.get_tokens_for_user(user)

            return Response(data=tokens, status=HTTP_200_OK)
        except AuthenticationFailed:
            return error_response
