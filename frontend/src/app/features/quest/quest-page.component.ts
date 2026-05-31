import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { QuestStore } from '../../core/store/quest.store';

@Component({
  selector: 'app-quest-page',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  template: `
    <mat-toolbar class="toolbar">
      <span>AI Knowledge Quest</span>
    </mat-toolbar>

    <main class="page">
      @if (!store.started()) {
        <section class="intro">
          <h1>Learn any topic through AI missions</h1>
          <p>Pick a topic, answer the question in your own words, get feedback, and level up.</p>

          <div class="topics">
            @for (t of store.topics(); track t.id) {
              <button
                mat-stroked-button
                class="topic-btn"
                [disabled]="store.loading()"
                (click)="store.startQuest({ topic: t.label })"
              >
                {{ t.label }}
              </button>
            }
          </div>

          <mat-form-field appearance="outline" class="custom-topic">
            <mat-label>Or type your own topic</mat-label>
            <input
              matInput
              [ngModel]="store.customTopic()"
              (ngModelChange)="store.setCustomTopic($event)"
              placeholder="e.g. Kubernetes, System Design"
            />
          </mat-form-field>
          <button
            mat-flat-button
            color="primary"
            class="start-custom"
            [disabled]="!store.customTopic().trim() || store.loading()"
            (click)="store.startQuest({ topic: store.customTopic().trim() })"
          >
            Start custom topic
          </button>
        </section>
      } @else {
        @if (store.quest(); as q) {
          <div class="progress">
            <span>Level {{ q.level }}</span>
            <span>XP {{ q.xp }} / {{ q.level * 40 }}</span>
            <span>Streak {{ q.streak }}</span>
          </div>
          <mat-progress-bar mode="determinate" [value]="store.xpProgress()" />

          @if (store.levelUpMessage(); as lvl) {
            <p class="level-up">{{ lvl }}</p>
          }

          <mat-card class="mission">
            <p class="eyebrow">{{ q.topic }} · {{ q.current_question.mission_title }}</p>
            <h2>{{ q.current_question.text }}</h2>
            @if (q.current_question.hint) {
              <p class="hint">Hint: {{ q.current_question.hint }}</p>
            }
          </mat-card>

          <div class="answer-box">
            <label for="answer">Your answer</label>
            <textarea
              id="answer"
              rows="4"
              [(ngModel)]="answerText"
              placeholder="Write 2–4 sentences in your own words..."
              [disabled]="store.loading()"
            ></textarea>
            <button
              mat-flat-button
              color="primary"
              [disabled]="answerText.trim().length < 2 || store.loading()"
              (click)="submit()"
            >
              Submit answer
            </button>
          </div>

          @if (store.lastXpGain()) {
            <p class="xp">+{{ store.lastXpGain() }} XP</p>
          }

          @if (store.weakWarning()) {
            <p class="warn">{{ store.weakWarning() }}</p>
          }

          @if (store.lastFeedback(); as fb) {
            <mat-card class="feedback">
              <h3>Tutor feedback</h3>
              <p>{{ fb }}</p>
            </mat-card>
          }

          <button mat-button class="back" (click)="backToTopics()">Choose another topic</button>
        }
      }

      @if (store.error(); as err) {
        <p class="error">{{ err }}</p>
      }
    </main>
  `,
  styles: `
    .toolbar {
      background: #1a237e;
      color: #fff;
    }
    .page {
      max-width: 640px;
      margin: 0 auto;
      padding: 1.5rem;
      color: #e8eaf6;
    }
    .intro {
      text-align: center;
    }
    .intro h1 {
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
    }
    .topics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin: 1.5rem 0;
    }
    .topic-btn {
      border-color: #5c6bc0 !important;
      color: #c5cae9 !important;
    }
    .custom-topic {
      width: 100%;
    }
    .start-custom {
      width: 100%;
      margin-bottom: 1rem;
    }
    .progress {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .level-up {
      color: #a5d6a7;
      text-align: center;
      font-weight: 600;
    }
    .mission {
      background: #1e2a4a;
      color: #fff;
      margin: 1rem 0;
      padding: 1rem;
    }
    .eyebrow {
      opacity: 0.75;
      margin: 0;
      font-size: 0.85rem;
    }
    .mission h2 {
      font-size: 1.15rem;
      line-height: 1.45;
      margin: 0.5rem 0 0;
    }
    .hint {
      margin: 0.75rem 0 0;
      font-size: 0.9rem;
      color: #90caf9;
    }
    .answer-box label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #3d4f7a;
      background: #0f1528;
      color: #fff;
      font-family: inherit;
      font-size: 1rem;
    }
    .answer-box button {
      width: 100%;
      margin-top: 0.75rem;
    }
    .xp {
      text-align: center;
      color: #81c784;
      font-weight: 700;
    }
    .warn {
      color: #ffcc80;
      text-align: center;
      font-size: 0.9rem;
    }
    .feedback {
      background: #162447;
      color: #eef3ff;
      margin-top: 1rem;
    }
    .feedback h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    .back {
      margin-top: 1rem;
      color: #90caf9;
    }
    .error {
      color: #ffcdd2;
      text-align: center;
      margin-top: 1rem;
    }
  `,
})
export class QuestPageComponent implements OnInit {
  readonly store = inject(QuestStore);
  answerText = '';

  ngOnInit(): void {
    this.store.loadTopics();
  }

  submit(): void {
    const text = this.answerText.trim();
    if (text.length < 2) return;
    this.store.submitAnswer(text);
    this.answerText = '';
  }

  backToTopics(): void {
    this.store.backToTopicPicker();
    this.store.loadTopics();
    this.answerText = '';
  }
}
