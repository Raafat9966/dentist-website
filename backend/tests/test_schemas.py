"""Unit tests for Pydantic schema validators — no DB required."""
import pytest
from pydantic import ValidationError

from app.schemas.appointment import AppointmentCreate


def valid_payload(**overrides) -> dict:
    base = {
        "full_name": "Max Mustermann",
        "email": "max@example.de",
        "phone": "+49 911 999 17 666",
        "service_id": 1,
        "selected_date": "2026-06-16",
        "selected_start_time": "10:00",
        "selected_end_time": "11:00",
    }
    return {**base, **overrides}


class TestAppointmentCreateValid:
    def test_full_valid_payload(self):
        data = AppointmentCreate(**valid_payload())
        assert data.full_name == "Max Mustermann"
        assert str(data.email) == "max@example.de"

    def test_notes_optional(self):
        data = AppointmentCreate(**valid_payload())
        assert data.notes is None

    def test_notes_accepted(self):
        data = AppointmentCreate(**valid_payload(notes="First visit"))
        assert data.notes == "First visit"

    def test_phone_with_spaces_and_dashes(self):
        data = AppointmentCreate(**valid_payload(phone="+49 911 999-17-666"))
        assert data.phone == "+49 911 999-17-666"

    def test_phone_with_parentheses(self):
        data = AppointmentCreate(**valid_payload(phone="(089) 1234567"))
        assert data.phone == "(089) 1234567"


class TestAppointmentCreateEmail:
    def test_missing_at_sign(self):
        with pytest.raises(ValidationError) as exc:
            AppointmentCreate(**valid_payload(email="notanemail"))
        assert "email" in str(exc.value)

    def test_missing_domain(self):
        with pytest.raises(ValidationError):
            AppointmentCreate(**valid_payload(email="user@"))

    def test_empty_string(self):
        with pytest.raises(ValidationError):
            AppointmentCreate(**valid_payload(email=""))


class TestAppointmentCreatePhone:
    def test_too_short(self):
        with pytest.raises(ValidationError) as exc:
            AppointmentCreate(**valid_payload(phone="123"))
        assert "Invalid phone number" in str(exc.value)

    def test_letters_rejected(self):
        with pytest.raises(ValidationError):
            AppointmentCreate(**valid_payload(phone="abc-def-ghij"))

    @pytest.mark.parametrize("phone", [
        "1234567",          # 7 digits minimum
        "+49 911 1234567",
        "0911-1234567",
        "(089) 1234567",
    ])
    def test_valid_phones(self, phone):
        data = AppointmentCreate(**valid_payload(phone=phone))
        assert data.phone == phone


class TestAppointmentCreateDate:
    def test_wrong_format(self):
        with pytest.raises(ValidationError) as exc:
            AppointmentCreate(**valid_payload(selected_date="15-06-2026"))
        assert "YYYY-MM-DD" in str(exc.value)

    def test_invalid_date(self):
        with pytest.raises(ValidationError):
            AppointmentCreate(**valid_payload(selected_date="2026-13-01"))

    def test_valid_date_accepted(self):
        data = AppointmentCreate(**valid_payload(selected_date="2026-12-31"))
        assert data.selected_date == "2026-12-31"


class TestAppointmentCreateTime:
    def test_wrong_time_format(self):
        with pytest.raises(ValidationError) as exc:
            AppointmentCreate(**valid_payload(selected_start_time="9:00"))
        assert "HH:MM" in str(exc.value)

    def test_invalid_time_value(self):
        with pytest.raises(ValidationError):
            AppointmentCreate(**valid_payload(selected_end_time="25:00"))

    @pytest.mark.parametrize("t", ["09:00", "14:30", "00:00", "23:59"])
    def test_valid_times(self, t):
        data = AppointmentCreate(**valid_payload(selected_start_time=t, selected_end_time=t))
        assert data.selected_start_time == t
