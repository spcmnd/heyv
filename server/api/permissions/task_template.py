from api.permissions.base_access_control import AccessLevel, BaseAccessControl


class TaskTemplateAccessControl(BaseAccessControl):
    def access(self, request, view, level, obj=None):
        if level == AccessLevel.LEVEL_0:
            if request.user.is_authenticated:
                return True

            return self.not_allowed

        if level == AccessLevel.LEVEL_1:
            return self.not_concerned
