import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MemoryApiService } from '../../core/api/memory-api.service';
import {
  GamePhase,
  MemoryGuessResponse,
  MemoryRoundResponse,
  WordCategory,
} from '../../core/models/memory.models';
import { TechStackPanelComponent } from '../../shared/tech-stack/tech-stack-panel.component';
import { AppFooterComponent } from '../../shared/layout/app-footer.component';
import { AppSiteToolbarComponent } from '../../shared/layout/app-site-toolbar.component';
import { TECH_STACK_ITEMS } from '../../shared/tech-stack/tech-stack.data';

@Component({
  selector: 'app-memory-page',
  standalone: true,
  imports: [
    DecimalPipe,
    MatButtonModule,
    AppSiteToolbarComponent,
    MatChipsModule,
    MatProgressBarModule,
    TechStackPanelComponent,
    AppFooterComponent,
  ],
  template: `
    <app-site-toolbar>
      <div class="toolbar-actions">
        <button mat-button class="stack-btn" type="button" (click)="showTechStack.set(true)">
          Tech stack
        </button>
        @if (sessionId()) {
          <span class="stat topic">{{ categoryLabel() }}</span>
          <span class="stat">Lv {{ level() }}</span>
          <span class="stat">{{ totalScore() }} pts</span>
        }
      </div>
    </app-site-toolbar>

    <main class="page">
      @if (phase() === 'idle') {
        <section class="hero">
          <h1>Remember. Find. Level up.</h1>
          <p>
            Pick a <strong>topic</strong>. Level 1 starts with <strong>5 words</strong> from that
            topic only — distractors are from the same topic. Each level adds one more word.
          </p>

          <p class="category-heading">Choose a category ({{ categories().length }} topics)</p>
          @if (categoriesLoading()) {
            <p class="category-hint">Loading topics...</p>
          } @else {
            <div class="category-grid">
              @for (cat of categories(); track cat.id) {
                <button
                  type="button"
                  class="category-chip"
                  [class.selected]="selectedCategoryId() === cat.id"
                  (click)="selectCategory(cat.id)"
                >
                  {{ cat.label }}
                </button>
              }
            </div>
          }

          <button
            mat-flat-button
            class="play"
            (click)="startGame()"
            [disabled]="loading() || !selectedCategoryId()"
          >
            {{ loading() ? 'Loading...' : 'Play' }}
          </button>
          @if (!selectedCategoryId() && !categoriesLoading()) {
            <p class="category-hint">Select a category to start.</p>
          }

          <div class="stack-preview">
            <p class="stack-label">Built with</p>
            <div class="stack-pills">
              @for (t of previewTech; track t.id) {
                <button
                  type="button"
                  class="stack-pill"
                  [style.--c]="t.color"
                  (click)="showTechStack.set(true)"
                >
                  {{ t.name }}
                </button>
              }
              <button type="button" class="stack-pill more" (click)="showTechStack.set(true)">
                +{{ techCount - previewTech.length }} more
              </button>
            </div>
          </div>
        </section>
      }

      @if (showTechStack()) {
        <app-tech-stack-panel (closed)="showTechStack.set(false)" />
      }

      @if (phase() === 'memorize') {
        <section class="phase memorize">
          <p class="phase-label">Memorize these {{ categoryLabel() }} words</p>
          <div class="timer" [class.urgent]="memorizeLeft() <= 3">{{ memorizeLeft() | number: '1.0-0' }}s</div>
          <div class="word-grid memorize-grid">
            @for (w of memorizeWords(); track w) {
              <span class="word-card show">{{ w }}</span>
            }
          </div>
          <mat-progress-bar mode="determinate" [value]="memorizeProgress()" />
        </section>
      }

      @if (phase() === 'guess') {
        <section class="phase guess">
          <p class="phase-label">Tap every {{ categoryLabel() }} word you memorized</p>
          <div class="timer guess-timer" [class.urgent]="guessLeft() <= 5">{{ guessLeft() | number: '1.1-1' }}s</div>
          <p class="picked">{{ selected().length }} selected</p>
          <div class="word-grid choice-grid">
            @for (w of choices(); track w) {
              <button
                type="button"
                class="word-chip"
                [class.selected]="isSelected(w)"
                (click)="toggleWord(w)"
              >
                {{ w }}
              </button>
            }
          </div>
          <button mat-flat-button class="submit" (click)="submitGuess()">Done</button>
        </section>
      }

      @if (phase() === 'result' && lastResult(); as r) {
        <section class="phase result" [class.pass]="r.passed">
          <h2>{{ r.passed ? 'Level cleared!' : 'Not quite' }}</h2>
          <p>{{ r.message }}</p>
          <div class="stats">
            <span>Accuracy {{ (r.accuracy * 100) | number: '1.0-0' }}%</span>
            <span>+{{ r.score_earned }} pts</span>
          </div>
          @if (r.misses.length) {
            <p class="missed">Missed: {{ r.misses.join(', ') }}</p>
          }
          @if (r.false_picks.length) {
            <p class="false">Wrong picks: {{ r.false_picks.join(', ') }}</p>
          }
          <button mat-flat-button class="play" (click)="afterResult(r)">
            {{ r.passed ? 'Next level' : 'Try again' }}
          </button>
        </section>
      }

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </main>
    <app-footer />
  `,
  styles: `
    .stat {
      margin-left: 1rem;
      font-weight: 600;
    }
    .stat.topic {
      color: #ce93d8;
      font-size: 0.85rem;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .category-heading {
      margin: 1.5rem 0 0.75rem;
      font-weight: 600;
      color: #e1bee7;
    }
    .category-hint {
      font-size: 0.9rem;
      color: #b39ddb;
      margin-top: 0.5rem;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 0.5rem;
      margin-bottom: 1rem;
      max-height: 280px;
      overflow-y: auto;
      padding: 0.25rem;
    }
    .category-chip {
      border: 2px solid #5c6bc0;
      background: #1a1630;
      color: #fff;
      border-radius: 10px;
      padding: 0.55rem 0.65rem;
      font-size: 0.82rem;
      cursor: pointer;
      line-height: 1.25;
      text-align: center;
      transition:
        border-color 0.15s,
        background 0.15s;
    }
    .category-chip:hover {
      border-color: #b388ff;
      background: #2a2548;
    }
    .category-chip.selected {
      border-color: #b388ff;
      background: #4527a0;
      box-shadow: 0 0 12px rgba(124, 77, 255, 0.35);
    }
    .page {
      max-width: 720px;
      margin: 0 auto;
      padding: 1.5rem;
      color: #ede7f6;
      min-height: calc(100vh - 64px);
    }
    .hero {
      text-align: center;
      padding: 2rem 0;
    }
    .hero h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .play,
    .submit {
      width: 100%;
      max-width: 320px;
      margin-top: 1.5rem;
      padding: 0.85rem !important;
      font-size: 1.1rem !important;
      background: #7c4dff !important;
      color: #fff !important;
    }
    .phase {
      text-align: center;
    }
    .phase-label {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }
    .timer {
      font-size: 3rem;
      font-weight: 800;
      color: #b388ff;
      margin: 0.5rem 0 1rem;
      transition: color 0.2s;
    }
    .timer.urgent {
      color: #ff5252;
      animation: pulse 0.5s infinite alternate;
    }
    @keyframes pulse {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(1.08);
      }
    }
    .word-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .word-card {
      background: #4527a0;
      padding: 0.65rem 1rem;
      border-radius: 10px;
      font-size: 1.05rem;
      font-weight: 600;
      animation: popIn 0.35s ease backwards;
    }
    .word-card.show {
      animation: popIn 0.35s ease backwards;
    }
    @keyframes popIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .word-chip {
      background: #1a1035;
      border: 2px solid #5e35b1;
      color: #fff;
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .word-chip.selected {
      background: #7c4dff;
      border-color: #b388ff;
      transform: scale(1.05);
    }
    .word-chip:hover {
      border-color: #b388ff;
    }
    .picked {
      margin: 0 0 0.75rem;
      opacity: 0.8;
    }
    .result.pass h2 {
      color: #69f0ae;
    }
    .stats {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      margin: 1rem 0;
      font-weight: 600;
    }
    .missed,
    .false {
      font-size: 0.9rem;
      opacity: 0.85;
    }
    .false {
      color: #ffab91;
    }
    .error {
      color: #ffcdd2;
      text-align: center;
      margin-top: 1rem;
    }
    .stack-btn {
      color: #e1bee7 !important;
    }
    .stack-preview {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #2a2540;
    }
    .stack-label {
      font-size: 0.85rem;
      opacity: 0.7;
      margin: 0 0 0.75rem;
    }
    .stack-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }
    .stack-pill {
      border: 1px solid var(--c, #7c4dff);
      background: rgba(124, 77, 255, 0.12);
      color: #fff;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: transform 0.15s, background 0.15s;
    }
    .stack-pill:hover {
      transform: scale(1.05);
      background: rgba(124, 77, 255, 0.28);
    }
    .stack-pill.more {
      border-style: dashed;
      opacity: 0.9;
    }
  `,
})
export class MemoryPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(MemoryApiService);
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly categories = signal<WordCategory[]>([]);
  readonly categoriesLoading = signal(true);
  readonly selectedCategoryId = signal<string | null>(null);
  readonly categoryLabel = signal('');

  readonly showTechStack = signal(false);
  readonly previewTech = TECH_STACK_ITEMS.filter((t) =>
    ['angular', 'fastapi', 'sqlite', 'cursor', 'chatgpt', 'langchain', 'docker'].includes(t.id),
  );
  readonly techCount = TECH_STACK_ITEMS.length;

  readonly phase = signal<GamePhase>('idle');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sessionId = signal<string | null>(null);
  readonly level = signal(1);
  readonly totalScore = signal(0);

  readonly memorizeWords = signal<string[]>([]);
  readonly choices = signal<string[]>([]);
  readonly selected = signal<string[]>([]);
  readonly memorizeLeft = signal(0);
  readonly guessLeft = signal(0);
  readonly memorizeTotal = signal(5);
  readonly guessTotal = signal(18);
  readonly lastResult = signal<MemoryGuessResponse | null>(null);

  readonly memorizeProgress = () => {
    const t = this.memorizeTotal();
    return t ? ((t - this.memorizeLeft()) / t) * 100 : 0;
  };

  ngOnInit(): void {
    this.api.listCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.categoriesLoading.set(false);
        if (cats.length && !this.selectedCategoryId()) {
          this.selectedCategoryId.set(cats[0].id);
        }
      },
      error: () => {
        this.categoriesLoading.set(false);
        this.error.set('Could not load categories. Is the API running on port 8000?');
      },
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  selectCategory(id: string): void {
    if (this.phase() === 'idle') {
      this.selectedCategoryId.set(id);
      const cat = this.categories().find((c) => c.id === id);
      if (cat) this.categoryLabel.set(cat.label);
    }
  }

  startGame(): void {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) return;

    this.loading.set(true);
    this.error.set(null);
    this.api.start(categoryId).subscribe({
      next: (res) => {
        this.sessionId.set(res.session_id);
        this.level.set(res.level);
        this.totalScore.set(res.total_score);
        this.categoryLabel.set(res.category_label);
        this.loading.set(false);
        this.fetchRound();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not connect to server. Is the API running on port 8000?');
      },
    });
  }

  fetchRound(): void {
    const sid = this.sessionId();
    if (!sid) return;
    this.loading.set(true);
    this.api.startRound(sid).subscribe({
      next: (round) => {
        this.loading.set(false);
        this.applyRound(round);
        this.beginMemorizePhase(round);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to start round');
      },
    });
  }

  applyRound(round: MemoryRoundResponse): void {
    this.level.set(round.level);
    this.categoryLabel.set(round.category_label);
    this.memorizeWords.set(round.memorize_words);
    this.choices.set(round.choices);
    this.selected.set([]);
    this.memorizeTotal.set(round.memorize_seconds);
    this.guessTotal.set(round.guess_seconds);
  }

  beginMemorizePhase(round: MemoryRoundResponse): void {
    this.phase.set('memorize');
    this.memorizeLeft.set(round.memorize_seconds);
    this.clearTimer();
    this.timerId = setInterval(() => {
      const next = this.memorizeLeft() - 0.1;
      if (next <= 0) {
        this.memorizeLeft.set(0);
        this.clearTimer();
        this.beginGuessPhase();
      } else {
        this.memorizeLeft.set(Math.round(next * 10) / 10);
      }
    }, 100);
  }

  beginGuessPhase(): void {
    this.phase.set('guess');
    this.guessLeft.set(this.guessTotal());
    this.clearTimer();
    this.timerId = setInterval(() => {
      const next = this.guessLeft() - 0.1;
      if (next <= 0) {
        this.guessLeft.set(0);
        this.clearTimer();
        this.submitGuess();
      } else {
        this.guessLeft.set(Math.round(next * 10) / 10);
      }
    }, 100);
  }

  isSelected(word: string): boolean {
    return this.selected().includes(word);
  }

  toggleWord(word: string): void {
    const set = new Set(this.selected());
    if (set.has(word)) set.delete(word);
    else set.add(word);
    this.selected.set([...set]);
  }

  submitGuess(): void {
    if (this.phase() !== 'guess') return;
    this.clearTimer();
    const sid = this.sessionId();
    if (!sid) return;

    this.loading.set(true);
    const timeRemainingMs = Math.round(this.guessLeft() * 1000);
    this.api.submitGuess(sid, this.selected(), timeRemainingMs).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.totalScore.set(res.total_score);
        this.level.set(res.level);
        this.lastResult.set(res);
        this.phase.set('result');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not submit answer');
      },
    });
  }

  afterResult(r: MemoryGuessResponse): void {
    this.error.set(null);
    if (r.passed && r.next_round) {
      this.applyRound(r.next_round);
      this.beginMemorizePhase(r.next_round);
    } else {
      this.fetchRound();
    }
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
