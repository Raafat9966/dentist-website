# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project goal

Build a premium dentist landing page with appointment booking.

## Stack

- Frontend: Next.js + TypeScript + Tailwind CSS + FullCalendar
- Backend: FastAPI + Python
- Database: PostgreSQL
- ORM: SQLAlchemy or SQLModel

## Project structure

```
frontend/   # Next.js app (not yet scaffolded)
backend/    # FastAPI app (not yet scaffolded)
```

## Commands

### Frontend (once scaffolded under `frontend/`)

```bash
cd frontend
npm install          # install dependencies
npm run dev          # dev server on http://localhost:3000
npm run build        # production build
npm run lint         # ESLint
npx tsc --noEmit     # type-check without emitting
```

### Backend (once scaffolded under `backend/`)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload   # dev server on http://localhost:8000
pytest                      # run all tests
pytest tests/test_booking.py -v   # run a single test file
```

### Database

```bash
# Apply migrations (Alembic expected)
alembic upgrade head
# Generate a new migration after model changes
alembic revision --autogenerate -m "description"
```

## Architecture

Frontend and backend are fully separate apps communicating over HTTP.

**Frontend (Next.js)**
- App Router (`app/`) preferred over Pages Router
- All appointment slot validation must also be confirmed by the backend — never trust frontend-only availability checks
- FullCalendar used for the booking calendar UI

**Backend (FastAPI)**
- Source of truth for all scheduling logic
- Scheduling logic lives in service modules (e.g., `services/booking.py`), not inside route handlers
- Slot availability is rechecked at save time to prevent double booking
- Google Calendar sync is optional and must be isolated behind a feature flag or dedicated module — failures there must not break core booking

**Booking constraints the backend must enforce**
- Working hours windows
- Blocked time ranges
- Public holidays
- Per-service durations
- Buffer times between appointments
- Concurrent-safe double-booking prevention (use DB-level constraints or row locking)

## Workflow rules

- Always inspect relevant files before changing them
- Do not assume architecture without checking the repo
- Reuse existing conventions where possible
- Prefer implementing over only suggesting
- After changes, run lint/typecheck/build (frontend) or startup/test commands (backend) and fix any issues

## Product requirements

- Premium healthcare visual style
- Mobile-first layout
- Accessible (WCAG AA target)
- SEO-friendly (metadata, structured data)
- Fast, minimal-step booking flow
- Trust signals (credentials, reviews, certifications)
