import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { MemoryApiService } from '../../core/api/memory-api.service';
import { MemoryRoundResponse } from '../../core/models/memory.models';
import { MemoryPageComponent } from './memory-page.component';

const mockRound: MemoryRoundResponse = {
  session_id: 's1',
  level: 1,
  category_id: 'food',
  category_label: 'Food',
  level_config: { level: 1, word_count: 2, memorize_seconds: 0.2, choice_count: 4 },
  memorize_words: ['apple', 'river'],
  memorize_seconds: 0.2,
  guess_seconds: 5,
  pass_threshold: 0.55,
  choices: ['apple', 'river', 'cloud', 'stone'],
};

describe('MemoryPageComponent', () => {
  let fixture: ComponentFixture<MemoryPageComponent>;
  let component: MemoryPageComponent;
  let api: {
    listCategories: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    startRound: ReturnType<typeof vi.fn>;
    submitGuess: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    api = {
      listCategories: vi.fn().mockReturnValue(
        of([
          { id: 'food', label: 'Food', word_count: 50 },
          { id: 'science', label: 'Science', word_count: 50 },
        ]),
      ),
      start: vi.fn().mockReturnValue(
        of({
          session_id: 's1',
          level: 1,
          total_score: 0,
          category_id: 'food',
          category_label: 'Food',
          message: 'ready',
        }),
      ),
      startRound: vi.fn().mockReturnValue(of(mockRound)),
      submitGuess: vi.fn().mockReturnValue(
      of({
        session_id: 's1',
        level: 2,
        correct_words: ['apple', 'river'],
        selected_words: ['apple', 'river'],
        hits: ['apple', 'river'],
        misses: [],
        false_picks: [],
        score_earned: 80,
        total_score: 80,
        accuracy: 1,
        passed: true,
        level_up: true,
        next_level: 2,
        message: 'Great!',
        next_round: { ...mockRound, level: 2 },
      }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [MemoryPageComponent],
      providers: [
        { provide: MemoryApiService, useValue: api },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and show idle hero', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Remember');
    expect(el.textContent).toContain('Choose a category');
    expect(component.phase()).toBe('idle');
    expect(component.categories().length).toBe(2);
  });

  it('should open tech stack panel', () => {
    component.showTechStack.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-tech-stack-panel')).toBeTruthy();
  });

  it('should start game and enter memorize phase', () => {
    component.selectCategory('food');
    component.startGame();
    fixture.detectChanges();
    expect(api.start).toHaveBeenCalledWith('food');
    expect(api.startRound).toHaveBeenCalledWith('s1');
    expect(component.phase()).toBe('memorize');
    expect(component.memorizeWords()).toEqual(['apple', 'river']);
  });

  it('should transition to guess phase after memorize timer', () => {
    vi.useFakeTimers();
    component.selectCategory('food');
    component.startGame();
    fixture.detectChanges();
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
    expect(component.phase()).toBe('guess');
    expect(component.choices().length).toBe(4);
    vi.useRealTimers();
  });

  it('should toggle word selection', () => {
    component.choices.set(['apple', 'river']);
    component.toggleWord('apple');
    expect(component.isSelected('apple')).toBe(true);
    component.toggleWord('apple');
    expect(component.isSelected('apple')).toBe(false);
  });

  it('should submit guess and show result', () => {
    vi.useFakeTimers();
    component.selectCategory('food');
    component.startGame();
    fixture.detectChanges();
    vi.advanceTimersByTime(500);
    component.selected.set(['apple', 'river']);
    component.submitGuess();
    fixture.detectChanges();
    expect(api.submitGuess).toHaveBeenCalled();
    expect(component.phase()).toBe('result');
    expect(component.lastResult()?.passed).toBe(true);
    vi.useRealTimers();
  });

  it('should show error when start fails', () => {
    api.start.mockReturnValue(throwError(() => new Error('network')));
    component.selectCategory('food');
    component.startGame();
    fixture.detectChanges();
    expect(component.error()).toContain('Could not connect');
  });
});
