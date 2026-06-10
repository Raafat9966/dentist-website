from typing import Optional
from datetime import date, time
from pydantic import BaseModel


class TimeSlot(BaseModel):
    date: str           # YYYY-MM-DD
    start_time: str     # HH:MM
    end_time: str       # HH:MM
    available: bool = True


class DayAvailability(BaseModel):
    date: str
    slots: list[TimeSlot]
    has_availability: bool


class AvailabilityResponse(BaseModel):
    service_id: int
    days: list[DayAvailability]
