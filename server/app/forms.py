from django.contrib.auth import forms

from .models import User


class UserCreationForm(forms.UserCreationForm):
    """User creation form for Django admin."""

    class Meta(forms.UserCreationForm.Meta):
        """Meta class to configure the form."""

        model = User
        fields = ("username", "email")


class UserChangeForm(forms.UserChangeForm):
    """User update form for Django admin."""

    class Meta(forms.UserChangeForm.Meta):
        """Meta class to configure the form."""

        model = User
        fields = ("username", "email")  # pyright: ignore[reportAssignmentType]
