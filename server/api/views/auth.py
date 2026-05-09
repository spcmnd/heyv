from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_401_UNAUTHORIZED
from rest_framework.views import APIView

from ..serializers.auth import LoginSerializer


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = authenticate(
                request=request,
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"],
            )

            if user:
                login(request=request, user=user)

                return Response(data={"success": True}, status=HTTP_200_OK)
            else:
                return Response(data={"error": "Username or password is invalid."}, status=HTTP_401_UNAUTHORIZED)
        else:
            return Response(data={"error": "Username or password is invalid."}, status=HTTP_401_UNAUTHORIZED)
