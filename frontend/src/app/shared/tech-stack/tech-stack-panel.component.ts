import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { TechQuizCardComponent } from './tech-quiz-card.component';
import { TECH_CATEGORIES, TECH_STACK_ITEMS } from './tech-stack.data';
import { TechCategory, TechStackItem } from './tech-stack.types';

type PanelView = 'list' | 'detail' | 'quiz';

@Component({
  selector: 'app-tech-stack-panel',
  standalone: true,
  imports: [MatButtonModule, TechQuizCardComponent],
  template: `
    <div class="backdrop" (click)="closed.emit()" role="presentation"></div>

    <aside class="panel" aria-label="Technology stack">
      <header class="panel-header">
        <div>
          <h2>Tech stack</h2>
          <p>Tap a technology — read how it works, then try the mini quiz</p>
        </div>
        <button mat-button type="button" class="close-btn" aria-label="Close" (click)="closed.emit()">
          ×
        </button>
      </header>

      @if (view() === 'quiz' && selectedItem(); as tech) {
        <app-tech-quiz-card [item]="tech" (back)="showDetail(tech)" />
      } @else if (view() === 'detail' && selectedItem(); as tech) {
        <div class="detail scroll">
          <button type="button" class="back" (click)="goList()">← All technologies</button>
          <span class="badge" [style.background]="tech.color + '33'">{{ categoryLabel(tech.category) }}</span>
          <h3>{{ tech.name }}</h3>
          <p class="tagline">{{ tech.tagline }}</p>

          <section class="block">
            <h4>What is it? (simple)</h4>
            <p [innerHTML]="formatBold(tech.simpleExplanation)"></p>
          </section>
          <section class="block real-world">
            <h4>Real-world scenario</h4>
            <p>{{ tech.realWorldScenario }}</p>
          </section>
          <section class="block">
            <h4>Why used in this project</h4>
            <p>{{ tech.usedIn }}</p>
          </section>
          <section class="block run-local">
            <h4>Run locally</h4>
            <p class="run-cmd">{{ tech.runLocally }}</p>
          </section>

          @if (tech.quiz.length) {
            <button mat-flat-button class="quiz-btn" (click)="startQuiz(tech)">
              Take mini quiz ({{ tech.quiz.length }} questions)
            </button>
          }
        </div>
      } @else {
        <div class="filters">
          @for (cat of categories; track cat.id) {
            <button
              type="button"
              class="filter-chip"
              [class.active]="activeCategory() === cat.id"
              (click)="activeCategory.set(cat.id)"
            >
              {{ cat.label }}
              <span class="count">{{ countFor(cat.id) }}</span>
            </button>
          }
        </div>

        <div class="flow">
          <span class="flow-node frontend">UI</span><span class="flow-arrow">→</span>
          <span class="flow-node backend">API</span><span class="flow-arrow">→</span>
          <span class="flow-node data">Data</span><span class="flow-arrow">+</span>
          <span class="flow-node ai">AI</span><span class="flow-arrow">+</span>
          <span class="flow-node devops">Ops</span>
        </div>

        <div class="grid scroll">
          @for (item of filteredItems(); track item.id) {
            <article
              class="tech-card"
              [style.--accent]="item.color"
              (click)="openDetail(item)"
              tabindex="0"
              (keydown.enter)="openDetail(item)"
            >
              <div class="card-top">
                <span class="badge">{{ categoryLabel(item.category) }}</span>
                <span class="dot" [style.background]="item.color"></span>
              </div>
              <h3>{{ item.name }}</h3>
              <p class="card-desc">{{ item.tagline }}</p>
              <p class="tap-hint">Tap to learn + quiz →</p>
            </article>
          }
        </div>
      }

      <footer class="panel-foot">Made by Spoorthi Satish Madhavan</footer>
    </aside>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: 1000;
    }
    .panel {
      position: fixed;
      top: 0;
      right: 0;
      width: min(520px, 100vw);
      height: 100vh;
      background: #12101f;
      color: #ece8ff;
      z-index: 1001;
      display: flex;
      flex-direction: column;
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.45);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.25rem 1rem 0.5rem 1.25rem;
      border-bottom: 1px solid #2a2540;
      flex-shrink: 0;
    }
    .panel-header h2 {
      margin: 0;
      font-size: 1.35rem;
    }
    .panel-header p {
      margin: 0.25rem 0 0;
      font-size: 0.85rem;
      opacity: 0.75;
      max-width: 320px;
    }
    .close-btn {
      min-width: 2.5rem;
      font-size: 1.5rem;
      color: #fff !important;
    }
    .scroll {
      flex: 1;
      overflow-y: auto;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding: 0.75rem 1.25rem;
      flex-shrink: 0;
    }
    .filter-chip {
      border: 1px solid #3d3560;
      background: #1a1630;
      color: #c5bde8;
      border-radius: 999px;
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .filter-chip.active {
      background: #7c4dff;
      border-color: #b388ff;
      color: #fff;
    }
    .count {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 999px;
      padding: 0 0.35rem;
      margin-left: 0.25rem;
      font-size: 0.7rem;
    }
    .flow {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      padding: 0 1.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .flow-node {
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
    }
    .flow-node.frontend {
      background: #311b92;
    }
    .flow-node.backend {
      background: #004d40;
    }
    .flow-node.data {
      background: #33691e;
    }
    .flow-node.ai {
      background: #4a148c;
    }
    .flow-node.devops {
      background: #0d47a1;
    }
    .flow-arrow {
      opacity: 0.5;
    }
    .grid {
      padding: 0 1.25rem 1rem;
      display: grid;
      gap: 0.65rem;
    }
    .tech-card {
      background: #1a1630;
      border: 1px solid #2f2850;
      border-left: 4px solid var(--accent, #7c4dff);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      cursor: pointer;
      text-align: left;
    }
    .tech-card:hover {
      box-shadow: 0 6px 20px rgba(124, 77, 255, 0.2);
    }
    .tech-card h3 {
      margin: 0.35rem 0 0;
      font-size: 1.05rem;
    }
    .card-desc {
      margin: 0.25rem 0 0;
      font-size: 0.88rem;
      opacity: 0.85;
    }
    .tap-hint {
      margin: 0.5rem 0 0;
      font-size: 0.75rem;
      color: #b388ff;
    }
    .detail {
      padding: 0 1.25rem 1.25rem;
    }
    .back {
      background: none;
      border: none;
      color: #b388ff;
      cursor: pointer;
      padding: 0;
      margin-bottom: 0.75rem;
    }
    .detail h3 {
      margin: 0.5rem 0 0.25rem;
      font-size: 1.35rem;
    }
    .tagline {
      opacity: 0.85;
      margin: 0 0 1rem;
    }
    .block {
      margin-bottom: 1rem;
      padding: 0.85rem;
      background: #1a1630;
      border-radius: 10px;
      border: 1px solid #2f2850;
    }
    .block h4 {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #b388ff;
    }
    .block p {
      margin: 0;
      line-height: 1.5;
      font-size: 0.92rem;
    }
    .real-world {
      border-left: 3px solid #64b5f6;
    }
    .run-local {
      border-left: 3px solid #81c784;
    }
    .run-cmd {
      font-family: ui-monospace, monospace;
      font-size: 0.82rem;
      line-height: 1.5;
      color: #e8f5e9;
      word-break: break-word;
    }
    .quiz-btn {
      width: 100%;
      margin-top: 0.5rem;
      background: #7c4dff !important;
    }
    .panel-foot {
      flex-shrink: 0;
      text-align: center;
      padding: 0.75rem;
      font-size: 0.8rem;
      opacity: 0.75;
      border-top: 1px solid #2a2540;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      font-size: 0.65rem;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: #2a2540;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
  `,
})
export class TechStackPanelComponent {
  readonly closed = output<void>();

  readonly categories = TECH_CATEGORIES;
  readonly activeCategory = signal<TechCategory | 'all'>('all');
  readonly view = signal<PanelView>('list');
  readonly selectedItem = signal<TechStackItem | null>(null);

  readonly filteredItems = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return TECH_STACK_ITEMS;
    return TECH_STACK_ITEMS.filter((i) => i.category === cat);
  });

  countFor(id: TechCategory | 'all'): number {
    if (id === 'all') return TECH_STACK_ITEMS.length;
    return TECH_STACK_ITEMS.filter((i) => i.category === id).length;
  }

  categoryLabel(cat: TechCategory): string {
    return TECH_CATEGORIES.find((c) => c.id === cat)?.label ?? cat;
  }

  formatBold(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  openDetail(item: TechStackItem): void {
    this.selectedItem.set(item);
    this.view.set('detail');
  }

  showDetail(item: TechStackItem): void {
    this.selectedItem.set(item);
    this.view.set('detail');
  }

  goList(): void {
    this.view.set('list');
    this.selectedItem.set(null);
  }

  startQuiz(item: TechStackItem): void {
    this.selectedItem.set(item);
    this.view.set('quiz');
  }
}
