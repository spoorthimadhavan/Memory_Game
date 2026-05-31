import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { errorInterceptor } from '../interceptors/error.interceptor';
import { MemoryApiService } from './memory-api.service';

/** Integration-style test: HTTP client + interceptor + memory API service */
describe('Memory HTTP integration', () => {
  let service: MemoryApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MemoryApiService,
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MemoryApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should run start → round → guess sequence', async () => {
    const startPromise = firstValueFrom(service.start('science'));
    const startReq = httpMock.expectOne((req) => req.url.includes('/memory/start'));
    startReq.flush({
      session_id: 'seq-1',
      level: 1,
      total_score: 0,
      category_id: 'science',
      category_label: 'Science',
      message: 'ready',
    });
    const session = await startPromise;

    const roundPromise = firstValueFrom(service.startRound(session.session_id));
    const roundReq = httpMock.expectOne((req) => req.url.includes('/round'));
    roundReq.flush({
      session_id: 'seq-1',
      level: 1,
      category_id: 'science',
      category_label: 'Science',
      level_config: { level: 1, word_count: 2, memorize_seconds: 10, choice_count: 4 },
      memorize_words: ['alpha', 'beta'],
      memorize_seconds: 10,
      guess_seconds: 18,
      pass_threshold: 0.55,
      choices: ['alpha', 'beta', 'gamma', 'delta'],
    });
    const round = await roundPromise;

    const guessPromise = firstValueFrom(
      service.submitGuess(session.session_id, round.memorize_words, 5000),
    );
    const guessReq = httpMock.expectOne((req) => req.url.includes('/guess'));
    guessReq.flush({
      session_id: 'seq-1',
      level: 2,
      correct_words: round.memorize_words,
      selected_words: round.memorize_words,
      hits: round.memorize_words,
      misses: [],
      false_picks: [],
      score_earned: 40,
      total_score: 40,
      accuracy: 1,
      passed: true,
      level_up: true,
      next_level: 2,
      message: 'cleared',
    });
    const guess = await guessPromise;

    expect(guess.passed).toBe(true);
    expect(guess.level).toBe(2);
  });
});
