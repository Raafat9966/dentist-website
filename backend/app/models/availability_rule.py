from typing import Optional
from datetime import time
from sqlmodel import Field, SQLModel


class AvailabilityRule(SQLModel, table=True):
    __tablename__ = "availability_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    # 0=Monday, 1=Tuesday, ..., 6=Sunday
    day_of_week: int = Field(index=True, description="0=Monday through 6=Sunday")
    open_time: time
    close_time: time
    lunch_start: Optional[time] = Field(default=None)
    lunch_end: Optional[time] = Field(default=None)
    is_active: bool = Field(default=True)
