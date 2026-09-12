# CampusMind Architecture

## Design goals

CampusMind is intentionally designed beyond a basic student CRUD application. The architecture should demonstrate:

- clean API boundaries
- relational data modeling
- caching
- authentication and authorization
- asynchronous/background work
- AI retrieval pipelines
- testing
- observability
- CI/CD
- cloud deployment

## Components

### Web application
Next.js + TypeScript.

Responsibilities:
- user interface
- authentication UX
- dashboard
- course/task management
- AI assistant experience
- real-time UI updates

### API
FastAPI + Python.

Responsibilities:
- business logic
- validation
- authentication/authorization
- persistence
- AI orchestration
- background jobs
- metrics endpoints

### PostgreSQL
Primary system of record.

Expected data:
- users
- courses
- memberships
- tasks
- study sessions
- uploaded documents
- document chunks
- AI conversations

### Redis
Used for:
- caching
- rate limiting
- short-lived state
- background job coordination later

### AI layer
Planned for a later milestone.

Pipeline:

```text
Upload
  -> text extraction
  -> chunking
  -> embeddings
  -> pgvector
  -> semantic retrieval
  -> LLM answer with citations
```

## Why this architecture?

The goal is to create a realistic system where each technology has a reason to exist. We will avoid adding infrastructure solely for buzzwords.
