from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class UserCreationForm(UserCreationForm):
    """User creation form for Django admin."""

    class Meta:
        """Meta class to configure the form."""

        model = User
        fields = ("username", "email")


class UserChangeForm(UserChangeForm):
    """User update form for Django admin."""

    class Meta:
        """Meta class to configure the form."""

        model = User
        fields = ("username", "email")
