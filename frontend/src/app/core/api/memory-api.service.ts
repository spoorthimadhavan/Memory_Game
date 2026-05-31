import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  MemoryGuessResponse,
  MemoryRoundResponse,
  MemoryStartResponse,
  WordCategory,
} from '../models/memory.models';

@Injectable({ providedIn: 'root' })
export class MemoryApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  listCategories(): Observable<WordCategory[]> {
    return this.http.get<WordCategory[]>(`${this.base}/memory/categories`);
  }

  start(categoryId: string, playerName = 'Player'): Observable<MemoryStartResponse> {
    return this.http.post<MemoryStartResponse>(`${this.base}/memory/start`, {
      player_name: playerName,
      category_id: categoryId,
    });
  }

  startRound(sessionId: string): Observable<MemoryRoundResponse> {
    return this.http.post<MemoryRoundResponse>(`${this.base}/memory/${sessionId}/round`, {});
  }

  submitGuess(
    sessionId: string,
    selected: string[],
    timeRemainingMs: number,
  ): Observable<MemoryGuessResponse> {
    return this.http.post<MemoryGuessResponse>(`${this.base}/memory/guess`, {
      session_id: sessionId,
      selected_words: selected,
      time_remaining_ms: timeRemainingMs,
    });
  }
}
