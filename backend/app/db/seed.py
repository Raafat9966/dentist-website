"""Seed the database with initial clinic data."""
from datetime import time
from sqlmodel import Session, select

from app.models.service import Service
from app.models.availability_rule import AvailabilityRule
from app.models.clinic_settings import ClinicSettings


SERVICES = [
    {
        "name": "Prophylaxis & Preventive Care",
        "description": "Professional cleaning, fluoride treatment, and personalised oral hygiene guidance to keep teeth healthy long-term.",
        "duration_minutes": 45,
        "buffer_minutes": 15,
        "price_from": 8900,
        "icon": "sparkles",
        "sort_order": 1,
    },
    {
        "name": "Tooth Preservation",
        "description": "Fillings, inlays, and conservative restorations using tooth-coloured materials to save your natural teeth.",
        "duration_minutes": 60,
        "buffer_minutes": 15,
        "price_from": 5900,
        "icon": "tooth",
        "sort_order": 2,
    },
    {
        "name": "Dental Prosthetics",
        "description": "Crowns, bridges, and full or partial dentures crafted to restore function and a natural-looking appearance.",
        "duration_minutes": 60,
        "buffer_minutes": 15,
        "price_from": 39900,
        "icon": "shield",
        "sort_order": 3,
    },
    {
        "name": "Oral Surgery",
        "description": "Extractions, wisdom tooth removal, and minor oral surgery performed with modern anaesthesia for a comfortable experience.",
        "duration_minutes": 60,
        "buffer_minutes": 30,
        "price_from": 14900,
        "icon": "cross",
        "sort_order": 4,
    },
    {
        "name": "Dental Implants",
        "description": "Permanent titanium implants that replace missing teeth — fixed in the jaw and indistinguishable from natural teeth.",
        "duration_minutes": 90,
        "buffer_minutes": 30,
        "price_from": 149900,
        "icon": "star",
        "sort_order": 5,
    },
    {
        "name": "Aesthetic Dentistry & Whitening",
        "description": "Professional bleaching and cosmetic treatments to brighten your smile by several shades in a single visit.",
        "duration_minutes": 90,
        "buffer_minutes": 15,
        "price_from": 19900,
        "icon": "sparkles",
        "sort_order": 6,
    },
    {
        "name": "Paediatric Dentistry",
        "description": "Gentle, child-friendly dental care from the first tooth onwards — we help children develop healthy habits without fear.",
        "duration_minutes": 30,
        "buffer_minutes": 15,
        "price_from": 4900,
        "icon": "heart",
        "sort_order": 7,
    },
    {
        "name": "Periodontology",
        "description": "Diagnosis and treatment of gum disease, including deep cleaning and supportive periodontal therapy to preserve the tooth-supporting tissue.",
        "duration_minutes": 60,
        "buffer_minutes": 15,
        "price_from": 9900,
        "icon": "alignments",
        "sort_order": 8,
    },
]

# Real opening hours from doktor-heussinger.de
AVAILABILITY_RULES = [
    {
        "day_of_week": 0,  # Monday: 09:00-12:00 / 14:00-18:00
        "open_time": time(9, 0),
        "close_time": time(18, 0),
        "lunch_start": time(12, 0),
        "lunch_end": time(14, 0),
    },
    {
        "day_of_week": 1,  # Tuesday: 09:00-14:00
        "open_time": time(9, 0),
        "close_time": time(14, 0),
        "lunch_start": None,
        "lunch_end": None,
    },
    {
        "day_of_week": 2,  # Wednesday: 09:00-12:00 / 13:00-18:00
        "open_time": time(9, 0),
        "close_time": time(18, 0),
        "lunch_start": time(12, 0),
        "lunch_end": time(13, 0),
    },
    {
        "day_of_week": 3,  # Thursday: 09:00-12:00 / 15:00-20:00
        "open_time": time(9, 0),
        "close_time": time(20, 0),
        "lunch_start": time(12, 0),
        "lunch_end": time(15, 0),
    },
    {
        "day_of_week": 4,  # Friday: 09:00-14:00
        "open_time": time(9, 0),
        "close_time": time(14, 0),
        "lunch_start": None,
        "lunch_end": None,
    },
]

CLINIC_SETTINGS = [
    {"key": "clinic_name", "value": "Zahnarztpraxis Dr. Stephan Heußinger", "description": "Clinic display name"},
    {"key": "clinic_phone", "value": "+49 911 999 17 666", "description": "Main contact phone"},
    {"key": "clinic_fax", "value": "+49 911 999 17 667", "description": "Fax number"},
    {"key": "clinic_email", "value": "praxis@doktor-heussinger.de", "description": "Main contact email"},
    {"key": "clinic_address", "value": "Meißener Str. 34, 90522 Oberasbach", "description": "Physical address"},
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
