"""Integration tests for validate_and_book and compute_availability using SQLite in-memory."""
import pytest
from datetime import time, date
from sqlmodel import SQLModel, create_engine, Session

from app.models.appointment import Appointment
from app.models.availability_rule import AvailabilityRule
from app.models.blocked_time import BlockedTime
from app.models.service import Service
from app.models.clinic_settings import ClinicSettings
from app.services.scheduling import validate_and_book, compute_availability


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="service")
def service_fixture(session: Session) -> Service:
    svc = Service(
        name="Prophylaxis",
        description="Cleaning",
        duration_minutes=45,
        buffer_minutes=15,
        price_from=8900,
        icon="sparkles",
    )
    session.add(svc)
    session.commit()
    session.refresh(svc)
    return svc


@pytest.fixture(name="monday_rule")
def monday_rule_fixture(session: Session) -> AvailabilityRule:
    # Monday: 09:00-18:00, lunch 12:00-14:00
    rule = AvailabilityRule(
        day_of_week=0,
        open_time=time(9, 0),
        close_time=time(18, 0),
        lunch_start=time(12, 0),
        lunch_end=time(14, 0),
        is_active=True,
    )
    session.add(rule)
    session.commit()
    return rule


# Next Monday from a fixed test date (2026-06-15 is a Monday)
TEST_MONDAY = "2026-06-15"
TEST_SUNDAY = "2026-06-21"


# ---------------------------------------------------------------------------
# validate_and_book — success paths
# ---------------------------------------------------------------------------

class TestValidateAndBookSuccess:
    def test_books_valid_slot(self, session, service, monday_rule):
        appt = validate_and_book(
            session=session,
            full_name="Anna Schmidt",
            email="anna@example.de",
            phone="+49 911 123456",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="09:00",
            selected_end_time="09:45",
            notes=None,
        )
        assert appt.id is not None
        assert appt.status == "confirmed"
        assert appt.full_name == "Anna Schmidt"

    def test_books_afternoon_slot_after_lunch(self, session, service, monday_rule):
        appt = validate_and_book(
            session=session,
            full_name="Karl Müller",
            email="karl@example.de",
            phone="+49 911 654321",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="14:00",
            selected_end_time="14:45",
            notes=None,
        )
        assert appt.status == "confirmed"

    def test_notes_stored(self, session, service, monday_rule):
        appt = validate_and_book(
            session=session,
            full_name="Test",
            email="t@example.de",
            phone="+49 911 111111",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="10:00",
            selected_end_time="10:45",
            notes="Sehr empfindliche Zähne",
        )
        assert appt.notes == "Sehr empfindliche Zähne"


# ---------------------------------------------------------------------------
# validate_and_book — double-booking prevention
# ---------------------------------------------------------------------------

class TestDoubleBookingPrevention:
    def test_exact_same_slot_rejected(self, session, service, monday_rule):
        validate_and_book(
            session=session,
            full_name="First Patient",
            email="first@example.de",
            phone="+49 911 111111",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="09:00",
            selected_end_time="09:45",
            notes=None,
        )
        with pytest.raises(ValueError, match="no longer available"):
            validate_and_book(
                session=session,
                full_name="Second Patient",
                email="second@example.de",
                phone="+49 911 222222",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="09:00",
                selected_end_time="09:45",
                notes=None,
            )

    def test_overlapping_slot_rejected(self, session, service, monday_rule):
        validate_and_book(
            session=session,
            full_name="First",
            email="first@example.de",
            phone="+49 911 111111",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="09:00",
            selected_end_time="09:45",
            notes=None,
        )
        with pytest.raises(ValueError, match="no longer available"):
            validate_and_book(
                session=session,
                full_name="Second",
                email="second@example.de",
                phone="+49 911 222222",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="09:30",
                selected_end_time="10:15",
                notes=None,
            )

    def test_cancelled_slot_can_be_rebooked(self, session, service, monday_rule):
        appt = validate_and_book(
            session=session,
            full_name="Original",
            email="o@example.de",
            phone="+49 911 111111",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="09:00",
            selected_end_time="09:45",
            notes=None,
        )
        appt.status = "cancelled"
        session.add(appt)
        session.commit()

        new_appt = validate_and_book(
            session=session,
            full_name="New Patient",
            email="new@example.de",
            phone="+49 911 999999",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="09:00",
            selected_end_time="09:45",
            notes=None,
        )
        assert new_appt.status == "confirmed"


# ---------------------------------------------------------------------------
# validate_and_book — constraint violations
# ---------------------------------------------------------------------------

class TestBookingConstraints:
    def test_closed_day_rejected(self, session, service, monday_rule):
        # Sunday has no availability rule
        with pytest.raises(ValueError, match="not open on this day"):
            validate_and_book(
                session=session,
                full_name="Test",
                email="t@example.de",
                phone="+49 911 000000",
                service_id=service.id,
                selected_date=TEST_SUNDAY,
                selected_start_time="10:00",
                selected_end_time="10:45",
                notes=None,
            )

    def test_before_opening_rejected(self, session, service, monday_rule):
        with pytest.raises(ValueError, match="outside clinic working hours"):
            validate_and_book(
                session=session,
                full_name="Test",
                email="t@example.de",
                phone="+49 911 000000",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="08:00",
                selected_end_time="08:45",
                notes=None,
            )

    def test_after_closing_rejected(self, session, service, monday_rule):
        with pytest.raises(ValueError, match="outside clinic working hours"):
            validate_and_book(
                session=session,
                full_name="Test",
                email="t@example.de",
                phone="+49 911 000000",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="18:00",
                selected_end_time="18:45",
                notes=None,
            )

    def test_during_lunch_rejected(self, session, service, monday_rule):
        with pytest.raises(ValueError, match="lunch break"):
            validate_and_book(
                session=session,
                full_name="Test",
                email="t@example.de",
                phone="+49 911 000000",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="12:00",
                selected_end_time="12:45",
                notes=None,
            )

    def test_full_day_block_rejected(self, session, service, monday_rule):
        block = BlockedTime(blocked_date=date.fromisoformat(TEST_MONDAY))
        session.add(block)
        session.commit()

        with pytest.raises(ValueError, match="not available on this date"):
            validate_and_book(
                session=session,
                full_name="Test",
                email="t@example.de",
                phone="+49 911 000000",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="09:00",
                selected_end_time="09:45",
                notes=None,
            )

    def test_partial_block_rejects_overlapping_slot(self, session, service, monday_rule):
        block = BlockedTime(
            blocked_date=date.fromisoformat(TEST_MONDAY),
            start_time=time(9, 0),
            end_time=time(11, 0),
        )
        session.add(block)
        session.commit()

        with pytest.raises(ValueError, match="blocked by the clinic"):
            validate_and_book(
                session=session,
                full_name="Test",
                email="t@example.de",
                phone="+49 911 000000",
                service_id=service.id,
                selected_date=TEST_MONDAY,
                selected_start_time="09:00",
                selected_end_time="09:45",
                notes=None,
            )

    def test_partial_block_allows_non_overlapping_slot(self, session, service, monday_rule):
        block = BlockedTime(
            blocked_date=date.fromisoformat(TEST_MONDAY),
            start_time=time(9, 0),
            end_time=time(11, 0),
        )
        session.add(block)
        session.commit()

        appt = validate_and_book(
            session=session,
            full_name="Test",
            email="t@example.de",
            phone="+49 911 000000",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="11:00",
            selected_end_time="11:45",
            notes=None,
        )
        assert appt.status == "confirmed"


# ---------------------------------------------------------------------------
# compute_availability
# ---------------------------------------------------------------------------

class TestComputeAvailability:
    def test_unknown_service_returns_empty(self, session, monday_rule):
        result = compute_availability(session, service_id=999, start_date=date(2026, 6, 15), end_date=date(2026, 6, 15))
        assert result.days == []

    def test_monday_has_slots(self, session, service, monday_rule):
        result = compute_availability(session, service_id=service.id, start_date=date(2026, 6, 15), end_date=date(2026, 6, 15))
        day = result.days[0]
        assert day.has_availability is True
        assert len(day.slots) > 0

    def test_sunday_no_slots(self, session, service, monday_rule):
        result = compute_availability(session, service_id=service.id, start_date=date(2026, 6, 21), end_date=date(2026, 6, 21))
        day = result.days[0]
        assert day.has_availability is False
        assert day.slots == []

    def test_booked_slot_removed_from_availability(self, session, service, monday_rule):
        validate_and_book(
            session=session,
            full_name="Patient",
            email="p@example.de",
            phone="+49 911 111111",
            service_id=service.id,
            selected_date=TEST_MONDAY,
            selected_start_time="09:00",
            selected_end_time="09:45",
            notes=None,
        )
        result = compute_availability(session, service_id=service.id, start_date=date(2026, 6, 15), end_date=date(2026, 6, 15))
        slot_times = [s.start_time for s in result.days[0].slots]
        assert "09:00" not in slot_times

    def test_full_day_block_empties_availability(self, session, service, monday_rule):
        session.add(BlockedTime(blocked_date=date(2026, 6, 15)))
        session.commit()
        result = compute_availability(session, service_id=service.id, start_date=date(2026, 6, 15), end_date=date(2026, 6, 15))
        assert result.days[0].has_availability is False

    def test_date_range_spans_multiple_days(self, session, service, monday_rule):
        # One-week range — should return 7 day entries
        result = compute_availability(session, service_id=service.id, start_date=date(2026, 6, 15), end_date=date(2026, 6, 21))
        assert len(result.days) == 7

    def test_lunch_slots_excluded_from_availability(self, session, service, monday_rule):
        result = compute_availability(session, service_id=service.id, start_date=date(2026, 6, 15), end_date=date(2026, 6, 15))
        slot_times = [s.start_time for s in result.days[0].slots]
        assert "12:00" not in slot_times
        assert "12:30" not in slot_times
        assert "13:00" not in slot_times
