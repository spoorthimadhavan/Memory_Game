import { KeyValuePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { DocPageShellComponent } from '../../shared/layout/doc-page-shell.component';
import { TechStackPanelComponent } from '../../shared/tech-stack/tech-stack-panel.component';
import { TECH_CATEGORIES, TECH_STACK_ITEMS } from '../../shared/tech-stack/tech-stack.data';
import {
  ARCHITECTURE_LAYERS,
  DEV_TOOLS_GUIDE,
  GAME_FLOW_STEPS,
  LOCAL_RUN_COMMANDS,
} from './project-guide.data';

@Component({
  selector: 'app-project-overview-page',
  standalone: true,
  imports: [DocPageShellComponent, MatButtonModule, TechStackPanelComponent, KeyValuePipe, RouterLink],
  template: `
    <app-doc-page-shell
      title="About this project"
      subtitle="Memory Words — what it does, how it is built, and how to run it locally."
    >
      <nav class="toc" aria-label="On this page">
        <a href="#game">Game</a>
        <a href="#project">Project</a>
        <a href="#architecture">Architecture</a>
        <a href="#flow">Flow</a>
        <a href="#run">Run locally</a>
        <a href="#stack">Tech stack</a>
        <a href="#devtools">Dev tools</a>
      </nav>

      <section id="game" class="section">
        <h2>What the game does</h2>
        <p>
          <strong>Memory Words</strong> trains short-term memory under time pressure. You memorize a list of
          words, then find only those words in a larger grid mixed with <em>distractors</em>.
        </p>
        <ul>
          <li><strong>Level 1</strong> starts with <strong>5 words</strong>; each level adds one more (up to 20).</li>
          <li>Memorize time shrinks slowly as levels increase; guess time scales with word count.</li>
          <li>Pass a level by selecting every target word; speed bonus for submitting early.</li>
          <li>
            Choose one of <strong>25 categories</strong> (Food, Harry Potter, IT, …) — words and distractors
            stay on that topic.
          </li>
          <li>Sessions are saved in <strong>SQLite</strong> so score, level, and category persist between rounds.</li>
        </ul>
        <p class="hint">Open the <a routerLink="/">game</a> and tap <strong>Play</strong> to try it.</p>
      </section>

      <section id="project" class="section">
        <h2>What this project is</h2>
        <p>
          A full-stack learning project: <strong>Angular</strong> UI, <strong>FastAPI</strong> API,
          <strong>SQLite</strong> persistence, <strong>Vitest</strong> and <strong>pytest</strong> tests, plus
          Docker and GitHub Actions. With the API running, open
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener">localhost:8000/docs</a> to try endpoints.
        </p>
        <div class="cards">
          <div class="card">
            <h3>Frontend</h3>
            <p>Game, tech stack explorer (why used + run locally), forms, and guide pages.</p>
          </div>
          <div class="card">
            <h3>Backend</h3>
            <p>REST API for memory sessions (SQLite) and public feedback forms (CSV).</p>
          </div>
          <div class="card">
            <h3>Quality</h3>
            <p>Vitest component tests and pytest unit/integration tests in CI.</p>
          </div>
        </div>
      </section>

      <section id="architecture" class="section">
        <h2>Architecture</h2>
        <p>Request path from player to stored game state:</p>
        <div class="diagram" role="img" aria-label="Architecture diagram">
          <div class="layer highlight">Angular app (browser)</div>
          <div class="arrow">HTTP / JSON</div>
          <div class="layer">FastAPI + Uvicorn</div>
          <div class="arrow">services</div>
          <div class="layer">Memory services + Pydantic schemas</div>
          <div class="arrow">read / write</div>
          <div class="layer">words.json + SQLite (data/game.db)</div>
        </div>

        @for (layer of architectureLayers; track layer.name) {
          <details class="layer-detail">
            <summary>{{ layer.name }}</summary>
            <ul>
              @for (item of layer.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </details>
        }
      </section>

      <section id="flow" class="section">
        <h2>Game flow</h2>
        <ol class="flow-list">
          @for (s of flowSteps; track s.step) {
            <li>
              <span class="step-num">{{ s.step }}</span>
              <div>
                <strong>{{ s.label }}</strong>
                <p>{{ s.detail }}</p>
              </div>
            </li>
          }
        </ol>
      </section>

      <section id="run" class="section">
        <h2>Run locally</h2>
        <p>Start the API first, then the UI. Run tests before you push.</p>
        @for (row of localCommands; track row.label) {
          <div class="run-row">
            <span class="run-label">{{ row.label }}</span>
            <code class="run-cmd">{{ row.cmd }}</code>
          </div>
        }
      </section>

      <section id="stack" class="section">
        <h2>Tech stack</h2>
        <p>
          {{ techCount }} technologies in the interactive panel — each includes <strong>why it is used here</strong>,
          <strong>how to run it locally</strong>, a simple explanation, and up to five quiz questions.
        </p>
        <button mat-flat-button class="primary-btn" type="button" (click)="showTechStack.set(true)">
          Open tech stack panel
        </button>

        @for (group of stackByCategory() | keyvalue; track group.key) {
          <div class="stack-group">
            <h3>{{ categoryLabel(group.key) }}</h3>
            <div class="chips">
              @for (t of group.value; track t.id) {
                <span class="chip" [style.borderColor]="t.color">{{ t.name }}</span>
              }
            </div>
          </div>
        }
      </section>

      <section id="devtools" class="section">
        <h2>Development tools (Cursor, ChatGPT, Claude)</h2>
        <p>
          These tools helped build and document Memory Words. They are <strong>not</strong> required to play the
          game — they speed up coding, testing, and writing clear explanations.
        </p>

        @for (tool of devTools; track tool.name) {
          <article class="ai-card" [style.borderLeftColor]="tool.color">
            <h3>{{ tool.name }}</h3>
            <p class="role">{{ tool.role }}</p>
            <dl>
              <dt>Why used</dt>
              <dd>{{ tool.whyUsed }}</dd>
              <dt>How it helps development</dt>
              <dd>{{ tool.devHelp }}</dd>
              <dt>Run locally</dt>
              <dd>{{ tool.runLocally }}</dd>
            </dl>
          </article>
        }
      </section>

      <p class="next-link">
        Ready to plan improvements?
        <a routerLink="/roadmap">See the next-version roadmap →</a>
      </p>
    </app-doc-page-shell>

    @if (showTechStack()) {
      <app-tech-stack-panel (closed)="showTechStack.set(false)" />
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .toc {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      margin-bottom: 2rem;
      padding: 0.75rem 1rem;
      background: #1a1630;
      border-radius: 10px;
      border: 1px solid #3d3560;
    }
    .toc a {
      color: #b388ff;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .toc a:hover {
      color: #fff;
      text-decoration: underline;
    }
    .section {
      margin-bottom: 2.5rem;
      scroll-margin-top: 1rem;
    }
    .section h2 {
      color: #fff;
      font-size: 1.35rem;
      margin: 0 0 0.75rem;
      border-bottom: 1px solid #3d3560;
      padding-bottom: 0.35rem;
    }
    .section p,
    .section li {
      line-height: 1.6;
      color: #d1c4e9;
    }
    .section ul {
      padding-left: 1.25rem;
    }
    .hint a,
    .next-link a {
      color: #b388ff;
    }
    .cards {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      margin-top: 1rem;
    }
    .card {
      background: #1a1630;
      border: 1px solid #3d3560;
      border-radius: 10px;
      padding: 1rem;
    }
    .card h3 {
      margin: 0 0 0.35rem;
      color: #ce93d8;
      font-size: 1rem;
    }
    .card p {
      margin: 0;
      font-size: 0.92rem;
    }
    .diagram {
      background: #12101f;
      border: 1px solid #3d3560;
      border-radius: 12px;
      padding: 1.25rem;
      margin: 1rem 0;
      text-align: center;
    }
    .layer {
      background: #311b92;
      color: #fff;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .layer.highlight {
      background: #4527a0;
    }
    .layer.muted {
      background: #1e2640;
      font-weight: 500;
      font-size: 0.88rem;
      color: #b39ddb;
    }
    .arrow {
      color: #9575cd;
      padding: 0.35rem 0;
      font-size: 0.85rem;
    }
    .run-row {
      margin-bottom: 0.75rem;
      padding: 0.65rem 0.85rem;
      background: #1a1630;
      border-radius: 8px;
      border: 1px solid #3d3560;
    }
    .run-label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #b388ff;
      margin-bottom: 0.35rem;
    }
    .run-cmd {
      font-family: ui-monospace, monospace;
      font-size: 0.82rem;
      color: #e8f5e9;
      word-break: break-word;
    }
    .layer-detail {
      margin: 0.5rem 0;
      background: #1a1630;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      border: 1px solid #2f2850;
    }
    .layer-detail summary {
      cursor: pointer;
      color: #e1bee7;
      font-weight: 600;
    }
    .layer-detail ul {
      margin: 0.5rem 0 0;
      padding-left: 1.25rem;
      color: #c5bde8;
      font-size: 0.92rem;
    }
    code {
      background: #2a2540;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      color: #fff;
      font-size: 0.9em;
    }
    .flow-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .flow-list li {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: flex-start;
    }
    .step-num {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      background: #7c4dff;
      color: #fff;
      border-radius: 50%;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .flow-list p {
      margin: 0.25rem 0 0;
      font-size: 0.92rem;
    }
    .primary-btn {
      margin: 0.75rem 0 1.25rem;
      background: #7c4dff !important;
    }
    .stack-group {
      margin-bottom: 1rem;
    }
    .stack-group h3 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #b388ff;
      margin: 0 0 0.5rem;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .chip {
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      border: 1px solid;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    .ai-card {
      background: #1a1630;
      border: 1px solid #3d3560;
      border-left-width: 4px;
      border-radius: 10px;
      padding: 1rem 1.1rem;
      margin-bottom: 1rem;
    }
    .ai-card h3 {
      margin: 0;
      color: #fff;
    }
    .role {
      margin: 0.2rem 0 0.75rem;
      font-size: 0.88rem;
      color: #b39ddb;
    }
    dl {
      margin: 0;
    }
    dt {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #9575cd;
      margin-top: 0.5rem;
    }
    dd {
      margin: 0.2rem 0 0;
      color: #e8eaf6;
      line-height: 1.5;
      font-size: 0.95rem;
    }
    .next-link {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #3d3560;
      font-size: 1.05rem;
    }
  `,
})
export class ProjectOverviewPageComponent {
  readonly showTechStack = signal(false);
  readonly flowSteps = GAME_FLOW_STEPS;
  readonly architectureLayers = ARCHITECTURE_LAYERS;
  readonly devTools = DEV_TOOLS_GUIDE;
  readonly localCommands = LOCAL_RUN_COMMANDS;
  readonly techCount = TECH_STACK_ITEMS.length;

  readonly stackByCategory = computed(() => {
    const map = new Map<string, typeof TECH_STACK_ITEMS>();
    for (const cat of TECH_CATEGORIES) {
      if (cat.id === 'all') continue;
      const items = TECH_STACK_ITEMS.filter((t) => t.category === cat.id);
      if (items.length) map.set(cat.id, items);
    }
    return map;
  });

  categoryLabel(id: string): string {
    return TECH_CATEGORIES.find((c) => c.id === id)?.label ?? id;
  }
}
