export interface DevToolGuide {
  name: string;
  role: string;
  whyUsed: string;
  devHelp: string;
  runLocally: string;
  color: string;
}

export interface RoadmapItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'nice';
  area: string;
}

export const GAME_FLOW_STEPS = [
  {
    step: '1',
    label: 'Pick topic & play',
    detail: 'Player chooses a category, then POST /memory/start stores topic on the session',
  },
  { step: '2', label: 'Memorize', detail: 'Server returns target words; countdown runs in the UI' },
  { step: '3', label: 'Guess', detail: 'Grid shows targets + distractors; player selects remembered words' },
  { step: '4', label: 'Score', detail: 'POST /memory/guess checks picks, time bonus, and level pass/fail' },
  { step: '5', label: 'Level up', detail: 'More words and shorter timers until max level or game over' },
];

export const ARCHITECTURE_LAYERS = [
  {
    name: 'Browser (Angular 20)',
    items: [
      'Memory game UI (25 categories)',
      'Tech stack panel with quizzes',
      'Contact / suggestion forms',
      'About & roadmap guide pages',
    ],
  },
  {
    name: 'API (FastAPI + Uvicorn)',
    items: [
      '/memory/* game routes',
      '/feedback contact & suggestions',
      'Pydantic validation · Swagger at /docs',
    ],
  },
  {
    name: 'Services & data',
    items: [
      'Level rules & scoring',
      'Word bank (word_categories.json)',
      'SQLite (game.db) for game sessions',
      'CSV files for contact/suggestions (local only)',
    ],
  },
  {
    name: 'DevOps & quality',
    items: [
      'Docker & docker-compose',
      'GitHub Actions CI',
      'pytest (backend) + Vitest (frontend)',
      'Environment config (.env)',
    ],
  },
];

export const LOCAL_RUN_COMMANDS = [
  { label: 'API', cmd: 'cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000' },
  { label: 'UI', cmd: 'cd frontend && npm start' },
  { label: 'API docs', cmd: 'http://localhost:8000/docs (with API running)' },
  { label: 'Backend tests', cmd: 'cd backend && pytest -q' },
  { label: 'Frontend tests', cmd: 'cd frontend && npm run test:ci' },
];

export const DEV_TOOLS_GUIDE: DevToolGuide[] = [
  {
    name: 'Cursor',
    role: 'AI-powered code editor',
    whyUsed: 'Primary IDE for building this repository end-to-end.',
    devHelp: 'Agents edit Angular and Python files, run tests, and update docs while you review diffs.',
    runLocally: 'Install Cursor → File → Open Folder → select this repo.',
    color: '#6b5cff',
  },
  {
    name: 'ChatGPT (OpenAI)',
    role: 'Conversational AI assistant',
    whyUsed: 'Explain errors, draft user-facing copy, and explore API designs during development.',
    devHelp: 'Fast answers when debugging pytest failures or structuring roadmap content.',
    runLocally: 'Use the ChatGPT web or desktop app alongside Cursor.',
    color: '#10a37f',
  },
  {
    name: 'Claude (Anthropic)',
    role: 'Conversational AI assistant',
    whyUsed: 'Second opinion on architecture and longer explanations.',
    devHelp: 'Compare approaches (e.g. SQLite vs PostgreSQL) before coding the complex version.',
    runLocally: 'Use the Claude web or desktop app alongside Cursor.',
    color: '#d97757',
  },
];

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: 'PostgreSQL + user accounts (complex version)',
    description:
      'Move game sessions, admin users, and feedback off SQLite/CSV into PostgreSQL. Add player sign-up, JWT or session cookies, and sync progress across devices.',
    priority: 'high',
    area: 'Backend / Data',
  },
  {
    title: 'Feedback in the database (not CSV)',
    description:
      'Store contact and suggestion submissions in PostgreSQL with timestamps, read/unread flags, and search — replace append-only CSV files.',
    priority: 'high',
    area: 'Backend / Data',
  },
  {
    title: 'Production email (SMTP + templates)',
    description:
      'HTML password-reset emails, contact auto-replies, and admin alerts when a new suggestion arrives. Use a provider (SendGrid, Resend, or Gmail app password).',
    priority: 'high',
    area: 'Backend',
  },
  {
    title: 'Rate limiting & abuse protection',
    description:
      'Throttle /feedback and /admin/login by IP, add CAPTCHA on public forms, and validate payload size to reduce spam.',
    priority: 'high',
    area: 'Security',
  },
  {
    title: 'End-to-end tests (Playwright)',
    description:
      'Automate a full game round, contact form submit, and admin login → view messages so regressions are caught before deploy.',
    priority: 'high',
    area: 'Testing',
  },
  {
    title: 'Multiplayer or classroom mode',
    description:
      'Shared sessions, teacher dashboard, lobby codes, or timed group challenges where everyone gets the same word set.',
    priority: 'high',
    area: 'Product',
  },
  {
    title: 'Accessibility pass (WCAG 2.2)',
    description:
      'Keyboard navigation for the word grid, ARIA live regions for timers, visible focus rings, skip links, and a contrast audit on forms and quizzes.',
    priority: 'high',
    area: 'Frontend',
  },
  {
    title: 'Admin dashboard v2',
    description:
      'Build on the current login: reply to contacts in-app, mark suggestions as done, export CSV, session analytics, and filter by date.',
    priority: 'medium',
    area: 'Full stack',
  },
  {
    title: 'Difficulty presets',
    description:
      'Kids / standard / expert modes with different memorize timers, word counts, and distractor ratios per level.',
    priority: 'medium',
    area: 'Game design',
  },
  {
    title: 'Daily challenge & streaks',
    description:
      'One shared category + seed per day so players compare scores; track consecutive days played.',
    priority: 'medium',
    area: 'Game design',
  },
  {
    title: 'Leaderboard & personal bests',
    description:
      'Top scores per category and all-time bests stored in the database with optional display names.',
    priority: 'medium',
    area: 'Backend',
  },
  {
    title: 'Custom word lists',
    description:
      'Let teachers paste or upload a word list for a private category (class vocabulary, exam prep).',
    priority: 'medium',
    area: 'Product',
  },
  {
    title: 'Expand categories via API',
    description:
      'CRUD for word_categories.json, community submissions (moderated), and seasonal packs (holidays, sports events).',
    priority: 'medium',
    area: 'Backend',
  },
  {
    title: 'Sound & haptics',
    description:
      'Memorize countdown tick, correct/wrong feedback, level-up celebration — all with a mute toggle in settings.',
    priority: 'medium',
    area: 'Frontend',
  },
  {
    title: 'PWA offline shell',
    description:
      'Installable app icon, cached UI shell, and queue guesses when offline; sync when the API is reachable again.',
    priority: 'medium',
    area: 'Frontend',
  },
  {
    title: 'Mobile-first layout',
    description:
      'Larger tap targets on the word grid, sticky toolbar, and landscape-friendly memorize screen for phones.',
    priority: 'medium',
    area: 'Frontend',
  },
  {
    title: 'Observability',
    description:
      'Structured logging, health metrics, and error tracking (e.g. Sentry) on API and Angular with release tags.',
    priority: 'medium',
    area: 'DevOps',
  },
  {
    title: 'LangGraph quest mode (revive)',
    description:
      'Wire the existing quest/AI workflow in the repo into a optional “story” mode with hints powered by LangChain when API keys are set.',
    priority: 'medium',
    area: 'AI / ML',
  },
  {
    title: 'CI/CD deploy pipeline',
    description:
      'GitHub Actions: build Docker images, run pytest + Vitest + Playwright, migrate DB, deploy to staging then production.',
    priority: 'medium',
    area: 'DevOps',
  },
  {
    title: 'i18n (multiple languages)',
    description:
      'Translate UI strings and word banks; RTL support for Arabic/Hebrew categories.',
    priority: 'nice',
    area: 'Frontend',
  },
  {
    title: 'Achievements & badges',
    description:
      'Unlock badges for perfect rounds, speed runs, or mastering every category once.',
    priority: 'nice',
    area: 'Game design',
  },
  {
    title: 'Share results',
    description:
      'Generate a share card image or link (“I scored 420 on Movies — beat that!”) for social posts.',
    priority: 'nice',
    area: 'Frontend',
  },
  {
    title: 'Word pronunciation',
    description:
      'Optional TTS or audio clips per word in the memorize phase for language-learning categories.',
    priority: 'nice',
    area: 'Frontend',
  },
  {
    title: 'Light / dark theme toggle',
    description:
      'User preference beyond the current dark default; persist choice in localStorage.',
    priority: 'nice',
    area: 'Frontend',
  },
  {
    title: 'Production deploy guide',
    description:
      'Step-by-step for Render/Fly.io (API) + Vercel/Netlify (UI): secrets, CORS, DATABASE_URL, and zero-downtime migrations.',
    priority: 'nice',
    area: 'DevOps',
  },
  {
    title: 'OpenAPI client generation',
    description:
      'Generate a typed TypeScript SDK from FastAPI’s OpenAPI schema so the Angular app never drifts from the API contract.',
    priority: 'nice',
    area: 'Full stack',
  },
];
