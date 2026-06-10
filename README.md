# BrightSmile Dental Clinic

A production-quality dentist landing page with appointment booking.

**Frontend:** Next.js 16 + TypeScript + Tailwind CSS  
**Backend:** FastAPI (Python 3.12) + SQLModel + PostgreSQL

---

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL running locally (or use Docker)

---

### 1. Backend

```bash
cd backend

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL to your PostgreSQL connection string

# Start the API server (auto-creates tables + seeds data on first run)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000  
Interactive docs: http://localhost:8000/docs

#### Run backend tests

```bash
cd backend
source .venv/bin/activate
pytest tests/ -v
```

---

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

The site will be available at http://localhost:3000

#### Frontend checks

```bash
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript
npm run build         # Production build
```

---

## Architecture

```
/
  frontend/   # Next.js App Router + TypeScript + Tailwind CSS
  backend/    # FastAPI + SQLModel + PostgreSQL
```

### Backend endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/services` | List all active dental services |
| GET | `/api/services/{id}` | Get a single service |
| GET | `/api/availability?service_id=&start=&end=` | Get available time slots |
| POST | `/api/appointments` | Book an appointment |

### Booking flow

1. Patient selects a service from the dropdown
2. Calendar loads availability from the backend for the current month
3. Patient picks a date — available time slots appear below the calendar
4. Patient fills in personal details and submits
5. Backend revalidates the slot, checks for conflicts, and saves

### Scheduling logic

The backend computes free slots by:

1. Loading `AvailabilityRule` records (per-day working hours)
2. Loading `BlockedTime` records (holidays, closures, partial blocks)
3. Loading existing `Appointment` records in the date range
4. Generating slots of `service.duration_minutes` length with `service.buffer_minutes` gap
5. Filtering out any slot that overlaps with blocked or booked times

Double-booking prevention: on `POST /api/appointments`, the backend re-queries for conflicts under the same transaction before writing.

---

## Database seed data

On first run, the backend seeds:

- **6 dental services** (Check-up, Whitening, Implants, Invisalign, Root Canal, Veneers)
- **Availability rules** — Mon-Thu 09:00-18:00, Fri 09:00-17:00, Sat 09:00-13:00 (with 13:00-14:00 lunch Mon-Fri)
- **Clinic settings** (name, phone, email, address)

---

## Deployment

### Frontend to Vercel

1. Push `frontend/` to a GitHub repo
2. Import to Vercel, set framework to Next.js
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-api.example.com`

### Backend to Railway / Render / Fly.io

1. Set `DATABASE_URL` to your managed PostgreSQL URL
2. Set `FRONTEND_URL` to your Vercel domain
3. Deploy with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

A `Dockerfile` is provided in `backend/` for containerised deployments.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/dentist_db` | PostgreSQL DSN |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `DEBUG` | `true` | Enable SQLAlchemy query logging |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI backend URL |

---

## Project structure

```
backend/
  app/
    main.py                    # FastAPI app, CORS, lifespan seed
    api/routes/
      health.py                # GET /health
      services.py              # GET /api/services
      availability.py          # GET /api/availability
      appointments.py          # POST /api/appointments
    core/
      config.py                # Pydantic settings
      database.py              # SQLModel engine + session
    models/                    # SQLModel table models
    schemas/                   # Pydantic request/response schemas
    services/
      scheduling.py            # Core slot-computation + booking logic
    db/
      seed.py                  # Initial data
  tests/
    test_scheduling.py         # Unit tests for scheduling logic
  requirements.txt
  Dockerfile
  .env.example

frontend/
  app/
    layout.tsx                 # Root layout with Header + Footer
    page.tsx                   # All landing page sections
    globals.css
  components/
    layout/
      Header.tsx               # Sticky responsive nav + CTA
      Footer.tsx               # Links, contact, social
    sections/
      Hero.tsx                 # Full-screen hero with stats
      About.tsx                # Clinic story + pillars
      Services.tsx             # Dynamic service cards from API
      WhyUs.tsx                # Differentiators + trust badges
      Team.tsx                 # Dentist profiles
      Testimonials.tsx         # Patient reviews
      FAQ.tsx                  # Accordion FAQ
      Contact.tsx              # Hours + address + map
    booking/
      BookingSection.tsx       # Container with success state
      BookingCalendar.tsx      # Custom month calendar + slot grid
      BookingForm.tsx          # React Hook Form + Zod validation
  lib/
    api.ts                     # Typed API client
    types.ts                   # Shared TypeScript interfaces
    config.ts                  # API base URL
  .env.local.example
```
