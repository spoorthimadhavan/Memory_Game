/** Default local run commands keyed by tech stack id. */
export const TECH_RUN_LOCALLY: Record<string, string> = {
  angular: 'cd frontend && npm install && npm start  →  http://localhost:4200',
  signals: 'Included in the Angular app — run `cd frontend && npm start` and play a round.',
  material: 'cd frontend && npm start — Material components load with the game UI.',
  typescript: 'cd frontend && npm run build  (compiles .ts before the browser bundle)',
  rxjs: 'cd frontend && npm start — HTTP calls use Observables when you click Play.',
  fastapi: 'cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000',
  pydantic: 'Start the API (see FastAPI). Invalid bodies return 422 at /docs Try it out.',
  uvicorn: 'cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000',
  pytest:
    'cd backend && source .venv/bin/activate && pytest -m unit -q && pytest -m integration -q',
  testing:
    'Backend: `cd backend && pytest -q`  ·  Frontend: `cd frontend && npm run test:ci` (Vitest)',
  vitest: 'cd frontend && npm install && npm run test:ci',
  sqlite:
    'cd backend && source .venv/bin/activate && uvicorn app.main:app --reload — DB file: data/game.db',
  'word-bank':
    'cd backend && uvicorn app.main:app --reload — GET http://localhost:8000/memory/categories',
  chatgpt:
    'Set OPENAI_API_KEY in backend/.env and USE_MOCK_LLM=false, then run the API (see llm_service.py).',
  claude:
    'Use Claude in the browser or Cursor while developing; backend today uses OpenAI via LangChain.',
  cursor: 'Install Cursor → Open this repo → use Agent/Chat to edit code and run tests.',
  langchain:
    'cd backend && source .venv/bin/activate && uvicorn app.main:app --reload (quest/LLM routes in repo).',
  langgraph:
    'Explore backend/app/workflows/quest_graph.py; run backend tests: pytest tests/unit -q',
  langsmith:
    'Set LANGCHAIN_TRACING_V2=true and LANGCHAIN_API_KEY in backend/.env, then trigger an LLM call.',
  sklearn:
    'cd backend && source .venv/bin/activate && pytest tests/unit/test_evaluation_service.py -q',
  numpy: 'cd backend && pytest tests/unit/test_memory_level_service.py -q',
  pandas: 'cd backend && python -c "import pandas as pd; print(pd.__version__)"',
  docker: 'From repo root: docker compose up --build',
  'github-actions': 'Push to GitHub — workflow runs automatically (see .github/workflows/ci.yml)',
  'env-config':
    'Copy backend/.env.example to backend/.env and edit CORS_ORIGINS / DATABASE_URL as needed.',
};
