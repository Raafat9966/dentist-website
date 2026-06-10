from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.database import get_session
from app.models.service import Service
from app.schemas.service import ServiceOut

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
def list_services(session: Session = Depends(get_session)):
    return session.exec(
        select(Service).where(Service.is_active == True).order_by(Service.sort_order)
    ).all()


@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, session: Session = Depends(get_session)):
    from fastapi import HTTPException
    service = session.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
