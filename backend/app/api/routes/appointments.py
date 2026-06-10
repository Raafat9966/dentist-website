from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.appointment import AppointmentCreate, AppointmentOut
from app.services.scheduling import validate_and_book

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.post("", response_model=AppointmentOut, status_code=201)
def create_appointment(
    payload: AppointmentCreate,
    session: Session = Depends(get_session),
):
    try:
        appointment = validate_and_book(
            session=session,
            full_name=payload.full_name,
            email=str(payload.email),
            phone=payload.phone,
            service_id=payload.service_id,
            selected_date=payload.selected_date,
            selected_start_time=payload.selected_start_time,
            selected_end_time=payload.selected_end_time,
            notes=payload.notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    return AppointmentOut(
        id=appointment.id,
        full_name=appointment.full_name,
        email=appointment.email,
        phone=appointment.phone,
        service_id=appointment.service_id,
        appointment_date=appointment.appointment_date.isoformat(),
        start_time=appointment.start_time.strftime("%H:%M"),
        end_time=appointment.end_time.strftime("%H:%M"),
        notes=appointment.notes,
        status=appointment.status,
        created_at=appointment.created_at,
    )
