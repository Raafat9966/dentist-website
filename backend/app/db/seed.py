"""Seed the database with initial clinic data."""
from datetime import time
from sqlmodel import Session, select

from app.models.service import Service
from app.models.availability_rule import AvailabilityRule
from app.models.clinic_settings import ClinicSettings


SERVICES = [
    {
        "name": "General Check-up & Cleaning",
        "description": "Comprehensive oral examination, professional cleaning, and X-rays to keep your smile healthy.",
        "duration_minutes": 60,
        "buffer_minutes": 15,
        "price_from": 8900,
        "icon": "tooth",
        "sort_order": 1,
    },
    {
        "name": "Teeth Whitening",
        "description": "Professional in-office whitening that lightens teeth by up to 8 shades in a single visit.",
        "duration_minutes": 90,
        "buffer_minutes": 15,
        "price_from": 29900,
        "icon": "sparkles",
        "sort_order": 2,
    },
    {
        "name": "Dental Implants",
        "description": "Permanent tooth replacement that looks and feels natural — titanium post, abutment, and crown.",
        "duration_minutes": 120,
        "buffer_minutes": 30,
        "price_from": 149900,
        "icon": "shield",
        "sort_order": 3,
    },
    {
        "name": "Orthodontics / Invisalign",
        "description": "Clear, removable aligners that straighten your teeth discreetly without metal brackets.",
        "duration_minutes": 60,
        "buffer_minutes": 15,
        "price_from": 249900,
        "icon": "alignments",
        "sort_order": 4,
    },
    {
        "name": "Root Canal Therapy",
        "description": "Pain-free treatment to save an infected tooth and eliminate discomfort quickly.",
        "duration_minutes": 90,
        "buffer_minutes": 30,
        "price_from": 69900,
        "icon": "heart",
        "sort_order": 5,
    },
    {
        "name": "Veneers & Cosmetic Work",
        "description": "Porcelain or composite veneers to perfect the shape, size, and color of your smile.",
        "duration_minutes": 90,
        "buffer_minutes": 15,
        "price_from": 59900,
        "icon": "star",
        "sort_order": 6,
    },
]

# Monday-Friday 9:00-18:00 with 13:00-14:00 lunch break
AVAILABILITY_RULES = [
    {
        "day_of_week": 0,  # Monday
        "open_time": time(9, 0),
        "close_time": time(18, 0),
        "lunch_start": time(13, 0),
        "lunch_end": time(14, 0),
    },
    {
        "day_of_week": 1,  # Tuesday
        "open_time": time(9, 0),
        "close_time": time(18, 0),
        "lunch_start": time(13, 0),
        "lunch_end": time(14, 0),
    },
    {
        "day_of_week": 2,  # Wednesday
        "open_time": time(9, 0),
        "close_time": time(18, 0),
        "lunch_start": time(13, 0),
        "lunch_end": time(14, 0),
    },
    {
        "day_of_week": 3,  # Thursday
        "open_time": time(9, 0),
        "close_time": time(18, 0),
        "lunch_start": time(13, 0),
        "lunch_end": time(14, 0),
    },
    {
        "day_of_week": 4,  # Friday
        "open_time": time(9, 0),
        "close_time": time(17, 0),
        "lunch_start": time(13, 0),
        "lunch_end": time(14, 0),
    },
    # Saturday half-day
    {
        "day_of_week": 5,  # Saturday
        "open_time": time(9, 0),
        "close_time": time(13, 0),
        "lunch_start": None,
        "lunch_end": None,
    },
]

CLINIC_SETTINGS = [
    {"key": "clinic_name", "value": "BrightSmile Dental Clinic", "description": "Clinic display name"},
    {"key": "clinic_phone", "value": "+1 (555) 234-5678", "description": "Main contact phone"},
    {"key": "clinic_email", "value": "hello@brightsmile.dental", "description": "Main contact email"},
    {"key": "clinic_address", "value": "123 Health Avenue, Suite 200, New York, NY 10001", "description": "Physical address"},
    {"key": "booking_advance_days", "value": "60", "description": "How many days ahead can be booked"},
    {"key": "booking_min_notice_hours", "value": "24", "description": "Minimum hours before an appointment that can be booked"},
]


def seed(session: Session) -> None:
    existing_services = session.exec(select(Service)).all()
    if not existing_services:
        for s in SERVICES:
            session.add(Service(**s))

    existing_rules = session.exec(select(AvailabilityRule)).all()
    if not existing_rules:
        for r in AVAILABILITY_RULES:
            session.add(AvailabilityRule(**r))

    existing_settings = session.exec(select(ClinicSettings)).all()
    if not existing_settings:
        for cs in CLINIC_SETTINGS:
            session.add(ClinicSettings(**cs))

    session.commit()
    print("Database seeded successfully.")
