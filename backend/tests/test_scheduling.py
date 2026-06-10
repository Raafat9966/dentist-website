"""Unit tests for the scheduling service (no DB required)."""
import pytest
from datetime import time

from app.services.scheduling import (
    _time_to_minutes,
    _minutes_to_time,
    _slots_overlap,
    _generate_slots_for_day,
)
from app.models.availability_rule import AvailabilityRule
from app.schemas.availability import TimeSlot


def make_rule(open_h, open_m, close_h, close_m, lunch_start=None, lunch_end=None):
    return AvailabilityRule(
        day_of_week=0,
        open_time=time(open_h, open_m),
        close_time=time(close_h, close_m),
        lunch_start=time(*lunch_start) if lunch_start else None,
        lunch_end=time(*lunch_end) if lunch_end else None,
        is_active=True,
    )


def test_time_to_minutes():
    assert _time_to_minutes(time(9, 0)) == 540
    assert _time_to_minutes(time(13, 30)) == 810


def test_minutes_to_time():
    assert _minutes_to_time(540) == time(9, 0)
    assert _minutes_to_time(810) == time(13, 30)


def test_slots_overlap():
    assert _slots_overlap(60, 120, 90, 150) is True
    assert _slots_overlap(60, 120, 120, 180) is False  # touching is not overlap
    assert _slots_overlap(60, 120, 30, 61) is True


def test_generate_slots_no_conflicts():
    rule = make_rule(9, 0, 11, 0)
    slots = _generate_slots_for_day(rule, 60, 0, [], [])
    assert len(slots) == 2
    assert slots[0].start_time == "09:00"
    assert slots[1].start_time == "10:00"


def test_generate_slots_with_buffer():
    rule = make_rule(9, 0, 11, 0)
    slots = _generate_slots_for_day(rule, 45, 15, [], [])
    assert len(slots) == 2
    assert slots[0].start_time == "09:00"
    assert slots[1].start_time == "10:00"


def test_generate_slots_respects_booked():
    rule = make_rule(9, 0, 12, 0)
    # 9:00-10:00 is booked
    booked_ranges = [(_time_to_minutes(time(9, 0)), _time_to_minutes(time(10, 0)))]
    slots = _generate_slots_for_day(rule, 60, 0, [], booked_ranges)
    assert len(slots) == 2
    assert slots[0].start_time == "10:00"
    assert slots[1].start_time == "11:00"


def test_generate_slots_respects_lunch():
    rule = make_rule(9, 0, 15, 0, lunch_start=(13, 0), lunch_end=(14, 0))
    slots = _generate_slots_for_day(rule, 60, 0, [], [])
    times = [s.start_time for s in slots]
    assert "13:00" not in times
    assert "09:00" in times
    assert "14:00" in times
