from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

# Refactor notes:
#
# TaskTemplate will be the central point.
# TaskOccurrence will be the actual entity listed in the UI. It represents the execution, with due date,
# with who did it. His status will be updated and kept like that. A new TaskOccurrence will be created after
# the last one was done.
# RecurrenceRule will be the recurrence engine for recurring tasks.
