from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.availability import AvailabilityResponse
from app.services.scheduling import compute_availability

router = APIRouter(prefix="/api/availability", tags=["availability"])

MAX_RANGE_DAYS = 60


@router.get("", response_model=AvailabilityResponse)
def get_availability(
    service_id: int = Query(...),
    start: str = Query(..., description="YYYY-MM-DD"),
    end: str = Query(..., description="YYYY-MM-DD"),
    session: Session = Depends(get_session),
):
    try:
        start_date = date.fromisoformat(start)
        end_date = date.fromisoformat(end)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid date format. Use YYYY-MM-DD.")

    if end_date < start_date:
        raise HTTPException(status_code=422, detail="end must be >= start")

    if (end_date - start_date).days > MAX_RANGE_DAYS:
        raise HTTPException(
            status_code=422,
            detail=f"Date range cannot exceed {MAX_RANGE_DAYS} days",
        )

    return compute_availability(session, service_id, start_date, end_date)
