# CampusMind

CampusMind is a production-style AI student operating system built as a portfolio flagship project.

## Vision

Help college students organize courses, deadlines, study material, and learning progress in one place, with AI features that are grounded in the student's own content.

## V1 goals

- User accounts and authentication
- Courses
- Tasks and deadlines
- Study dashboard
- Document upload
- AI question answering over uploaded course material
- PostgreSQL persistence
- Redis-backed caching/session support
- Dockerized local development
- Automated tests
- CI with GitHub Actions

## Architecture

```text
Browser
  |
  v
Next.js / TypeScript
  |
  v
FastAPI / Python
  |
  +--> PostgreSQL
  |
  +--> Redis
  |
  +--> AI / Embeddings layer (Phase 2)
```

## Monorepo layout

```text
campusmind/
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # FastAPI backend
├── docs/              # Architecture and product docs
├── .github/workflows/ # CI
├── docker-compose.yml
└── README.md
```

## Local development

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend health check:

```text
http://localhost:8000/health
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

### Infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL and Redis.

## Current milestone

Milestone 0: engineering foundation.

The first code establishes:
- monorepo structure
- FastAPI service
- Next.js frontend
- PostgreSQL + Redis local infrastructure
- backend tests
- GitHub Actions CI
- architecture documentation

## Planned milestones

1. Authentication and users
2. Courses and tasks
3. Dashboard and analytics
4. Document ingestion
5. RAG-based AI study assistant
6. Real-time study rooms / notifications
7. Production deployment
8. Usage analytics and user feedback
9. Public beta
