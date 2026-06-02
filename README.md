# My Financial Advisor

A full-stack financial advisor app built with **FastAPI** (backend) and **React + Vite** (frontend), using **PostgreSQL** as the database. Everything runs in Docker.

---

## Prerequisites

Make sure you have these installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for frontend)
- [Git](https://git-scm.com/)

---

## Project Structure

my-financial-advisor/
├── apps/
│   ├── api/          # FastAPI backend
│   └── web/          # React + Vite frontend
├── db/
│   └── init.sql      # Database setup
└── docker-compose.local.yml

---

## Getting Started

### 1. Clone the repo
```bash
git clone <repo-url>
cd my-financial-advisor
```

### 2. Create the environment file
Inside `apps/api/`, create a file called `.env` and paste this:
```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@db:5432/financial_advisor
SECRET_KEY=your-secret-key-change-in-prod
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:5173"]
```

### 3. Start the backend + database
```bash
docker compose -f docker-compose.local.yml up -d
```
This starts:
- **PostgreSQL** on port `5432`
- **FastAPI** on port `8000`

### 4. Start the frontend
```bash
cd apps/web
npm install
npm run dev
```
This starts the React app on **http://localhost:5173**

---

## Useful URLs

| URL | What it is |
|-----|------------|
| http://localhost:8000 | API root |
| http://localhost:8000/health | Health check |
| http://localhost:8000/docs | API documentation (Swagger) |
| http://localhost:5173 | Frontend |

---

## Common Commands

### Docker (Backend + Database)

```bash
# Start everything in background
docker compose -f docker-compose.local.yml up -d

# Stop everything
docker compose -f docker-compose.local.yml down

# Rebuild after code changes to Dockerfile or pyproject.toml
docker compose -f docker-compose.local.yml up -d --build

# View API logs
docker compose -f docker-compose.local.yml logs -f api

# View database logs
docker compose -f docker-compose.local.yml logs -f db

# Restart API only
docker compose -f docker-compose.local.yml restart api
```

### Frontend

```bash
cd apps/web

npm install      # Install dependencies (first time only)
npm run dev      # Start dev server
npm run build    # Build for production
```

---

## Notes

- The API has **hot-reload** enabled — any changes to backend code reflect instantly, no need to restart Docker.
- The database data is persisted in a Docker volume, so it survives container restarts.
- If port `5432` is already in use, stop your local Postgres:
```bash
  brew services stop postgresql
```


