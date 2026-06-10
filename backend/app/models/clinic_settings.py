from typing import Optional
from sqlmodel import Field, SQLModel


class ClinicSettings(SQLModel, table=True):
    __tablename__ = "clinic_settings"

    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(unique=True, index=True)
    value: str
    description: Optional[str] = Field(default=None)
