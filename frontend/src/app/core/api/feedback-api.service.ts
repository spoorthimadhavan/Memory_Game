import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface FeedbackResponse {
  ok: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  contact(name: string, email: string, message: string): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.base}/feedback/contact`, { name, email, message });
  }

  suggestion(name: string, email: string | null, suggestion: string): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.base}/feedback/suggestion`, {
      name,
      email: email || undefined,
      suggestion,
    });
  }
}
