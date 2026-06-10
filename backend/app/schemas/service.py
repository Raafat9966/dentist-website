from typing import Optional
from pydantic import BaseModel


class ServiceOut(BaseModel):
    id: int
    name: str
    description: str
    duration_minutes: int
    buffer_minutes: int
    price_from: Optional[int]
    icon: Optional[str]
    sort_order: int

    model_config = {"from_attributes": True}
