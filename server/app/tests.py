from django.test import SimpleTestCase

from api.services.recurrence_rule import RecurrenceRuleService
from app.models import RecurrenceRule

DAILY = RecurrenceRule.Frequency.DAILY
WEEKLY = RecurrenceRule.Frequency.WEEKLY
MONTHLY = RecurrenceRule.Frequency.MONTHLY
YEARLY = RecurrenceRule.Frequency.YEARLY


class RecurrenceRuleServiceLabelTestCase(SimpleTestCase):
    def test_daily(self):
        self.assertEqual(self._label(frequency=DAILY, interval=1), "Every day")
        self.assertEqual(self._label(frequency=DAILY, interval=2), "Every 2 days")

    def test_weekly(self):
        self.assertEqual(self._label(frequency=WEEKLY, interval=1, weekdays=[1]), "Every week on Monday")
        self.assertEqual(
            self._label(frequency=WEEKLY, interval=2, weekdays=[1, 4]), "Every 2 weeks on Monday and Thursday"
        )
        self.assertEqual(
            self._label(frequency=WEEKLY, interval=1, weekdays=[1, 3, 5]),
            "Every week on Monday, Wednesday and Friday",
        )

    def test_monthly_with_day_of_month(self):
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=1), "Every month on the 1st")
        self.assertEqual(self._label(frequency=MONTHLY, interval=3, day_of_month=15), "Every 3 months on the 15th")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=2), "Every month on the 2nd")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=3), "Every month on the 3rd")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=11), "Every month on the 11th")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=21), "Every month on the 21st")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=22), "Every month on the 22nd")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1, day_of_month=31), "Every month on the 31st")

    def test_monthly_with_week_position(self):
        self.assertEqual(
            self._label(frequency=MONTHLY, interval=1, week_position=-1, weekdays=[5]),
            "Every month on the last Friday",
        )
        self.assertEqual(
            self._label(frequency=MONTHLY, interval=2, week_position=2, weekdays=[2]),
            "Every 2 months on the second Tuesday",
        )

    def test_yearly(self):
        self.assertEqual(self._label(frequency=YEARLY, interval=1, month=1), "Every year in January")
        self.assertEqual(
            self._label(frequency=YEARLY, interval=1, month=1, day_of_month=1), "Every year on January 1st"
        )
        self.assertEqual(
            self._label(frequency=YEARLY, interval=2, month=12, day_of_month=25),
            "Every 2 years on December 25th",
        )

    def test_missing_details_fall_back_to_base(self):
        self.assertEqual(self._label(frequency=WEEKLY, interval=1), "Every week")
        self.assertEqual(self._label(frequency=MONTHLY, interval=1), "Every month")
        self.assertEqual(self._label(frequency=YEARLY, interval=1), "Every year")

    @staticmethod
    def _label(**kwargs):
        return RecurrenceRuleService.build_label(RecurrenceRule(**kwargs))
