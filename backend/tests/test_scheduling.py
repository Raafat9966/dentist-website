"""Unit tests for scheduling helpers — no DB required."""
import pytest
from datetime import time

from app.services.scheduling import (
    _time_to_minutes,
    _minutes_to_time,
    _slots_overlap,
    _generate_slots_for_day,
)
from app.models.availability_rule import AvailabilityRule


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_rule(open_h, open_m, close_h, close_m, lunch_start=None, lunch_end=None, day=0):
    return AvailabilityRule(
        day_of_week=day,
        open_time=time(open_h, open_m),
        close_time=time(close_h, close_m),
        lunch_start=time(*lunch_start) if lunch_start else None,
        lunch_end=time(*lunch_end) if lunch_end else None,
        is_active=True,
    )


# ---------------------------------------------------------------------------
# _time_to_minutes
# ---------------------------------------------------------------------------

class TestTimeToMinutes:
    def test_midnight(self):
        assert _time_to_minutes(time(0, 0)) == 0

    def test_nine_am(self):
        assert _time_to_minutes(time(9, 0)) == 540

    def test_noon(self):
        assert _time_to_minutes(time(12, 0)) == 720

    def test_half_past_one(self):
        assert _time_to_minutes(time(13, 30)) == 810

    def test_end_of_day(self):
        assert _time_to_minutes(time(20, 0)) == 1200

    @pytest.mark.parametrize("h,m,expected", [
        (0, 1, 1),
        (1, 0, 60),
        (23, 59, 1439),
    ])
    def test_parametrized(self, h, m, expected):
        assert _time_to_minutes(time(h, m)) == expected


# ---------------------------------------------------------------------------
# _minutes_to_time
# ---------------------------------------------------------------------------

class TestMinutesToTime:
    def test_midnight(self):
        assert _minutes_to_time(0) == time(0, 0)

    def test_nine_am(self):
        assert _minutes_to_time(540) == time(9, 0)

    def test_half_past_one(self):
        assert _minutes_to_time(810) == time(13, 30)

    def test_roundtrip(self):
        for h in range(0, 24):
            for m in [0, 15, 30, 45]:
                t = time(h, m)
                assert _minutes_to_time(_time_to_minutes(t)) == t


# ---------------------------------------------------------------------------
# _slots_overlap
# ---------------------------------------------------------------------------

class TestSlotsOverlap:
    def test_no_overlap_disjoint(self):
        assert _slots_overlap(0, 60, 120, 180) is False

    def test_touching_not_overlap(self):
        # end of first == start of second — open interval, NOT overlapping
        assert _slots_overlap(60, 120, 120, 180) is False

    def test_partial_overlap_start(self):
        assert _slots_overlap(60, 120, 30, 61) is True

    def test_partial_overlap_end(self):
        assert _slots_overlap(60, 120, 90, 150) is True

    def test_contained_within(self):
        assert _slots_overlap(60, 120, 70, 80) is True

    def test_containing(self):
        assert _slots_overlap(70, 80, 60, 120) is True

    def test_identical(self):
        assert _slots_overlap(60, 120, 60, 120) is True

    def test_zero_length_slot_at_start(self):
        # zero-length range at the start boundary should not overlap
        assert _slots_overlap(60, 120, 60, 60) is False


# ---------------------------------------------------------------------------
# _generate_slots_for_day
# ---------------------------------------------------------------------------

class TestGenerateSlotsForDay:
    def test_simple_two_slots(self):
        rule = make_rule(9, 0, 11, 0)
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        assert len(slots) == 2
        assert slots[0].start_time == "09:00"
        assert slots[0].end_time == "10:00"
        assert slots[1].start_time == "10:00"
        assert slots[1].end_time == "11:00"

    def test_all_slots_available_true(self):
        rule = make_rule(9, 0, 10, 0)
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        assert all(s.available is True for s in slots)

    def test_date_field_empty_string(self):
        # date is filled by the caller; helper sets it to ""
        rule = make_rule(9, 0, 10, 0)
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        assert all(s.date == "" for s in slots)

    def test_with_buffer(self):
        # 45 min slot + 15 min buffer = 60 min stride → 2 slots in 2 h window
        rule = make_rule(9, 0, 11, 0)
        slots = _generate_slots_for_day(rule, 45, 15, [], [])
        assert len(slots) == 2
        assert slots[0].start_time == "09:00"
        assert slots[1].start_time == "10:00"

    def test_buffer_reduces_slot_count(self):
        # Without buffer: 6 slots in 3 h at 30 min each
        rule = make_rule(9, 0, 12, 0)
        without_buffer = _generate_slots_for_day(rule, 30, 0, [], [])
        with_buffer = _generate_slots_for_day(rule, 30, 15, [], [])
        assert len(without_buffer) > len(with_buffer)

    def test_slot_that_exactly_fills_window(self):
        rule = make_rule(9, 0, 10, 0)
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        assert len(slots) == 1

    def test_slot_too_long_for_window(self):
        rule = make_rule(9, 0, 9, 30)
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        assert slots == []

    def test_booked_range_removes_slot(self):
        rule = make_rule(9, 0, 12, 0)
        booked = [(_time_to_minutes(time(9, 0)), _time_to_minutes(time(10, 0)))]
        slots = _generate_slots_for_day(rule, 60, 0, [], booked)
        times = [s.start_time for s in slots]
        assert "09:00" not in times
        assert "10:00" in times
        assert "11:00" in times

    def test_blocked_range_removes_slot(self):
        rule = make_rule(9, 0, 12, 0)
        blocked = [(_time_to_minutes(time(10, 0)), _time_to_minutes(time(11, 0)))]
        slots = _generate_slots_for_day(rule, 60, 0, blocked, [])
        times = [s.start_time for s in slots]
        assert "10:00" not in times

    def test_lunch_break_excluded(self):
        rule = make_rule(9, 0, 15, 0, lunch_start=(13, 0), lunch_end=(14, 0))
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        times = [s.start_time for s in slots]
        assert "13:00" not in times
        assert "09:00" in times
        assert "14:00" in times

    def test_monday_real_hours(self):
        # Mon: 09:00-12:00 / 14:00-18:00 (lunch 12-14)
        rule = make_rule(9, 0, 18, 0, lunch_start=(12, 0), lunch_end=(14, 0))
        slots = _generate_slots_for_day(rule, 45, 15, [], [])
        times = [s.start_time for s in slots]
        assert "12:00" not in times  # inside lunch
        assert "12:30" not in times
        assert "13:00" not in times
        assert "09:00" in times
        assert "14:00" in times

    def test_thursday_real_hours(self):
        # Thu: 09:00-12:00 / 15:00-20:00 (long lunch 12-15)
        rule = make_rule(9, 0, 20, 0, lunch_start=(12, 0), lunch_end=(15, 0))
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        times = [s.start_time for s in slots]
        assert "12:00" not in times
        assert "13:00" not in times
        assert "14:00" not in times
        assert "15:00" in times
        assert "19:00" in times  # last slot fitting before 20:00

    def test_tuesday_morning_only(self):
        # Tue: 09:00-14:00 (no lunch)
        rule = make_rule(9, 0, 14, 0)
        slots = _generate_slots_for_day(rule, 60, 0, [], [])
        times = [s.start_time for s in slots]
        assert times == ["09:00", "10:00", "11:00", "12:00", "13:00"]

    def test_multiple_booked_slots(self):
        rule = make_rule(9, 0, 12, 0)
        booked = [
            (540, 600),  # 09:00-10:00
            (660, 720),  # 11:00-12:00
        ]
        slots = _generate_slots_for_day(rule, 60, 0, [], booked)
        assert len(slots) == 1
        assert slots[0].start_time == "10:00"
