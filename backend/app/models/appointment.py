from typing import Optional
from datetime import datetime, date, time
from sqlmodel import Field, SQLModel


class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(index=True)
    phone: str
    service_id: int = Field(foreign_key="services.id", index=True)
    appointment_date: date = Field(index=True)
    start_time: time
    end_time: time
    notes: Optional[str] = Field(default=None)
    status: str = Field(default="confirmed", description="confirmed | cancelled | completed")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
