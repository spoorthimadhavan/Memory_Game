import { TECH_QUIZZES } from './tech-stack.quizzes';
import { TECH_RUN_LOCALLY } from './tech-run-commands';
import { TechCategory, TechStackItem } from './tech-stack.types';

export type { TechCategory, TechQuizQuestion, TechStackItem } from './tech-stack.types';

export const TECH_CATEGORIES: { id: TechCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'data', label: 'Data' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'devops', label: 'DevOps' },
];

const item = (
  partial: Omit<TechStackItem, 'quiz' | 'runLocally'> & {
    quiz?: TechStackItem['quiz'];
    runLocally?: string;
  },
): TechStackItem => ({
  ...partial,
  runLocally: partial.runLocally ?? TECH_RUN_LOCALLY[partial.id] ?? 'See README.md in the repo root.',
  quiz: (partial.quiz ?? TECH_QUIZZES[partial.id] ?? []).slice(0, 5),
});

export const TECH_STACK_ITEMS: TechStackItem[] = [
  item({
    id: 'angular',
    name: 'Angular 20',
    category: 'frontend',
    tagline: 'Builds the game you see in the browser',
    simpleExplanation:
      'Angular is a **frontend framework** — it is like the architect of a LEGO city on your screen. ' +
      'It splits the Memory Words game into neat pieces (toolbar, timer, word grid) and knows how to update them when your score changes.',
    realWorldScenario:
      'When you use a banking app to send money, Angular (or similar tools) draws the buttons and forms. ' +
      'If your balance changes, the number on screen updates without reloading the whole page.',
    usedIn: 'Game pages, routing, and all interactive UI in this project.',
    color: '#dd0031',
  }),
  item({
    id: 'signals',
    name: 'Angular Signals',
    category: 'frontend',
    tagline: 'Remembers live game data (timer, score, phase)',
    simpleExplanation:
      '**Signals** are like sticky notes the game checks constantly: “current phase = memorize”, “time left = 7”. ' +
      'When a note changes, only the parts of the screen that care about it refresh — fast and organized.',
    realWorldScenario:
      'A sports scoreboard uses Signals-style thinking: when the score changes, the big digits flip — not the whole stadium screen rebuilt.',
    usedIn: 'memory-page.component.ts — phase, timers, selected words, tech stack panel.',
    color: '#c3002f',
  }),
  item({
    id: 'material',
    name: 'Angular Material',
    category: 'frontend',
    tagline: 'Pre-built beautiful buttons and bars',
    simpleExplanation:
      '**Angular Material** gives ready-made UI parts (toolbars, buttons, progress bars) that look professional. ' +
      'You focus on game logic; Material handles consistent design and accessibility basics.',
    realWorldScenario:
      'Google apps (Gmail, Drive) share a familiar look — rounded buttons, cards, ripples. Material brings that polish to your portfolio app.',
    usedIn: 'Toolbar, progress bar during memorize phase, form buttons.',
    color: '#00bcd4',
  }),
  item({
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    tagline: 'JavaScript with safety labels',
    simpleExplanation:
      '**TypeScript** adds **types** to JavaScript — like labeling boxes “this holds numbers only”. ' +
      'Your editor warns you before you send text where a number is expected (e.g. score).',
    realWorldScenario:
      'Air traffic control uses strict rules so planes do not collide. TypeScript adds rules so API data does not “collide” with wrong UI code.',
    usedIn: 'All .ts files — models, services, components, and these guide pages.',
    color: '#3178c6',
  }),
  item({
    id: 'rxjs',
    name: 'RxJS',
    category: 'frontend',
    tagline: 'Handles data arriving from the server',
    simpleExplanation:
      '**RxJS** uses **Observables** — streams of data over time. When the server finally answers “here are your words”, RxJS delivers that answer to your game code.',
    realWorldScenario:
      'Live chat apps stream new messages. RxJS is the pattern behind “wait for response, then update UI”.',
    usedIn: 'memory-api.service.ts — HTTP calls for start, round, guess.',
    color: '#b7178c',
  }),
  item({
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    tagline: 'The game’s brain on the server',
    simpleExplanation:
      '**FastAPI** is a **Python web framework** that creates **REST APIs** — URLs your Angular app calls like `/memory/start`. ' +
      'It receives requests, runs Python logic, and sends JSON answers back.',
    realWorldScenario:
      'A food delivery app asks the server “what restaurants are open?” — FastAPI-style servers answer with JSON lists. Our game asks for word rounds the same way.',
    usedIn: 'All /memory and /feedback routes; interactive API docs at http://localhost:8000/docs when the server is running.',
    color: '#009688',
  }),
  item({
    id: 'pydantic',
    name: 'Pydantic',
    category: 'backend',
    tagline: 'Checks every message is valid',
    simpleExplanation:
      '**Pydantic** validates **schemas** — rules for JSON bodies. If someone sends an email without “@”, or an empty message, Pydantic stops it with a clear error.',
    realWorldScenario:
      'Theme park turnstiles only accept valid tickets. Pydantic is the turnstile for API data — no invalid shape gets in.',
    usedIn: 'memory.py, feedback.py schemas for requests and responses.',
    color: '#e92063',
  }),
  item({
    id: 'uvicorn',
    name: 'Uvicorn',
    category: 'backend',
    tagline: 'Runs FastAPI so browsers can connect',
    simpleExplanation:
      '**Uvicorn** is an **ASGI server** — it keeps your Python API listening on a port (8000) like a reception desk that never sleeps.',
    realWorldScenario:
      'A shop door must be open for customers. Uvicorn “opens the door” for HTTP requests hitting your backend.',
    usedIn: 'Local dev command and Docker CMD.',
    color: '#4b8bbe',
  }),
  item({
    id: 'pytest',
    name: 'Pytest',
    category: 'backend',
    tagline: 'Robot checks that code works',
    simpleExplanation:
      '**Pytest** runs **automated tests** — small programs that assert “if I do X, I should get Y”. Catches bugs before players see broken levels.',
    realWorldScenario:
      'Car makers crash-test dummies. Pytest crash-tests your API before deploy — “does level 1 really give 5 words?”',
    usedIn: 'tests/unit and tests/integration — memory game, SQLite repo, level rules, API routes.',
    color: '#0a9edc',
  }),
  item({
    id: 'vitest',
    name: 'Vitest',
    category: 'devops',
    tagline: 'Fast frontend unit & component tests',
    simpleExplanation:
      '**Vitest** is a modern JavaScript test runner (like Jest, but built on Vite). It runs Angular component and service specs quickly in CI without a heavy Karma browser farm.',
    realWorldScenario:
      'Teams migrating from Karma to Vitest get faster feedback in pull requests — tests start in seconds.',
    usedIn: 'All frontend `*.spec.ts` files — memory page, API service, tech stack panel, guide pages.',
    color: '#6e9f18',
  }),
  item({
    id: 'testing',
    name: 'Automated testing',
    category: 'devops',
    tagline: 'Unit, integration, and component tests across the stack',
    simpleExplanation:
      '**Testing** means small programs that verify real behavior. **Unit tests** check one module. **Integration tests** hit the live HTTP API. **Component tests** render Angular UI with Vitest.',
    realWorldScenario:
      'Before launch, every ride is tested. CI runs pytest and Vitest on each push so broken game logic never ships quietly.',
    usedIn:
      'Backend: pytest (`unit` + `integration` markers). Frontend: Vitest (`npm run test:ci`). Wired in `.github/workflows/ci.yml`.',
    color: '#43a047',
  }),
  item({
    id: 'sqlite',
    name: 'SQLite',
    category: 'data',
    tagline: 'Simple file database for game sessions',
    simpleExplanation:
      '**SQLite** is a small **relational database** stored in one file on disk. No separate database server — perfect for learning projects and MVPs that still meet “uses a database” requirements.',
    realWorldScenario:
      'A mobile app saving scores locally often uses SQLite. Our server stores each player session row in `data/game.db`.',
    usedIn: 'memory_repository.py — session_id + JSON state in table `memory_sessions` (DATABASE_URL in .env).',
    color: '#003b57',
  }),
  item({
    id: 'word-bank',
    name: 'Topic word banks',
    category: 'data',
    tagline: '25 categories of words for rounds',
    simpleExplanation:
      'Words live in `word_categories.json` — **25 topics** (Food, Harry Potter, IT, etc.). Targets and distractors are always drawn from the **same category** you pick.',
    realWorldScenario:
      'Like a trivia deck per subject: automobile round only uses car words, not random groceries mixed in.',
    usedIn: 'memory_word_service.py — GET /memory/categories and topic-scoped build_round().',
    color: '#8bc34a',
  }),
  item({
    id: 'cursor',
    name: 'Cursor',
    category: 'ai',
    tagline: 'AI-powered editor where this app was built',
    simpleExplanation:
      '**Cursor** is a **code editor** (based on VS Code) with built-in **AI agents** — it edits files, runs commands, explains code, and helps you ship features while you review every change.',
    realWorldScenario:
      'You ask Cursor to “add topic categories” and it updates backend, frontend, tests, and docs in one flow instead of copying snippets into a separate chat tab.',
    usedIn:
      'Building Memory Words — UI, SQLite, category word banks, Vitest, tech stack content, and guide pages.',
    color: '#6b5cff',
  }),
  item({
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    category: 'ai',
    tagline: 'Large language model (GPT family)',
    simpleExplanation:
      '**ChatGPT** is OpenAI’s **LLM** — software that reads prompts and writes human-like text. It can explain concepts, draft content, and power tutor-style feedback when wired through the API.',
    realWorldScenario:
      'A learning app asks “why was this answer close but not correct?” and gets a short explanation a student can understand.',
    usedIn:
      'llm_service.py via LangChain (when OPENAI_API_KEY is set); also used while writing quizzes and debugging during development.',
    color: '#10a37f',
  }),
  item({
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'ai',
    tagline: 'Large language model from Anthropic',
    simpleExplanation:
      '**Claude** is Anthropic’s **LLM** — similar role to ChatGPT, often chosen for long documents, careful reasoning, and code review.',
    realWorldScenario:
      'A team compares Claude and GPT answers for the same prompt before picking one for a feature.',
    usedIn:
      'Development and design reviews for this repo; can be integrated like ChatGPT through LangChain for future features.',
    color: '#d97757',
  }),
  item({
    id: 'langchain',
    name: 'LangChain',
    category: 'ai',
    tagline: 'Connects Python code to LLMs with templates',
    simpleExplanation:
      '**LangChain** wraps **LLMs** with **prompt templates** and parsers — so your backend gets structured tutor text instead of one unpredictable blob.',
    realWorldScenario:
      'A help desk uses a template: “Customer said {message} — reply in two sentences.” LangChain fills the template and calls the model.',
    usedIn: 'llm_service.py in the backend (quest / tutor feedback paths in this repository).',
    color: '#1c3c3c',
  }),
  item({
    id: 'langgraph',
    name: 'LangGraph',
    category: 'ai',
    tagline: 'Step-by-step AI workflows as a graph',
    simpleExplanation:
      '**LangGraph** models AI work as **nodes** (validate, score, explain) and **edges** (what runs next). Easier to test and change than one giant prompt.',
    realWorldScenario:
      'A hospital intake flow: check vitals → nurse note → doctor summary. LangGraph does the same for AI lesson steps.',
    usedIn: 'quest_graph.py — adaptive learning pipeline in the backend codebase.',
    color: '#2e7d32',
  }),
  item({
    id: 'langsmith',
    name: 'LangSmith',
    category: 'ai',
    tagline: 'Tracing and debugging for LLM calls',
    simpleExplanation:
      '**LangSmith** records each AI request — prompt, response, timing — so you can see why an answer went wrong in dev or production.',
    realWorldScenario:
      'Like package tracking scans: every hop is logged. LangSmith logs every LLM hop.',
    usedIn: 'Optional: enable LANGCHAIN_TRACING_V2 in backend/.env when debugging AI features.',
    color: '#ff6b35',
  }),
  item({
    id: 'sklearn',
    name: 'scikit-learn (TF-IDF)',
    category: 'ai',
    tagline: 'Text similarity without calling an LLM',
    simpleExplanation:
      '**scikit-learn** provides **TF-IDF** and **cosine similarity** — math that checks if two texts discuss the same ideas even when wording differs.',
    realWorldScenario:
      'A teacher gives partial credit when an essay uses different words but the same concepts as the rubric.',
    usedIn: 'evaluation_service.py — scores written answers by meaning in the quest module.',
    color: '#f7931e',
  }),
  item({
    id: 'numpy',
    name: 'NumPy',
    category: 'data',
    tagline: 'Fast number crunching for scores',
    simpleExplanation:
      '**NumPy** does quick math on arrays of numbers — clamping scores, multipliers per level, so points stay fair and never explode to a million by accident.',
    realWorldScenario:
      'Video games cap damage so one hit cannot destroy the universe. NumPy `clip` keeps XP in sensible ranges.',
    usedIn: 'memory_level_service.py, scoring_service.py',
    color: '#4d77cf',
  }),
  item({
    id: 'pandas',
    name: 'Pandas',
    category: 'data',
    tagline: 'Spreadsheet power in Python',
    simpleExplanation:
      '**Pandas** reads tables (CSV files) like Excel inside code — great for storing answer history and analyzing learning progress later.',
    realWorldScenario:
      'A teacher exports quiz results to a spreadsheet. Pandas can load that CSV and compute average scores per topic.',
    usedIn: 'quest_history.csv, feedback CSV files.',
    color: '#150458',
  }),
  item({
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    tagline: 'Ship the app in a portable box',
    simpleExplanation:
      '**Docker** builds a **container image** — your Python app + dependencies packed together so it runs the same on your laptop and in the cloud.',
    realWorldScenario:
      'A musician’s tour case has every cable inside. Docker is the tour case for software — no “works on my machine” surprises.',
    usedIn: 'backend/Dockerfile, docker-compose.yml',
    color: '#2496ed',
  }),
  item({
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'devops',
    tagline: 'Auto-test every code push',
    simpleExplanation:
      '**GitHub Actions** is **CI/CD** — when you push code, robots run lint, pytest, and Angular tests automatically. Broken code gets caught early.',
    realWorldScenario:
      'Factory robots inspect each car on the line. CI inspects each commit before it reaches users.',
    usedIn: '.github/workflows/ci.yml',
    color: '#24292f',
  }),
  item({
    id: 'env-config',
    name: 'Environment config',
    category: 'devops',
    tagline: 'Secret settings outside the code',
    simpleExplanation:
      '**Environment variables** store URLs and API keys in `.env` files — not hard-coded in Git. **CORS** lists which websites may call your API.',
    realWorldScenario:
      'Hotel key cards differ per guest. Env vars differ per environment: dev uses localhost, production uses real cloud URLs.',
    usedIn: 'environment.ts, backend/.env.example',
    color: '#5c6bc0',
  }),
];
