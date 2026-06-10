from datetime import date, time, datetime, timedelta
from typing import Optional
from sqlmodel import Session, select

from app.models.appointment import Appointment
from app.models.availability_rule import AvailabilityRule
from app.models.blocked_time import BlockedTime
from app.models.service import Service
from app.schemas.availability import TimeSlot, DayAvailability, AvailabilityResponse


def _time_to_minutes(t: time) -> int:
    return t.hour * 60 + t.minute


def _minutes_to_time(minutes: int) -> time:
    return time(hour=minutes // 60, minute=minutes % 60)


def _slots_overlap(s1_start: int, s1_end: int, s2_start: int, s2_end: int) -> bool:
    return s1_start < s2_end and s2_start < s1_end


def _generate_slots_for_day(
    rule: AvailabilityRule,
    duration: int,
    buffer: int,
    blocked_ranges: list[tuple[int, int]],
    booked_ranges: list[tuple[int, int]],
) -> list[TimeSlot]:
    """Generate all available time slots for a single day given the availability rule."""
    open_min = _time_to_minutes(rule.open_time)
    close_min = _time_to_minutes(rule.close_time)

    lunch_ranges: list[tuple[int, int]] = []
    if rule.lunch_start and rule.lunch_end:
        lunch_ranges.append((_time_to_minutes(rule.lunch_start), _time_to_minutes(rule.lunch_end)))

    unavailable = blocked_ranges + booked_ranges + lunch_ranges

    slots: list[TimeSlot] = []
    slot_start = open_min

    while slot_start + duration <= close_min:
        slot_end = slot_start + duration

        conflict = any(
            _slots_overlap(slot_start, slot_end, u_start, u_end)
            for u_start, u_end in unavailable
        )

        if not conflict:
            slots.append(
                TimeSlot(
                    date="",  # filled by caller
                    start_time=_minutes_to_time(slot_start).strftime("%H:%M"),
                    end_time=_minutes_to_time(slot_end).strftime("%H:%M"),
                    available=True,
                )
            )

        slot_start += duration + buffer

    return slots


def compute_availability(
    session: Session,
    service_id: int,
    start_date: date,
    end_date: date,
) -> AvailabilityResponse:
    service = session.get(Service, service_id)
    if not service:
        return AvailabilityResponse(service_id=service_id, days=[])

    duration = service.duration_minutes
    buffer = service.buffer_minutes

    rules = session.exec(
        select(AvailabilityRule).where(AvailabilityRule.is_active == True)
    ).all()
    rules_by_dow: dict[int, AvailabilityRule] = {r.day_of_week: r for r in rules}

    blocked_times = session.exec(
        select(BlockedTime).where(
            BlockedTime.blocked_date >= start_date,
            BlockedTime.blocked_date <= end_date,
        )
    ).all()
    blocked_by_date: dict[date, list[BlockedTime]] = {}
    for bt in blocked_times:
        blocked_by_date.setdefault(bt.blocked_date, []).append(bt)

    existing = session.exec(
        select(Appointment).where(
            Appointment.appointment_date >= start_date,
            Appointment.appointment_date <= end_date,
            Appointment.status != "cancelled",
        )
    ).all()
    booked_by_date: dict[date, list[Appointment]] = {}
    for appt in existing:
        booked_by_date.setdefault(appt.appointment_date, []).append(appt)

    days: list[DayAvailability] = []
    current = start_date
    while current <= end_date:
        dow = current.weekday()  # 0=Monday
        date_str = current.isoformat()

        rule = rules_by_dow.get(dow)
        if rule is None:
            days.append(DayAvailability(date=date_str, slots=[], has_availability=False))
            current += timedelta(days=1)
            continue

        day_blocked = blocked_by_date.get(current, [])
        # Full-day block
        if any(b.start_time is None and b.end_time is None for b in day_blocked):
            days.append(DayAvailability(date=date_str, slots=[], has_availability=False))
            current += timedelta(days=1)
            continue

        blocked_ranges = [
            (_time_to_minutes(b.start_time), _time_to_minutes(b.end_time))
            for b in day_blocked
            if b.start_time and b.end_time
        ]

        day_booked = booked_by_date.get(current, [])
        booked_ranges = [
            (_time_to_minutes(a.start_time), _time_to_minutes(a.end_time))
            for a in day_booked
        ]

        slots = _generate_slots_for_day(rule, duration, buffer, blocked_ranges, booked_ranges)
        for s in slots:
            s.date = date_str

        days.append(DayAvailability(date=date_str, slots=slots, has_availability=len(slots) > 0))
        current += timedelta(days=1)

    return AvailabilityResponse(service_id=service_id, days=days)


def validate_and_book(
    session: Session,
    full_name: str,
    email: str,
    phone: str,
    service_id: int,
    selected_date: str,
    selected_start_time: str,
    selected_end_time: str,
    notes: Optional[str],
) -> Appointment:
    """Validate the slot is still free (at save time) and create the appointment."""
    appt_date = date.fromisoformat(selected_date)
    start_t = time.fromisoformat(selected_start_time)
    end_t = time.fromisoformat(selected_end_time)

    # Revalidate: check for any conflicting confirmed appointments
    conflicts = session.exec(
        select(Appointment).where(
            Appointment.appointment_date == appt_date,
            Appointment.status != "cancelled",
            Appointment.start_time < end_t,
            Appointment.end_time > start_t,
        )
    ).first()

    if conflicts:
        raise ValueError("This time slot is no longer available. Please choose another.")

    # Verify slot is within working hours and not blocked
    dow = appt_date.weekday()
    rule = session.exec(
        select(AvailabilityRule).where(
            AvailabilityRule.day_of_week == dow,
            AvailabilityRule.is_active == True,
        )
    ).first()

    if not rule:
        raise ValueError("The clinic is not open on this day.")

    start_min = _time_to_minutes(start_t)
    end_min = _time_to_minutes(end_t)
    open_min = _time_to_minutes(rule.open_time)
    close_min = _time_to_minutes(rule.close_time)

    if start_min < open_min or end_min > close_min:
        raise ValueError("The selected time is outside clinic working hours.")

    if rule.lunch_start and rule.lunch_end:
        lunch_start_min = _time_to_minutes(rule.lunch_start)
        lunch_end_min = _time_to_minutes(rule.lunch_end)
        if _slots_overlap(start_min, end_min, lunch_start_min, lunch_end_min):
            raise ValueError("The selected time overlaps with the lunch break.")

    # Check blocked times
    full_day_block = session.exec(
        select(BlockedTime).where(
            BlockedTime.blocked_date == appt_date,
            BlockedTime.start_time == None,
        )
    ).first()
    if full_day_block:
        raise ValueError("The clinic is not available on this date.")

    partial_block = session.exec(
        select(BlockedTime).where(
            BlockedTime.blocked_date == appt_date,
            BlockedTime.start_time != None,
            BlockedTime.start_time < end_t,
            BlockedTime.end_time > start_t,
        )
    ).first()
    if partial_block:
        raise ValueError("This time slot is blocked by the clinic.")

    appointment = Appointment(
        full_name=full_name,
        email=email,
        phone=phone,
        service_id=service_id,
        appointment_date=appt_date,
        start_time=start_t,
        end_time=end_t,
        notes=notes,
        status="confirmed",
    )
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment
