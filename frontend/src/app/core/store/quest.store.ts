import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';

import { QuestApiService } from '../api/quest-api.service';
import { AnswerResponse, QuestState, Question, Topic } from '../models/quest.models';

interface QuestStoreState {
  sessionId: string | null;
  quest: QuestState | null;
  topics: Topic[];
  customTopic: string;
  lastFeedback: string | null;
  lastXpGain: number;
  levelUpMessage: string | null;
  weakWarning: string | null;
  loading: boolean;
  error: string | null;
  started: boolean;
}

const initialState: QuestStoreState = {
  sessionId: null,
  quest: null,
  topics: [],
  customTopic: '',
  lastFeedback: null,
  lastXpGain: 0,
  levelUpMessage: null,
  weakWarning: null,
  loading: false,
  error: null,
  started: false,
};

export const QuestStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    currentQuestion: () => store.quest()?.current_question ?? null,
    xpProgress: () => {
      const q = store.quest();
      if (!q) return 0;
      const need = q.level * 40;
      return need ? Math.min(100, Math.round((q.xp / need) * 100)) : 0;
    },
  })),
  withMethods((store, api = inject(QuestApiService)) => {
    const applyQuest = (quest: QuestState) => {
      patchState(store, { sessionId: quest.session_id, quest });
    };

    const applyAnswer = (res: AnswerResponse) => {
      const quest = store.quest();
      if (!quest) return;
      patchState(store, {
        quest: {
          ...quest,
          level: res.new_level,
          xp: res.xp,
          streak: res.streak,
          current_question: res.next_question,
        },
        lastFeedback: res.explanation.narrative,
        lastXpGain: res.score.final_score,
        levelUpMessage: res.level_up ? `Level ${res.new_level} unlocked!` : null,
        weakWarning: res.weak_topic_warning ?? null,
      });
    };

    return {
      setError(error: string | null): void {
        patchState(store, { error });
      },
      setCustomTopic(topic: string): void {
        patchState(store, { customTopic: topic });
      },
      backToTopicPicker(): void {
        patchState(store, {
          ...initialState,
          topics: store.topics(),
        });
      },
      loadTopics: rxMethod<void>(
        pipe(
          switchMap(() =>
            api.listTopics().pipe(
              tap((topics) => patchState(store, { topics })),
              catchError(() => EMPTY),
            ),
          ),
        ),
      ),
      startQuest: rxMethod<{ topic: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null, levelUpMessage: null })),
          switchMap(({ topic }) =>
            api.startQuest(topic).pipe(
              tap((res) => {
                applyQuest(res.quest_state);
                patchState(store, {
                  lastFeedback: res.message,
                  started: true,
                  loading: false,
                  lastXpGain: 0,
                  weakWarning: null,
                });
              }),
              catchError(() => {
                patchState(store, { loading: false });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
      submitAnswer: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null, weakWarning: null })),
          switchMap((answerText) => {
            const sessionId = store.sessionId();
            const question = store.currentQuestion();
            if (!sessionId || !question) {
              patchState(store, { loading: false, error: 'Start a quest first' });
              return EMPTY;
            }
            return api.submitAnswer(sessionId, question.id, answerText).pipe(
              tap((res) => {
                applyAnswer(res);
                patchState(store, { loading: false });
              }),
              catchError(() => {
                patchState(store, { loading: false });
                return EMPTY;
              }),
            );
          }),
        ),
      ),
    };
  }),
);
