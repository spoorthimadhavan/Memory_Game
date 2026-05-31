import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { DocPageShellComponent } from '../../shared/layout/doc-page-shell.component';
import { ROADMAP_ITEMS } from './project-guide.data';

@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [DocPageShellComponent, MatButtonModule, RouterLink],
  template: `
    <app-doc-page-shell
      title="Next version — how to improve"
      subtitle="Ideas to evolve Memory Words from the current MVP into a production-ready product."
    >
      <section class="section intro-block">
        <h2>How to use this page</h2>
        <p>
          Pick items by <strong>priority</strong> and your goal (demo vs. production). Each idea builds on
          what already ships: <strong>25 topic categories</strong>, SQLite game sessions, public contact/suggestion
          forms, Vitest/pytest CI, and the tech stack panel.
        </p>
        <a mat-flat-button class="back-btn" routerLink="/about">← Back to project overview</a>
      </section>

      <section class="section shipped">
        <h2>Already in this version</h2>
        <ul>
          <li>25 category topics with topic-matched distractors</li>
          <li>SQLite session persistence and level scaling</li>
          <li>Contact & suggestion forms (CSV storage on server)</li>
          <li>About page, tech stack quizzes, and Vitest + pytest tests</li>
        </ul>
      </section>

      <section class="section">
        <h2>High priority</h2>
        <p class="section-note">Planned for a more complex, production-ready version (beyond the current SQLite MVP).</p>
        @for (item of highPriority; track item.title) {
          <article class="roadmap-card priority-high">
            <div class="meta">
              <span class="badge high">High</span>
              <span class="area">{{ item.area }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        }
      </section>

      <section class="section">
        <h2>Medium priority</h2>
        <p class="section-note">Polish and engagement after core upgrades.</p>
        @for (item of mediumPriority; track item.title) {
          <article class="roadmap-card priority-medium">
            <div class="meta">
              <span class="badge medium">Medium</span>
              <span class="area">{{ item.area }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        }
      </section>

      <section class="section">
        <h2>Nice to have</h2>
        <p class="section-note">When the app is stable and deployed.</p>
        @for (item of nicePriority; track item.title) {
          <article class="roadmap-card priority-nice">
            <div class="meta">
              <span class="badge nice">Nice</span>
              <span class="area">{{ item.area }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        }
      </section>

      <section class="section steps">
        <h2>Suggested order of work</h2>
        <ol>
          <li>Harden the MVP: rate limits, E2E tests, observability, and mobile layout polish.</li>
          <li>Migrate to <strong>PostgreSQL</strong> — sessions, feedback, and admin users in one database.</li>
          <li>Add <strong>player accounts</strong> and move feedback out of CSV into queryable tables.</li>
          <li>Ship <strong>admin v2</strong> (search, export, reply) and production SMTP emails.</li>
          <li>Game depth: difficulty presets, daily challenge, leaderboards, custom word lists.</li>
          <li>Engagement: sound, PWA, achievements, share cards, and optional quest/AI mode.</li>
          <li>Scale: classroom/multiplayer, i18n, CI/CD deploy, and full production runbook.</li>
        </ol>
        <p>
          Have a feature idea?
          <a routerLink="/suggestion">Send a suggestion</a> or
          <a routerLink="/contact">contact</a> the author.
        </p>
      </section>
    </app-doc-page-shell>
  `,
  styles: `
    .section {
      margin-bottom: 2rem;
    }
    .section h2 {
      color: #fff;
      font-size: 1.35rem;
      margin: 0 0 0.35rem;
    }
    .section-note {
      color: #b39ddb;
      font-size: 0.9rem;
      margin: 0 0 1rem;
    }
    .intro-block p {
      line-height: 1.6;
      color: #d1c4e9;
    }
    .shipped ul {
      margin: 0;
      padding-left: 1.25rem;
      color: #d1c4e9;
      line-height: 1.75;
    }
    .shipped li {
      margin-bottom: 0.35rem;
    }
    .back-btn {
      margin-top: 1rem;
      background: #5c6bc0 !important;
    }
    .roadmap-card {
      background: #1a1630;
      border: 1px solid #3d3560;
      border-radius: 12px;
      padding: 1rem 1.15rem;
      margin-bottom: 0.75rem;
    }
    .roadmap-card h3 {
      margin: 0.35rem 0 0.4rem;
      color: #fff;
      font-size: 1.05rem;
    }
    .roadmap-card p {
      margin: 0;
      line-height: 1.55;
      color: #d1c4e9;
      font-size: 0.95rem;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }
    .badge.high {
      background: #4a148c;
      color: #e1bee7;
    }
    .badge.medium {
      background: #1a237e;
      color: #9fa8da;
    }
    .badge.nice {
      background: #263238;
      color: #b0bec5;
    }
    .area {
      font-size: 0.8rem;
      color: #9575cd;
    }
    .priority-high {
      border-left: 4px solid #b388ff;
    }
    .priority-medium {
      border-left: 4px solid #64b5f6;
    }
    .priority-nice {
      border-left: 4px solid #81c784;
    }
    .steps ol {
      color: #d1c4e9;
      line-height: 1.7;
      padding-left: 1.25rem;
    }
    .steps p {
      margin-top: 1.25rem;
      color: #d1c4e9;
    }
    .steps a {
      color: #b388ff;
    }
  `,
})
export class RoadmapPageComponent {
  readonly highPriority = ROADMAP_ITEMS.filter((i) => i.priority === 'high');
  readonly mediumPriority = ROADMAP_ITEMS.filter((i) => i.priority === 'medium');
  readonly nicePriority = ROADMAP_ITEMS.filter((i) => i.priority === 'nice');
}
