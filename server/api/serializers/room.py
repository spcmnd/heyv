from rest_framework import serializers

from app.models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("id", "name", "created_at", "updated_at")