from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UserChangeForm, UserCreationForm
from .models import Category, Task, User


class CustomUserAdmin(UserAdmin):
    """User admin class to configure how the user is displayed in Django admin."""

    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = [
        "email",
        "username",
        "is_staff",
        "is_active",
    ]


admin.site.register(User, CustomUserAdmin)


class CategoryAdmin(admin.ModelAdmin):
    fieldsets = [(None, {"fields": ["id", "name"]})]
    readonly_fields = ["id"]


admin.site.register(Category, CategoryAdmin)


class TaskAdmin(admin.ModelAdmin):
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "id",
                    "name",
                    "description",
                    "last_done_date",
                    "due_date",
                    "category",
                    "created_at",
                    "updated_at",
                ]
            },
        )
    ]
    readonly_fields = ["id", "created_at", "updated_at"]


admin.site.register(Task, TaskAdmin)
