from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UserChangeForm, UserCreationForm
from .models import User


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
