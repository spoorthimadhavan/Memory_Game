import { TechQuizQuestion } from './tech-stack.types';

/** Wrong options are plausible misconceptions; one option is clearly the best answer. */
export const TECH_QUIZZES: Record<string, TechQuizQuestion[]> = {
  angular: [
    {
      question: 'Angular is best described as…',
      options: [
        'A framework for building structured web applications in the browser',
        'A relational database for storing user accounts',
        'A mobile operating system like Android or iOS',
        'A network protocol for sending email',
      ],
      correctIndex: 0,
      explanation: 'Angular helps you build the screens users click on in the browser — like the game board you see.',
    },
    {
      question: 'In a streaming app, Angular’s role is closest to…',
      options: [
        'Building the interactive website UI users browse and click',
        'Encoding video files on the CDN',
        'Managing warehouse inventory for DVDs',
        'Running the credit-card payment processor only',
      ],
      correctIndex: 0,
      explanation: 'The UI is what you see and tap — Angular organizes pages, components, and updates.',
    },
    {
      question: 'An Angular component is…',
      options: [
        'A reusable piece of UI with its own template and logic',
        'A single SQL table in the database',
        'The compiled JavaScript bundle for the whole app',
        'A Docker container image',
      ],
      correctIndex: 0,
      explanation: 'Each component is a screen piece — timer, form, or game board can be its own block.',
    },
    {
      question: 'Why split a large app into Angular components?',
      options: [
        'Easier to maintain and let teams work on separate features',
        'Browsers cannot load more than one HTML file',
        'It removes the need for any backend API',
        'It automatically makes the app work offline',
      ],
      correctIndex: 0,
      explanation: 'Large apps need structure so teams do not break each other’s code.',
    },
    {
      question: 'In this project, Angular runs…',
      options: [
        'In your browser after you open the dev site (e.g. localhost:4200)',
        'Only inside the Python FastAPI process',
        'Only when Docker builds the backend image',
        'Only on GitHub Actions runners, never locally',
      ],
      correctIndex: 0,
      explanation: 'The dev server compiles TypeScript to JavaScript that your browser executes.',
    },
  ],
  signals: [
    {
      question: 'Angular Signals are mainly for…',
      options: [
        'Tracking changing values (score, timer) and updating the UI efficiently',
        'Playing audio files in the browser',
        'Encrypting passwords before login',
        'Compiling TypeScript to JavaScript',
      ],
      correctIndex: 0,
      explanation: 'When your score changes, Signals tell Angular to redraw only what changed.',
    },
    {
      question: 'A traffic-light app that switches red/yellow/green is like Signals because…',
      options: [
        'When state changes, the displayed UI updates to match',
        'Signals control physical electricity in the bulbs',
        'Signals replace HTTP requests entirely',
        'Signals store data permanently in a SQL database',
      ],
      correctIndex: 0,
      explanation: 'Same idea for game phase: memorize vs guess updates the screen.',
    },
    {
      question: 'Compared with older change-detection patterns, Signals help by…',
      options: [
        'Updating only what depends on the changed value',
        'Removing the need for any components',
        'Running Python code in the browser',
        'Blocking all user clicks until reload',
      ],
      correctIndex: 0,
      explanation: 'Fewer wasted re-renders means snappier games and forms.',
    },
    {
      question: 'In Memory Words, Signals track things like…',
      options: [
        'Game phase, countdown, and selected words on screen',
        'Docker container health checks',
        'Git commit history',
        'CSV files on the server disk',
      ],
      correctIndex: 0,
      explanation: 'phase(), memorizeLeft(), and selected() are Signals in the memory page.',
    },
  ],
  material: [
    {
      question: 'Angular Material provides…',
      options: [
        'Pre-built UI components (buttons, toolbars, progress bars)',
        'A cloud database for user profiles',
        'A replacement for TypeScript',
        'Automatic deployment to production',
      ],
      correctIndex: 0,
      explanation: 'Ready-made UI pieces instead of styling every control from scratch.',
    },
    {
      question: 'Material Design in products like Google apps means…',
      options: [
        'Consistent patterns for buttons, spacing, and motion',
        'Every app must use the same purple color only',
        'Icons are not allowed in the interface',
        'The app cannot work without internet',
      ],
      correctIndex: 0,
      explanation: 'Users recognize familiar patterns — submit buttons look clickable across apps.',
    },
    {
      question: 'mat-progress-bar in our game shows…',
      options: [
        'How much memorize time is left',
        'Server CPU temperature',
        'Number of emails in an inbox',
        'GitHub Actions build duration only',
      ],
      correctIndex: 0,
      explanation: 'Visual feedback during the memorize countdown.',
    },
    {
      question: 'Using Material instead of only custom CSS helps because…',
      options: [
        'Teams ship faster with accessible, tested components',
        'Browsers block all custom CSS by default',
        'Material removes the need for HTML',
        'Material runs only on the server',
      ],
      correctIndex: 0,
      explanation: 'Consistency and defaults matter in portfolios and production apps.',
    },
  ],
  typescript: [
    {
      question: 'TypeScript is…',
      options: [
        'JavaScript with optional static types checked at build time',
        'A database query language like SQL',
        'A browser that replaces Chrome',
        'A Python package manager',
      ],
      correctIndex: 0,
      explanation: 'Types catch mistakes early: score must be a number, not accidentally text.',
    },
    {
      question: 'Types in TypeScript are most like…',
      options: [
        'Blueprints that describe what shape data should have',
        'The color theme of the website',
        'The hostname of the API server',
        'The size of image files only',
      ],
      correctIndex: 0,
      explanation: 'They prevent putting the wrong kind of value in the wrong place.',
    },
    {
      question: 'Browsers execute…',
      options: [
        'JavaScript (TypeScript is compiled to JS first)',
        'TypeScript source files directly without compilation',
        'Python files from the backend folder',
        'SQL queries in the DOM',
      ],
      correctIndex: 0,
      explanation: 'ng build converts .ts files to .js the browser understands.',
    },
    {
      question: 'memory.models.ts uses TypeScript to…',
      options: [
        'Describe API response shapes from the server',
        'Store game sessions in JSON files',
        'Run pytest on the backend',
        'Configure Docker networking',
      ],
      correctIndex: 0,
      explanation: 'If the server changes a field name, TypeScript warns you while coding.',
    },
  ],
  rxjs: [
    {
      question: 'RxJS is mainly used for…',
      options: [
        'Handling data streams over time (HTTP, events, async updates)',
        'Styling CSS grids and flexbox',
        'Defining database table schemas',
        'Building Docker images',
      ],
      correctIndex: 0,
      explanation: 'Observables deliver values when they arrive — like waiting for an HTTP response.',
    },
    {
      question: 'A ride-share app receiving live driver location updates is like…',
      options: [
        'Subscribing to a stream of GPS updates over time',
        'Loading one static image once and never changing',
        'Writing data only to a printed receipt',
        'Ignoring network responses entirely',
      ],
      correctIndex: 0,
      explanation: 'Many apps need ongoing updates, not just one fixed answer.',
    },
    {
      question: 'subscribe() on an HTTP Observable means…',
      options: [
        'Run this code when the response arrives (or errors)',
        'Cancel all network requests permanently',
        'Compile the Angular app to production',
        'Save the session to a CSV file',
      ],
      correctIndex: 0,
      explanation: 'start().subscribe(...) kicks off the call and handles success or error.',
    },
    {
      question: 'HTTP + RxJS in this app is used when…',
      options: [
        'Starting a game or submitting memory guesses',
        'Generating TF-IDF vectors on the server only',
        'Building the Docker image in CI',
        'Writing unit tests for Pydantic models',
      ],
      correctIndex: 0,
      explanation: 'memory-api.service.ts wraps REST calls as Observables.',
    },
  ],
  fastapi: [
    {
      question: 'FastAPI is…',
      options: [
        'A Python framework for building HTTP APIs',
        'A frontend library for Angular components',
        'A NoSQL database like MongoDB',
        'A CI/CD platform like GitHub Actions',
      ],
      correctIndex: 0,
      explanation: 'The Angular game asks the server for words and scores over HTTP.',
    },
    {
      question: 'When a food-delivery app loads the menu, the server’s role is like FastAPI…',
      options: [
        'Returning structured JSON the client can display',
        'Rendering HTML inside the user’s GPU only',
        'Storing photos in the phone’s gallery app',
        'Replacing the mobile app store',
      ],
      correctIndex: 0,
      explanation: 'Frontend asks for data → backend responds with JSON.',
    },
    {
      question: 'Opening /docs on a running FastAPI app shows…',
      options: [
        'Interactive API documentation (Swagger UI)',
        'The project’s README rendered as PDF',
        'Live server log files only',
        'A database admin console',
      ],
      correctIndex: 0,
      explanation: 'Auto-generated docs let you try endpoints in the browser.',
    },
    {
      question: 'Memory Words backend routes include…',
      options: [
        '/memory/start, /memory/{id}/round, /memory/guess',
        '/angular/build and /npm/install',
        '/docker/compose/up only',
        '/github/actions/run',
      ],
      correctIndex: 0,
      explanation: 'See app/api/routes/memory.py.',
    },
    {
      question: 'FastAPI is popular partly because it…',
      options: [
        'Combines speed, async support, and automatic request validation',
        'Requires no Python code at all',
        'Runs only inside Angular',
        'Replaces the need for any tests',
      ],
      correctIndex: 0,
      explanation: 'Good performance and developer experience for ML and web backends.',
    },
  ],
  pydantic: [
    {
      question: 'Pydantic validates…',
      options: [
        'That request/response data matches defined types and rules',
        'That CSS colors match Material Design',
        'That Git commits have signed messages',
        'That Docker images are under 100 MB',
      ],
      correctIndex: 0,
      explanation: 'Like a bouncer: email must look like email, message at least 10 characters.',
    },
    {
      question: 'Airport security checking bags is like Pydantic checking…',
      options: [
        'Incoming JSON for invalid or missing fields',
        'Whether the pilot’s uniform matches a brand',
        'The color of the runway lights',
        'Passenger seat preferences only',
      ],
      correctIndex: 0,
      explanation: 'Stops bad requests before they break game logic.',
    },
    {
      question: 'If a client sends score="banana", Pydantic will…',
      options: [
        'Reject it with a validation error (expected a number)',
        'Silently convert it to 0 with no warning',
        'Delete all session files',
        'Skip validation for that field',
      ],
      correctIndex: 0,
      explanation: 'Validation errors become HTTP 422 with helpful messages.',
    },
    {
      question: 'The contact form backend uses a Pydantic model for…',
      options: [
        'name, email, and message fields with length rules',
        'Only image uploads',
        'Docker container names',
        'Angular route paths',
      ],
      correctIndex: 0,
      explanation: 'schemas/feedback.py defines the rules.',
    },
  ],
  uvicorn: [
    {
      question: 'Uvicorn’s job is to…',
      options: [
        'Serve the FastAPI application over HTTP',
        'Compile TypeScript to JavaScript',
        'Run Karma unit tests in the browser',
        'Store game sessions in PostgreSQL',
      ],
      correctIndex: 0,
      explanation: 'It listens for requests and passes them to your Python code.',
    },
    {
      question: 'A restaurant host seating guests is like Uvicorn…',
      options: [
        'Accepting HTTP connections on a port (e.g. 8000)',
        'Writing every recipe in the kitchen',
        'Designing the menu typography',
        'Delivering food to tables',
      ],
      correctIndex: 0,
      explanation: 'Without a server process, your API code never runs.',
    },
    {
      question: 'A common local command to run this API is…',
      options: [
        'uvicorn app.main:app --reload',
        'ng serve --open',
        'docker push origin main',
        'pytest --cov only',
      ],
      correctIndex: 0,
      explanation: '--reload restarts when you save Python files during development.',
    },
  ],
  sqlite: [
    {
      question: 'SQLite in this project stores…',
      options: [
        'Game sessions in a local file database (data/game.db)',
        'Only the Angular build output',
        'Video files for the UI',
        'Git commit messages',
      ],
      correctIndex: 0,
      explanation: 'Each row holds session_id and JSON state for level, score, and words.',
    },
    {
      question: 'Why SQLite for this MVP?',
      options: [
        'No separate database server — one file, easy to run locally',
        'It replaces the need for FastAPI',
        'It only works inside the browser',
        'It cannot store JSON text',
      ],
      correctIndex: 0,
      explanation: 'Meets database requirements without Docker Postgres for development.',
    },
    {
      question: 'DATABASE_URL in backend .env is typically…',
      options: [
        'sqlite:///./data/game.db',
        'postgres://localhost:5432/memory',
        'http://localhost:4200',
        'npm://frontend/start',
      ],
      correctIndex: 0,
      explanation: 'memory_repository.py resolves this path under the backend folder.',
    },
  ],
  vitest: [
    {
      question: 'Vitest in this repo is used for…',
      options: [
        'Running frontend unit and component tests',
        'Compiling Python on the server',
        'Storing SQLite rows',
        'Building Docker images only',
      ],
      correctIndex: 0,
      explanation: 'Specs live in src/**/*.spec.ts and run with npm run test:ci.',
    },
    {
      question: 'Compared with Karma, Vitest is often chosen because…',
      options: [
        'Faster startup and a familiar Jest-like API',
        'It removes the need for TypeScript',
        'It only tests CSS files',
        'It runs only in production',
      ],
      correctIndex: 0,
      explanation: 'Common modern choice for Vite/Angular projects moving off Karma.',
    },
    {
      question: 'To run frontend tests locally you use…',
      options: [
        'cd frontend && npm run test:ci',
        'cd backend && pytest only',
        'docker compose down',
        'ng serve --prod only',
      ],
      correctIndex: 0,
      explanation: 'Vitest runs headless in CI the same way.',
    },
  ],
  testing: [
    {
      question: 'Automated testing in this project helps by…',
      options: [
        'Catching bugs before users see them, on every code change',
        'Replacing the need to write any application code',
        'Making the UI work without a browser',
        'Storing game sessions in the cloud automatically',
      ],
      correctIndex: 0,
      explanation: 'Tests are safety nets — they fail when behavior breaks.',
    },
    {
      question: 'A unit test is best described as…',
      options: [
        'Checking one function or class in isolation with mocks',
        'Always requiring a live production database',
        'Only testing CSS colors in the browser',
        'Running only once per year before launch',
      ],
      correctIndex: 0,
      explanation: 'Fast, focused tests — e.g. level rules or word sampling logic.',
    },
    {
      question: 'An integration test in this repo typically…',
      options: [
        'Calls the FastAPI app over HTTP and checks real responses',
        'Only reads README files',
        'Compiles Docker images without running code',
        'Skips the API and only tests HTML strings',
      ],
      correctIndex: 0,
      explanation: 'Integration tests use TestClient to exercise `/memory/*` routes.',
    },
    {
      question: 'Frontend tests in this project use…',
      options: [
        'Vitest with Angular TestBed for components and services',
        'Pytest inside the browser tab',
        'Only manual clicking with no scripts',
        'SQL queries in the DOM',
      ],
      correctIndex: 0,
      explanation: '`npm run test:ci` runs Vitest specs for memory-page, API service, and tech stack.',
    },
    {
      question: 'In CI, tests run when…',
      options: [
        'You push or open a pull request — GitHub Actions runs both jobs',
        'Only on the developer’s birthday',
        'After users report a bug in production',
        'Never — tests are documentation only',
      ],
      correctIndex: 0,
      explanation: 'ci.yml runs backend pytest (unit + integration) and frontend `test:ci`.',
    },
  ],
  pytest: [
    {
      question: 'Pytest is used for…',
      options: [
        'Automated tests that verify code behavior',
        'Deploying containers to production',
        'Styling Angular components',
        'Generating OpenAPI documentation',
      ],
      correctIndex: 0,
      explanation: 'Tests check: “if I call /memory/start, do I get a session_id?”',
    },
    {
      question: 'Factory crash tests are like pytest tests because they…',
      options: [
        'Catch problems before real users hit them',
        'Only measure paint color',
        'Replace all manual coding',
        'Run only once per year',
      ],
      correctIndex: 0,
      explanation: 'CI runs pytest on every push in this repo.',
    },
    {
      question: 'Integration tests differ from unit tests because they…',
      options: [
        'Exercise the real HTTP API end-to-end',
        'Never import Python modules',
        'Only test CSS in the browser',
        'Require a physical VR headset',
      ],
      correctIndex: 0,
      explanation: 'Unit = one function; integration = full path through FastAPI.',
    },
  ],
  'json-sessions': [
    {
      question: 'JSON session files in this project store…',
      options: [
        'Game state such as level, score, and player name',
        '4K video streams',
        'Compiled Angular bundles',
        'Docker layer cache',
      ],
      correctIndex: 0,
      explanation: 'JSON is human-readable — like a save file in a video game.',
    },
    {
      question: 'Saving a Minecraft world to disk is like our sessions because…',
      options: [
        'Progress persists between API calls',
        'The game runs only in the browser with no server',
        'All data must live in RAM only',
        'Sessions replace HTTP entirely',
      ],
      correctIndex: 0,
      explanation: 'MVP storage before upgrading to a database.',
    },
    {
      question: 'Session files are stored under…',
      options: [
        'backend/data/sessions/',
        'frontend/node_modules/',
        'The user’s browser cache only',
        '.github/workflows/',
      ],
      correctIndex: 0,
      explanation: 'memory_repository.py reads and writes these paths.',
    },
  ],
  'word-bank': [
    {
      question: 'The word bank in Memory Words is…',
      options: [
        'A list of words the game randomly draws from',
        'A financial account for in-app purchases',
        'The river bank in a geography quiz',
        'A backup of Git branches',
      ],
      correctIndex: 0,
      explanation: 'data/words.json feeds both target words and distractors.',
    },
    {
      question: 'A quiz host drawing from a question deck is like our…',
      options: [
        'words.json pool used by build_round()',
        'Dockerfile HEALTHCHECK',
        'Angular router configuration',
        'LangSmith trace IDs',
      ],
      correctIndex: 0,
      explanation: 'The service samples targets plus decoys from the pool.',
    },
    {
      question: 'Distractors in the guess phase are…',
      options: [
        'Extra words you did not memorize, mixed into the grid',
        'Only the words you were asked to remember',
        'Sound effects played on wrong taps',
        'Server error messages',
      ],
      correctIndex: 0,
      explanation: 'You must remember which words you saw, not tap everything.',
    },
  ],
  langgraph: [
    {
      question: 'LangGraph models an AI workflow as…',
      options: [
        'A graph of steps (nodes) connected by transitions (edges)',
        'One single prompt with no structure',
        'A CSS stylesheet for the UI',
        'A replacement for HTTP',
      ],
      correctIndex: 0,
      explanation: 'Like a board game: move from validate → score → explain.',
    },
    {
      question: 'A factory assembly line is like LangGraph because…',
      options: [
        'Each station (node) performs one job in sequence',
        'One worker does every task at random',
        'The line only sends faxes',
        'No step can be tested independently',
      ],
      correctIndex: 0,
      explanation: 'Used in the quest module for adaptive learning flow.',
    },
    {
      question: 'A “node” in LangGraph is…',
      options: [
        'One step in the workflow, such as validate or explain',
        'A physical network cable',
        'An Angular component selector',
        'A row in a CSV file only',
      ],
      correctIndex: 0,
      explanation: 'quest_graph.py chains validate → evaluate → explain steps.',
    },
    {
      question: 'Why use a graph instead of one huge prompt?',
      options: [
        'Easier to test, debug, and change one step at a time',
        'Graphs always use less electricity than all code',
        'Prompts are not allowed in Python',
        'Graphs remove the need for any LLM',
      ],
      correctIndex: 0,
      explanation: 'Observability per step is a strong interview talking point.',
    },
  ],
  langchain: [
    {
      question: 'LangChain helps you…',
      options: [
        'Connect to LLMs with prompts and structured outputs',
        'Chain Docker containers in compose files',
        'Manage Git branch merges',
        'Compile SCSS to CSS',
      ],
      correctIndex: 0,
      explanation: 'Wraps OpenAI (or others) so Python can ask for tutor-style feedback.',
    },
    {
      question: 'A translator app sending text to a model is like LangChain as…',
      options: [
        'The layer that formats and sends the prompt, then parses the reply',
        'The phone’s cellular antenna hardware',
        'The app icon on the home screen',
        'The user’s account password',
      ],
      correctIndex: 0,
      explanation: 'Prompt templates say things like “explain in two sentences.”',
    },
    {
      question: 'Structured output from an LLM means…',
      options: [
        'The response matches fields you expect (e.g. JSON shape)',
        'The model only returns random emojis',
        'No text is allowed in the reply',
        'The output is always a single number',
      ],
      correctIndex: 0,
      explanation: 'Reduces rambling and makes downstream code reliable.',
    },
  ],
  chatgpt: [
    {
      question: 'ChatGPT is best described as…',
      options: [
        'A large language model that generates text from prompts',
        'A relational database for storing user passwords',
        'A CSS framework for Angular buttons',
        'A tool that compiles TypeScript to JavaScript',
      ],
      correctIndex: 0,
      explanation: 'LLMs predict helpful text — explanations, summaries, and tutor feedback.',
    },
    {
      question: 'In this project, ChatGPT can be used through…',
      options: [
        'LangChain’s ChatOpenAI wrapper in llm_service.py',
        'The Angular router configuration only',
        'Docker HEALTHCHECK directives',
        'pytest fixtures without any API key',
      ],
      correctIndex: 0,
      explanation: 'Python calls the OpenAI API when USE_MOCK_LLM is false and OPENAI_API_KEY is set.',
    },
    {
      question: 'A tutor app explaining why an answer was wrong is like ChatGPT because…',
      options: [
        'It turns student context into natural-language feedback',
        'It stores game sessions only in JSON files',
        'It replaces the need for any frontend',
        'It runs only inside the browser without a server',
      ],
      correctIndex: 0,
      explanation: 'The quest module can ask the model for short, kid-friendly explanations.',
    },
    {
      question: 'OPENAI_API_KEY should be stored…',
      options: [
        'In environment variables, not committed to public git',
        'Hard-coded in every TypeScript component',
        'Inside words.json next to game words',
        'In the Angular index.html title tag',
      ],
      correctIndex: 0,
      explanation: 'Secrets belong in .env on the server, same as other API keys.',
    },
    {
      question: 'Compared to rule-only scoring, an LLM can help by…',
      options: [
        'Giving varied explanations when wording differs from the rubric',
        'Removing the need for any validation',
        'Making HTTP requests unnecessary',
        'Running only when the internet is offline',
      ],
      correctIndex: 0,
      explanation: 'TF-IDF checks similarity; LLMs can phrase feedback in a friendly way.',
    },
  ],
  claude: [
    {
      question: 'Claude is made by…',
      options: [
        'Anthropic',
        'OpenAI',
        'Google Chrome team',
        'Docker Inc.',
      ],
      correctIndex: 0,
      explanation: 'Anthropic builds the Claude model family; OpenAI builds GPT/ChatGPT.',
    },
    {
      question: 'Claude and ChatGPT are both…',
      options: [
        'Large language models used for text generation and assistance',
        'Frontend routing libraries for Angular',
        'Database engines for SQL queries',
        'Container orchestrators like Kubernetes',
      ],
      correctIndex: 0,
      explanation: 'Different vendors, similar idea: prompt in → helpful text out.',
    },
    {
      question: 'A developer asking an AI to explain a stack trace is using Claude/GPT like…',
      options: [
        'A coding mentor that reads context and suggests fixes',
        'A replacement for all unit tests',
        'A way to skip version control',
        'A browser that replaces Chrome',
      ],
      correctIndex: 0,
      explanation: 'LLMs help learn and debug; you still review and run tests yourself.',
    },
    {
      question: 'This repo’s backend currently calls OpenAI, but Claude could be integrated by…',
      options: [
        'Using a similar LangChain chat model class with Anthropic credentials',
        'Deleting all Python files',
        'Moving FastAPI into the Angular bundle',
        'Disabling CORS permanently',
      ],
      correctIndex: 0,
      explanation: 'Same pattern: prompt template + structured output + API key in env.',
    },
    {
      question: 'When choosing between Claude and ChatGPT for a task, teams often compare…',
      options: [
        'Answer quality, safety, cost, and latency for their use case',
        'Only the logo color',
        'Whether the model compiles SCSS',
        'How many Docker layers the model has',
      ],
      correctIndex: 0,
      explanation: 'Different models shine on different tasks — try both for your workflow.',
    },
  ],
  cursor: [
    {
      question: 'Cursor is primarily…',
      options: [
        'An AI-assisted code editor for writing and editing projects',
        'A cloud database for storing game sessions',
        'A replacement for GitHub Actions',
        'A Python package manager like pip',
      ],
      correctIndex: 0,
      explanation: 'Cursor helps you edit code in your repo with AI pair programming.',
    },
    {
      question: 'Cursor is built on top of ideas from…',
      options: [
        'VS Code–style editing with extra AI features',
        'Microsoft Excel spreadsheets',
        'A mobile app store only',
        'A word processor for essays only',
      ],
      correctIndex: 0,
      explanation: 'Familiar editor experience plus chat, agents, and inline edits.',
    },
    {
      question: 'Asking Cursor to “fix contrast on dark forms” is like…',
      options: [
        'Having a teammate update the right files while you review the diff',
        'Automatically deploying to production with no review',
        'Deleting node_modules on every save',
        'Replacing Angular with a static PDF',
      ],
      correctIndex: 0,
      explanation: 'You stay in control — read changes, run tests, then commit.',
    },
    {
      question: 'Cursor agents can help on this project by…',
      options: [
        'Editing frontend/backend files, running tests, and updating docs',
        'Hosting the API on Mars only',
        'Removing the need for TypeScript',
        'Playing the memory game instead of the user',
      ],
      correctIndex: 0,
      explanation: 'Agents work in your workspace — same repo you open locally.',
    },
    {
      question: 'Using Cursor alongside ChatGPT or Claude is common because…',
      options: [
        'Cursor works inside your repo; chat models can also answer general questions',
        'They are the same product with the same name',
        'Only one AI tool is allowed per developer',
        'Cursor cannot open TypeScript files',
      ],
      correctIndex: 0,
      explanation: 'Editor AI for code changes; web chat for brainstorming — many devs use both.',
    },
  ],
  langsmith: [
    {
      question: 'LangSmith is mainly for…',
      options: [
        'Tracing and debugging LLM calls in development and production',
        'Compiling TypeScript in CI',
        'Hosting static Angular files',
        'Running SQL migrations',
      ],
      correctIndex: 0,
      explanation: 'See prompts, latency, and failures when AI is live.',
    },
    {
      question: 'A flight data recorder is like LangSmith because it…',
      options: [
        'Records what was asked and what the model returned',
        'Flies the airplane automatically',
        'Replaces the pilot’s training manual',
        'Only tracks airport parking fees',
      ],
      correctIndex: 0,
      explanation: 'Enable LANGCHAIN_TRACING_V2 in .env to use it.',
    },
    {
      question: 'Without observability, AI bugs often feel like…',
      options: [
        'A black box — hard to see why an answer went wrong',
        'Something that can never be improved',
        'A problem only browsers can fix',
        'Something that only affects CSS',
      ],
      correctIndex: 0,
      explanation: 'Teams need traces for quality and compliance.',
    },
  ],
  sklearn: [
    {
      question: 'TF-IDF in scikit-learn compares text by…',
      options: [
        'Weighting important words, not only exact string match',
        'Measuring font size in pixels',
        'Using GPS coordinates',
        'Counting keyboard key presses',
      ],
      correctIndex: 0,
      explanation: 'Finds if answers discuss similar concepts with different wording.',
    },
    {
      question: 'Search engines matching pages to a query is related to TF-IDF as…',
      options: [
        'A similar idea at smaller scale for text similarity',
        'The same as video frame encoding',
        'Unrelated to any text processing',
        'Only used for image classification',
      ],
      correctIndex: 0,
      explanation: 'Used in evaluation_service.py for quest answers.',
    },
    {
      question: 'Cosine similarity between two vectors measures…',
      options: [
        'How alike their directions are (often scored 0–1)',
        'Temperature in Celsius',
        'Vehicle speed on a highway',
        'Monitor brightness in nits',
      ],
      correctIndex: 0,
      explanation: 'High score = similar meaning even with different words.',
    },
  ],
  numpy: [
    {
      question: 'NumPy is especially good at…',
      options: [
        'Fast numerical operations on arrays of numbers',
        'Sending HTML email templates',
        'Defining REST API routes',
        'Managing Git hooks',
      ],
      correctIndex: 0,
      explanation: 'XP formulas use clip() so scores stay in a fair range.',
    },
    {
      question: 'Spreadsheet math in Excel is closest to NumPy for…',
      options: [
        'Doing bulk number math quickly inside Python programs',
        'Rendering Angular templates',
        'Validating form emails',
        'Tracing LLM calls',
      ],
      correctIndex: 0,
      explanation: 'memory_level_service uses numeric logic for multipliers.',
    },
    {
      question: 'np.clip when scoring helps by…',
      options: [
        'Keeping values within minimum and maximum bounds',
        'Removing all bugs automatically',
        'Fixing network timeouts',
        'Enabling dark mode in the UI',
      ],
      correctIndex: 0,
      explanation: 'Keeps scores fair and predictable.',
    },
  ],
  pandas: [
    {
      question: 'Pandas is designed for…',
      options: [
        'Working with tabular data (rows and columns) in Python',
        'Rendering 3D graphics in WebGL',
        'Compiling Docker images',
        'Running browser Karma tests',
      ],
      correctIndex: 0,
      explanation: 'Loads and analyzes tables like quest history CSV.',
    },
    {
      question: 'A school tracking test scores in a spreadsheet is like Pandas…',
      options: [
        'Loading a CSV and analyzing rows in code',
        'Sending push notifications only',
        'Building the Angular router',
        'Configuring CORS headers',
      ],
      correctIndex: 0,
      explanation: 'quest_history.csv stores past answers for analysis.',
    },
    {
      question: 'CSV files are used in the MVP because they…',
      options: [
        'Are simple to inspect without running a database server',
        'Are required by Angular Material',
        'Are always faster than every database for all workloads',
        'Cannot be replaced by SQL ever',
      ],
      correctIndex: 0,
      explanation: 'Easy portfolio demo; PostgreSQL is a natural upgrade later.',
    },
  ],
  docker: [
    {
      question: 'Docker packages an application with…',
      options: [
        'Its runtime dependencies in a portable container image',
        'Only the favicon and logo assets',
        'Only the frontend TypeScript source without Node',
        'User passwords in plain text by default',
      ],
      correctIndex: 0,
      explanation: 'Runs the same on your laptop and in the cloud.',
    },
    {
      question: 'Shipping a lunch box with everything inside is like Docker…',
      options: [
        'Bundling app + dependencies so the environment is consistent',
        'Only delivering the restaurant building',
        'Replacing the need for any source code',
        'Running only on one developer’s laptop forever',
      ],
      correctIndex: 0,
      explanation: 'DevOps ships containers to Render, Azure, AWS, etc.',
    },
    {
      question: 'docker-compose in this repo can…',
      options: [
        'Start backend and frontend together with one command',
        'Replace all unit tests',
        'Compile LangGraph graphs automatically',
        'Only build GitHub Actions workflows',
      ],
      correctIndex: 0,
      explanation: 'See docker-compose.yml in the repo root.',
    },
    {
      question: 'A Dockerfile HEALTHCHECK is used to…',
      options: [
        'Let orchestrators know if the API process is still healthy',
        'Delete old session files every hour',
        'Change Angular theme colors',
        'Send marketing emails',
      ],
      correctIndex: 0,
      explanation: 'Platforms can restart unhealthy containers.',
    },
  ],
  'github-actions': [
    {
      question: 'GitHub Actions runs…',
      options: [
        'Automated workflows when you push or open a pull request',
        'Only local games on your laptop',
        'Only database migrations in production',
        'Only Docker builds on your phone',
      ],
      correctIndex: 0,
      explanation: 'CI runs tests and builds on every change.',
    },
    {
      question: 'A factory quality belt checking each product is like CI…',
      options: [
        'Checking each code change before it ships',
        'Skipping tests to save time',
        'Only running on holidays',
        'Only validating commit message spelling',
      ],
      correctIndex: 0,
      explanation: '.github/workflows/ci.yml runs pytest and ng build.',
    },
    {
      question: 'If tests fail in CI, the professional response is to…',
      options: [
        'Fix the code before merging — a red build blocks release',
        'Merge anyway and fix later without telling anyone',
        'Delete the repository',
        'Disable all tests permanently',
      ],
      correctIndex: 0,
      explanation: 'Teams protect the main branch from broken builds.',
    },
  ],
  'env-config': [
    {
      question: 'Environment variables typically store…',
      options: [
        'Secrets and settings (API keys, URLs) outside source code',
        'Only UI button labels',
        'Only compiled JavaScript bundles',
        'Only image files for the logo',
      ],
      correctIndex: 0,
      explanation: '.env on the server; environment.ts in Angular.',
    },
    {
      question: 'API keys should live in env vars because…',
      options: [
        'They should not be committed to public Git repositories',
        'Browsers cannot read environment variables',
        'Git automatically encrypts all Python files',
        'Docker forbids using .env files',
      ],
      correctIndex: 0,
      explanation: 'Never commit OPENAI_API_KEY to git.',
    },
    {
      question: 'CORS_ORIGINS on the backend tells the server…',
      options: [
        'Which frontend origins may call the API from a browser',
        'Which CSS primary color to use',
        'How many words to show per level',
        'Which pytest markers to run',
      ],
      correctIndex: 0,
      explanation: 'Browser security limits cross-origin API access.',
    },
    {
      question: 'environment.prod.ts in Angular changes…',
      options: [
        'The API base URL when deployed to production',
        'The laws of physics in the game',
        'The number of CPU cores on the server',
        'Whether TypeScript is enabled',
      ],
      correctIndex: 0,
      explanation: 'localhost in dev; your hosted URL in prod.',
    },
  ],
};
