from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
import re


class AppointmentCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    service_id: int
    selected_date: str   # YYYY-MM-DD
    selected_start_time: str  # HH:MM
    selected_end_time: str    # HH:MM
    notes: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)\+]", "", v)
        if not cleaned.isdigit() or len(cleaned) < 7:
            raise ValueError("Invalid phone number")
        return v

    @field_validator("selected_date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        from datetime import date
        try:
            date.fromisoformat(v)
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

    @field_validator("selected_start_time", "selected_end_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        from datetime import time
        try:
            time.fromisoformat(v)
        except ValueError:
            raise ValueError("Time must be in HH:MM format")
        return v


class AppointmentOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    service_id: int
    appointment_date: str
    start_time: str
    end_time: str
    notes: Optional[str]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
