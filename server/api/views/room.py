from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from app.models import Room

from ..serializers.room import RoomSerializer


class RoomListCreateAPIView(ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class RoomRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer