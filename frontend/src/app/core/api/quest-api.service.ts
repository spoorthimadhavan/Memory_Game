import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AnswerResponse, QuestStartResponse, Topic } from '../models/quest.models';

@Injectable({ providedIn: 'root' })
export class QuestApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  listTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.baseUrl}/topics`);
  }

  startQuest(topic: string, playerName = 'Learner'): Observable<QuestStartResponse> {
    return this.http.post<QuestStartResponse>(`${this.baseUrl}/quest/start`, {
      topic,
      player_name: playerName,
    });
  }

  submitAnswer(sessionId: string, questionId: string, answerText: string): Observable<AnswerResponse> {
    return this.http.post<AnswerResponse>(`${this.baseUrl}/quest/answer`, {
      session_id: sessionId,
      question_id: questionId,
      answer_text: answerText,
    });
  }
}
