from typing import Optional
from sqlmodel import Field, SQLModel


class Service(SQLModel, table=True):
    __tablename__ = "services"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: str
    duration_minutes: int = Field(default=60, description="Appointment duration in minutes")
    buffer_minutes: int = Field(default=15, description="Buffer time after appointment")
    price_from: Optional[int] = Field(default=None, description="Starting price in cents")
    icon: Optional[str] = Field(default=None, description="Icon name or emoji")
    is_active: bool = Field(default=True)
    sort_order: int = Field(default=0)
