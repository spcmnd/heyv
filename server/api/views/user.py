from rest_framework.generics import RetrieveAPIView

from ..serializers.user import UserSerializer


class UserRetrieveAPIView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        if self.kwargs["pk"] == "me":
            return self.request.user

        return super().get_object()
