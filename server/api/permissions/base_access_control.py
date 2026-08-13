from enum import Enum

from rest_framework.permissions import BasePermission


class AccessLevel(Enum):
    LEVEL_0 = "level_0"
    LEVEL_1 = "level_1"


class BaseAccessControl(BasePermission):
    not_concerned = True
    not_allowed = False

    def has_permission(self, request, view):
        return self.access(
            request=request,
            view=view,
            level=AccessLevel.LEVEL_0,
        )

    def has_object_permission(self, request, view, obj):
        return self.access(
            request=request,
            view=view,
            obj=obj,
            level=AccessLevel.LEVEL_1,
        )

    def access(self, request, view, level, obj=None):
        raise NotImplementedError
