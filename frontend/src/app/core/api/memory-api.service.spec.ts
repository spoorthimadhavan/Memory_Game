import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MemoryApiService } from './memory-api.service';

describe('MemoryApiService', () => {
  let service: MemoryApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemoryApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MemoryApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list categories', () => {
    service.listCategories().subscribe((cats) => {
      expect(cats.length).toBe(2);
      expect(cats[0].id).toBe('food');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/memory/categories'));
    req.flush([
      { id: 'food', label: 'Food', word_count: 50 },
      { id: 'science', label: 'Science', word_count: 50 },
    ]);
  });

  it('should start a game session', () => {
    service.start('food').subscribe((res) => {
      expect(res.session_id).toBe('session-1');
      expect(res.level).toBe(1);
      expect(res.category_id).toBe('food');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/memory/start'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ player_name: 'Player', category_id: 'food' });
    req.flush({
      session_id: 'session-1',
      level: 1,
      total_score: 0,
      category_id: 'food',
      category_label: 'Food',
      message: 'go',
    });
  });

  it('should start a round', () => {
    service.startRound('session-1').subscribe((res) => {
      expect(res.memorize_words.length).toBe(2);
      expect(res.choices.length).toBe(4);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/memory/session-1/round'));
    req.flush({
      session_id: 'session-1',
      level: 1,
      category_id: 'food',
      category_label: 'Food',
      level_config: { level: 1, word_count: 2, memorize_seconds: 10, choice_count: 4 },
      memorize_words: ['a', 'b'],
      memorize_seconds: 10,
      guess_seconds: 18,
      pass_threshold: 0.55,
      choices: ['a', 'b', 'c', 'd'],
    });
  });

  it('should submit a guess', () => {
    service.submitGuess('session-1', ['a', 'b'], 3000).subscribe((res) => {
      expect(res.passed).toBe(true);
      expect(res.score_earned).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/memory/guess'));
    expect(req.request.body).toEqual({
      session_id: 'session-1',
      selected_words: ['a', 'b'],
      time_remaining_ms: 3000,
    });
    req.flush({
      session_id: 'session-1',
      level: 2,
      correct_words: ['a', 'b'],
      selected_words: ['a', 'b'],
      hits: ['a', 'b'],
      misses: [],
      false_picks: [],
      score_earned: 50,
      total_score: 50,
      accuracy: 1,
      passed: true,
      level_up: true,
      next_level: 2,
      message: 'ok',
    });
  });
});
