# Memory Words

Interactive memory game: memorize words under time pressure, then find them in a larger grid. Each level adds more words and less time.

## Categories

25 topics (Automobile, Food, Groceries, Names, Characters, Movies, Harry Potter, Science, IT, Politics, Languages, and more). Pick one before you play — memorize words and distractors all come from that topic.

`GET /memory/categories` lists them.

## How to play

1. Choose a **category**, then click **Play**
2. **Memorize** the words shown (countdown timer)
3. Words hide — **tap** every word you remember in the grid
4. Hit **Done** or wait for the guess timer
5. Pass the level to continue (more words, faster timers)

## Level scaling

| Level | Words to remember | Memorize time (approx) |
|-------|-------------------|-------------------------|
| 1 | **5** | ~10s |
| 2 | 6 | ~10s |
| 3 | 7 | ~9s |
| 10 | 14 | ~7s |
| 16+ | 20 (max) | ~5s |

Words increase by **+1 per level** (slow ramp). Distractors match (2× words in the grid).

Guess time scales with word count. Speed bonus for submitting early.

## Run locally

```bash
# API
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# UI
cd frontend && npm start
```

Open **http://localhost:4200**

## Database

Game sessions are stored in **SQLite** (`backend/data/game.db`). Configure with `DATABASE_URL=sqlite:///./data/game.db` in `backend/.env`.

Contact and suggestion form submissions are appended to CSV files (not SQLite):

- `backend/data/contact_messages.csv`
- `backend/data/suggestions.csv`

## API

- `POST /memory/start` — new game session
- `POST /memory/{session_id}/round` — start round (words + choices)
- `POST /memory/guess` — submit selected words + time bonus

## Stack

Angular 20 · FastAPI · Pydantic · SQLite · Vitest · pytest

## Testing

### Backend

```bash
cd backend && source .venv/bin/activate
pytest -m unit -q
pytest -m integration -q
pytest -q
```

- **Unit** (`tests/unit/`): level service, word bank, repository, memory service, scoring/evaluation
- **Integration** (`tests/integration/`): HTTP API, game flow, multi-level progression

### Frontend (Vitest)

```bash
cd frontend
npm run test:ci
```

- **Unit**: `memory-api.service.spec.ts`
- **Integration**: `memory-http.integration.spec.ts`
- **Component**: `memory-page.component.spec.ts`, `tech-stack-panel.component.spec.ts`, `app.spec.ts`

## Guide pages

- **About** — http://localhost:4200/about (architecture, flow, tech stack, dev tools)
- **Next version** — http://localhost:4200/roadmap

## Admin (local only — not on GitHub)

The admin login and inbox exist **only on your machine**. They are listed in `.gitignore` and are not pushed to GitHub.

See **`docs/admin-local-only.md`** for how admin works locally.

## License

MIT
