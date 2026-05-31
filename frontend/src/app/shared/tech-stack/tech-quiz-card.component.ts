import { Component, afterNextRender, input, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DisplayQuizQuestion, prepareQuizQuestion } from './quiz-display.util';
import { TechStackItem } from './tech-stack.types';

@Component({
  selector: 'app-tech-quiz-card',
  standalone: true,
  imports: [MatButtonModule, MatProgressBarModule],
  template: `
    @if (item(); as tech) {
      <div class="quiz-card">
        <header>
          <button type="button" class="back" (click)="back.emit()">← Back</button>
          <h3>{{ tech.name }} mini quiz</h3>
          <p>{{ answeredCount() }} / {{ quizLength() }} answered</p>
          <mat-progress-bar mode="determinate" [value]="progressPercent()" />
        </header>

        @if (finished()) {
          <div class="result">
            <h4>Quiz complete!</h4>
            <p>You got <strong>{{ score() }}</strong> out of <strong>{{ quizLength() }}</strong> correct.</p>
            <p class="encourage">{{ encourageText() }}</p>
            <button mat-flat-button color="primary" (click)="restart()">Try again</button>
            <button mat-button class="text-btn" (click)="back.emit()">Back to list</button>
          </div>
        } @else if (current(); as q) {
          <p class="q-label">Question {{ index() + 1 }}</p>
          <p class="question">{{ q.question }}</p>
          <div class="options">
            @for (opt of q.options; track $index) {
              <button
                type="button"
                class="opt"
                [class.selected]="picked() === $index"
                [class.correct]="revealed() && $index === q.correctIndex"
                [class.wrong]="revealed() && picked() === $index && $index !== q.correctIndex"
                [disabled]="revealed()"
                (click)="pick($index)"
              >
                {{ opt }}
              </button>
            }
          </div>
          @if (revealed()) {
            <p class="explain">{{ q.explanation }}</p>
            <button mat-flat-button color="primary" (click)="next()">
              {{ index() + 1 >= quizLength() ? 'See results' : 'Next question' }}
            </button>
          } @else {
            <button mat-flat-button color="primary" [disabled]="picked() === null" (click)="reveal()">
              Check answer
            </button>
          }
        }
      </div>
    }
  `,
  styles: `
    .quiz-card {
      padding: 0 1.25rem 1.25rem;
      color: #f2f5ff;
    }
    header {
      margin-bottom: 1rem;
    }
    header h3 {
      margin: 0.5rem 0 0.25rem;
      color: #fff;
    }
    header p {
      margin: 0 0 0.5rem;
      font-size: 0.85rem;
      color: #d1c4e9;
    }
    .back,
    .text-btn {
      background: none;
      border: none;
      color: #b388ff;
      cursor: pointer;
      padding: 0;
      font-size: 0.9rem;
    }
    .q-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #b39ddb;
      margin: 0;
    }
    .question {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.45;
      margin: 0.5rem 0 1rem;
      color: #ffffff;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .opt {
      text-align: left;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 2px solid #5c6bc0;
      background: #1e2640;
      color: #ffffff;
      cursor: pointer;
      font-size: 0.92rem;
      line-height: 1.4;
    }
    .opt:hover:not(:disabled) {
      border-color: #9fa8da;
      background: #283352;
    }
    .opt.selected {
      border-color: #b388ff;
      background: #352a5c;
    }
    .opt.correct {
      border-color: #69f0ae;
      background: #1b3d2a;
      color: #e8f5e9;
    }
    .opt.wrong {
      border-color: #ff8a80;
      background: #4a2020;
      color: #ffebee;
    }
    .opt:disabled {
      cursor: default;
    }
    .explain {
      margin: 1rem 0;
      padding: 0.85rem;
      background: #1e2640;
      border-radius: 8px;
      font-size: 0.92rem;
      line-height: 1.5;
      color: #e8eaf6;
      border-left: 3px solid #b388ff;
    }
    .result {
      text-align: center;
      padding: 1rem 0;
      color: #fff;
    }
    .result h4 {
      margin: 0 0 0.5rem;
      color: #b388ff;
    }
    .encourage {
      color: #d1c4e9;
      margin-bottom: 1rem;
    }
    button[mat-flat-button] {
      width: 100%;
      margin-top: 0.5rem;
    }
  `,
})
export class TechQuizCardComponent {
  readonly item = input<TechStackItem | undefined>();
  readonly back = output<void>();

  readonly index = signal(0);
  readonly picked = signal<number | null>(null);
  readonly revealed = signal(false);
  readonly score = signal(0);
  readonly finished = signal(false);
  readonly displayQuestions = signal<DisplayQuizQuestion[]>([]);

  readonly quizLength = computed(() => this.displayQuestions().length);
  readonly current = computed(() => this.displayQuestions()[this.index()] ?? null);
  readonly answeredCount = computed(() => (this.finished() ? this.quizLength() : this.index()));
  readonly progressPercent = computed(() => {
    const total = this.quizLength() || 1;
    const done = this.finished() ? total : this.index();
    return (done / total) * 100;
  });

  constructor() {
    afterNextRender(() => this.restart());
  }

  pick(i: number): void {
    if (!this.revealed()) this.picked.set(i);
  }

  reveal(): void {
    const q = this.current();
    if (q && this.picked() === q.correctIndex) {
      this.score.update((s) => s + 1);
    }
    this.revealed.set(true);
  }

  next(): void {
    if (this.index() + 1 >= this.quizLength()) {
      this.finished.set(true);
      return;
    }
    this.index.update((i) => i + 1);
    this.picked.set(null);
    this.revealed.set(false);
  }

  restart(): void {
    const tech = this.item();
    if (!tech?.quiz.length) return;
    this.displayQuestions.set(tech.quiz.map(prepareQuizQuestion));
    this.index.set(0);
    this.picked.set(null);
    this.revealed.set(false);
    this.score.set(0);
    this.finished.set(false);
  }

  encourageText(): string {
    const ratio = this.score() / (this.quizLength() || 1);
    if (ratio >= 0.8) return 'Awesome — you really understand this tech!';
    if (ratio >= 0.5) return 'Good job — review the explanations and try once more.';
    return 'Keep learning — tap Back and read the story again.';
  }
}
