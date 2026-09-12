# CampusMind

CampusMind is a full-stack student productivity platform for managing courses, assignments, study sessions, academic progress, and study recommendations.

## Features

### Courses

- Create courses
- Edit course details
- Delete courses
- Track progress with percentage sliders
- Prevent duplicate course codes
- Validate progress between 0 and 100

### Assignments

- Create assignments
- Edit assignments
- Delete assignments
- Track:
  - Course
  - Due date
  - Priority
  - Status
- Priority levels:
  - Low priority
  - Medium priority
  - High priority
- Status levels:
  - Not started
  - In progress
  - Complete

### Study Sessions

- Create study sessions
- Edit study sessions
- Delete study sessions
- Start planned sessions
- Complete active sessions
- Track:
  - Course
  - Topic
  - Duration
  - Status
- Dynamic metrics:
  - Completed study time
  - Total sessions
  - In-progress sessions

### Dashboard

The dashboard is backed by live API/database data and displays:

- Completed study time
- Number of active courses
- Average course progress
- Highest-priority incomplete assignment

### CampusMind Assistant

CampusMind includes a database-aware academic assistant that can help with:

- Study recommendations
- Assignment prioritization
- Course progress analysis

The assistant uses CampusMind course, assignment, and study-session data to generate recommendations.

### User Experience

- Responsive dark-mode dashboard
- Custom confirmation modals
- Toast notifications
- Loading states
- Error handling
- Course progress sliders
- Study duration sliders
- Priority and status badges

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- CSS

## Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy

## Database

- PostgreSQL
- Docker

## Testing

- Pytest
- FastAPI TestClient
- TypeScript build validation
- Next.js production build validation

## Development Tools

- Git
- GitHub
- REST APIs
- Swagger / OpenAPI
- Docker Compose

---

# Architecture

```text
Next.js / React / TypeScript
            |
            | REST API
            v
       FastAPI / Python
            |
            v
        SQLAlchemy
            |
            v
        PostgreSQL
            |
            v
          Docker
```

# Project Structure

```text
campusmind/
│
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── routes/
│   │   │   ├── models/
│   │   │   ├── database.py
│   │   │   └── main.py
│   │   │
│   │   ├── scripts/
│   │   │   └── seed_demo.py
│   │   │
│   │   └── tests/
│   │
│   └── web/
│       ├── app/
│       │   └── dashboard/
│       └── lib/
│
├── docker-compose.yml
├── README.md
└── .gitignore
```
