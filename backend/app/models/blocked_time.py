from typing import Optional
from datetime import date, time
from sqlmodel import Field, SQLModel


class BlockedTime(SQLModel, table=True):
    __tablename__ = "blocked_times"

    id: Optional[int] = Field(default=None, primary_key=True)
    blocked_date: date = Field(index=True)
    # If both are None, the entire day is blocked
    start_time: Optional[time] = Field(default=None)
    end_time: Optional[time] = Field(default=None)
    reason: Optional[str] = Field(default=None)
