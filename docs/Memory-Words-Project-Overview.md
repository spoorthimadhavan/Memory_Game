# Memory Words — Project Overview

**Document type:** Technical overview (PDF-style)  
**Project:** Memory Words (ai-word-battle)  
**Author:** Spoorthi Satish Madhavan  
**Stack summary:** Angular 20 · FastAPI · SQLite · Vitest · pytest  

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Tech stack](#2-tech-stack)
3. [Application functionalities](#3-application-functionalities)
4. [Game mechanics](#4-game-mechanics)
5. [Routes & pages](#5-routes--pages)
6. [API reference](#6-api-reference)
7. [Admin authentication](#7-admin-authentication)
8. [Data storage](#8-data-storage)
9. [Run locally](#9-run-locally)
10. [Key file locations](#10-key-file-locations)

---

## 1. Executive summary

**Memory Words** is a full-stack memory training game. Players choose one of **25 topic categories**, memorize a list of words under time pressure, then find those words in a larger grid mixed with distractors from the **same topic**.

The project demonstrates:

- A modern **Angular 20** single-page application with Material UI and Signals
- A **FastAPI** REST backend with Pydantic validation
- **SQLite** persistence for game sessions and admin users
- **CSV** storage for public contact and suggestion forms
- **JWT + bcrypt** admin authentication
- **Vitest** (frontend) and **pytest** (backend) automated tests
- Optional **LangChain / LangGraph** AI workflows in the codebase

**Live URLs (local development)**

| Service | URL |
|---------|-----|
| Game UI | http://localhost:4200 |
| API docs (Swagger) | http://localhost:8000/docs |
| Admin login | http://localhost:4200/admin/login |

---

## 2. Tech stack

**Total: 26 technologies** in the interactive tech stack panel (+ JWT/bcrypt for admin auth).

### 2.1 Frontend

| Technology | Category | Used for |
|------------|----------|----------|
| Angular 20 | Framework | Game UI, routing, guide pages, admin screens |
| Angular Signals | State | Live phase, timers, score, category selection |
| Angular Material | UI | Toolbar, buttons, forms, progress bar, icons |
| TypeScript | Language | Typed models, services, components |
| RxJS | Async | HTTP observables for API calls |
| Vitest | Testing | Component and service tests (`npm run test:ci`) |

### 2.2 Backend

| Technology | Category | Used for |
|------------|----------|----------|
| FastAPI | Framework | REST API (`/memory`, `/feedback`, `/admin`) |
| Pydantic | Validation | Request/response schemas |
| Uvicorn | Server | ASGI server on port 8000 |
| pytest | Testing | Unit + integration tests |
| bcrypt | Security | Admin password hashing |
| PyJWT | Security | Admin access tokens (HS256) |

### 2.3 Data

| Technology | Category | Used for |
|------------|----------|----------|
| SQLite | Database | Game sessions, admin users, reset tokens |
| Topic word banks | Data | 25 categories in `word_categories.json` |
| CSV files | Storage | Contact and suggestion submissions |
| NumPy | Math | Score clamping, level calculations |
| Pandas | Data | Tabular/CSV handling |

### 2.4 AI / ML (optional & development)

| Technology | Category | Used for |
|------------|----------|----------|
| Cursor | Dev tool | AI-powered IDE for building the project |
| ChatGPT (OpenAI) | LLM | Tutor feedback via LangChain (with API key) |
| Claude (Anthropic) | LLM | Development reviews; integrable like ChatGPT |
| LangChain | Orchestration | Prompt templates → structured LLM output |
| LangGraph | Workflow | Quest/adaptive pipeline (`quest_graph.py`) |
| LangSmith | Observability | Optional LLM tracing |
| scikit-learn (TF-IDF) | ML | Text similarity in quest evaluation |

### 2.5 DevOps & quality

| Technology | Category | Used for |
|------------|----------|----------|
| Automated testing | Quality | pytest + Vitest in CI |
| Docker | Deploy | `Dockerfile`, `docker-compose.yml` |
| GitHub Actions | CI/CD | `.github/workflows/ci.yml` |
| Environment config | Config | `.env`, CORS, `environment.ts` |

---

## 3. Application functionalities

### 3.1 Player-facing

| Feature | Description |
|---------|-------------|
| Category selection | Choose from 25 topics before playing |
| Memorize phase | Timed display of target words |
| Guess phase | Tap words in a grid (targets + topic distractors) |
| Level progression | +1 word per level (5 → 20 max); timers scale |
| Scoring | Pass/fail, speed bonus, cumulative score |
| Session persistence | Progress saved in SQLite between rounds |
| Tech stack explorer | Interactive panel with quizzes per technology |
| About page | Architecture, flow, admin docs |
| Roadmap page | Next-version improvement ideas |
| Contact form | Public message submission |
| Suggestion form | Public feature ideas submission |

### 3.2 Admin-facing

| Feature | Description |
|---------|-------------|
| Admin login | Email + password from `backend/.env` |
| Password visibility toggle | Eye icon on login form |
| Forgot password | Reset token via email or dev URL in API logs |
| Reset password | One-time token link |
| Contact inbox | View all contact form submissions |
| Suggestions inbox | View all suggestion submissions |
| Toolbar login icon | Quick access from any public page |
| Route guard | Unauthenticated users redirected to login |

### 3.3 Developer-facing

| Feature | Description |
|---------|-------------|
| Swagger UI | Interactive API docs at `/docs` |
| Unit tests | Backend logic isolated tests |
| Integration tests | Full HTTP API flow tests |
| Vitest specs | Angular component/service tests |
| Docker | Containerized API deployment |
| CI pipeline | Automated test runs on push |

---

## 4. Game mechanics

### 4.1 Flow

```
Pick category → POST /memory/start → Memorize words → Grid appears
→ Select remembered words → POST /memory/guess → Score + level update
→ Next round or game over
```

### 4.2 Level scaling

| Level | Words to remember | Memorize time (approx.) |
|-------|-------------------|-------------------------|
| 1 | 5 | ~10 s |
| 2 | 6 | ~10 s |
| 3 | 7 | ~9 s |
| 10 | 14 | ~7 s |
| 16+ | 20 (max) | ~5 s |

- Distractor count scales with targets (roughly 2× words in grid).
- Guess time scales with word count.
- Speed bonus for submitting early.

### 4.3 Categories (25 topics)

Examples: Automobile, Food, Groceries, Names, Characters, Movies, Harry Potter, Science, IT, Politics, Languages, and more.

All words and distractors for a round come from the **selected category only**.

---

## 5. Routes & pages

### 5.1 Public (Angular)

| Route | Page |
|-------|------|
| `/` | Memory game |
| `/about` | Project overview + admin auth documentation |
| `/roadmap` | Next-version improvements |
| `/contact` | Contact form |
| `/suggestion` | Suggestion form |

### 5.2 Admin (Angular)

| Route | Page | Auth required |
|-------|------|---------------|
| `/admin/login` | Sign in | No |
| `/admin/forgot-password` | Request reset | No |
| `/admin/reset-password?token=…` | Set new password | No |
| `/admin/contacts` | Contact inbox | Yes |
| `/admin/suggestions` | Suggestions inbox | Yes |

---

## 6. API reference

**Base URL:** `http://localhost:8000`

### 6.1 Game

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/memory/categories` | List 25 topic categories |
| POST | `/memory/start` | Create session (body includes `category_id`) |
| POST | `/memory/{session_id}/round` | Start round — words + choices |
| POST | `/memory/guess` | Submit selected words, get score |

### 6.2 Feedback (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback/contact` | Save contact message to CSV |
| POST | `/feedback/suggestion` | Save suggestion to CSV |

### 6.3 Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/admin/login` | None | Returns JWT `access_token` |
| POST | `/admin/forgot-password` | None | Creates reset token |
| POST | `/admin/reset-password` | None | Updates password |
| GET | `/admin/messages/contact` | Bearer JWT | List contact messages |
| GET | `/admin/messages/suggestions` | Bearer JWT | List suggestions |

### 6.4 Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |

---

## 7. Admin authentication

### 7.1 Configuration (`backend/.env`)

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAIL` | Login email |
| `ADMIN_PASSWORD` | Password (min 8 chars; hashed with bcrypt on save) |
| `JWT_SECRET` | Token signing key (32+ chars recommended in production) |
| `FRONTEND_URL` | Base URL for reset links (e.g. `http://localhost:4200`) |
| `SMTP_*` | Optional — send real forgot-password emails |

On API startup, admin credentials from `.env` are synced into SQLite.

### 7.2 Auth flow

```
Login form → POST /admin/login → bcrypt verify → JWT issued
→ Stored in sessionStorage → Bearer header on protected routes
→ GET /admin/messages/* → CSV inbox displayed
```

### 7.3 Forgot password

1. User submits email on `/admin/forgot-password`.
2. API creates a 1-hour single-use token in SQLite.
3. **With SMTP:** email with link to `/admin/reset-password?token=…`
4. **Without SMTP (dev):** link logged in API terminal + `dev_reset_url` in response.

---

## 8. Data storage

| Data | Location | Format |
|------|----------|--------|
| Game sessions | `backend/data/game.db` | SQLite table `memory_sessions` |
| Admin users | `backend/data/game.db` | SQLite table `admin_users` |
| Password reset tokens | `backend/data/game.db` | SQLite table `password_reset_tokens` |
| Contact messages | `backend/data/contact_messages.csv` | CSV append |
| Suggestions | `backend/data/suggestions.csv` | CSV append |
| Word categories | `backend/data/word_categories.json` | JSON |
| Admin JWT (browser) | `sessionStorage` | Token string (tab-scoped) |

---

## 9. Run locally

### 9.1 Prerequisites

- Node.js 20+ and npm
- Python 3.11+ with venv
- Git

### 9.2 Commands

**API**

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**UI**

```bash
cd frontend
npm install
npm start
```

**Tests**

```bash
# Backend
cd backend && pytest -q

# Frontend
cd frontend && npm run test:ci
```

### 9.3 Admin setup

1. Copy `backend/.env.example` → `backend/.env`
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`
3. Restart API
4. Open http://localhost:4200/admin/login

---

## 10. Key file locations

| Area | Path |
|------|------|
| Game UI | `frontend/src/app/features/memory/memory-page.component.ts` |
| About / admin docs | `frontend/src/app/features/guide/project-overview-page.component.ts` |
| Roadmap | `frontend/src/app/features/guide/roadmap-page.component.ts` |
| Tech stack data | `frontend/src/app/shared/tech-stack/tech-stack.data.ts` |
| Admin login UI | `frontend/src/app/features/admin/admin-login-page.component.ts` |
| API entry | `backend/app/main.py` |
| Memory routes | `backend/app/api/routes/memory.py` |
| Admin routes | `backend/app/api/routes/admin.py` |
| Feedback routes | `backend/app/api/routes/feedback.py` |
| SQLite repository | `backend/app/repositories/memory_repository.py` |
| Admin config | `backend/.env` |
| This document | `docs/Memory-Words-Project-Overview.md` |

---

## Export to PDF

**Option A — Cursor / VS Code**

1. Open this file: `docs/Memory-Words-Project-Overview.md`
2. Open Markdown preview (Cmd+Shift+V)
3. Print → Save as PDF

**Option B — Browser**

1. Paste into Google Docs or Notion, or use [markdownlivepreview.com](https://markdownlivepreview.com)
2. Print → Save as PDF

**Option C — Command line (if pandoc is installed)**

```bash
cd docs
pandoc Memory-Words-Project-Overview.md -o Memory-Words-Project-Overview.pdf
```

---

*Memory Words — built with Angular, FastAPI, and SQLite.*
