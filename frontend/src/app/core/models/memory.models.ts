export interface WordCategory {
  id: string;
  label: string;
  word_count: number;
}

export interface LevelConfig {
  level: number;
  word_count: number;
  memorize_seconds: number;
  choice_count: number;
}

export interface MemoryStartResponse {
  session_id: string;
  level: number;
  total_score: number;
  category_id: string;
  category_label: string;
  message: string;
}

export interface MemoryRoundResponse {
  session_id: string;
  level: number;
  category_id: string;
  category_label: string;
  level_config: LevelConfig;
  memorize_words: string[];
  memorize_seconds: number;
  guess_seconds: number;
  pass_threshold: number;
  choices: string[];
}

export interface MemoryGuessResponse {
  session_id: string;
  level: number;
  correct_words: string[];
  selected_words: string[];
  hits: string[];
  misses: string[];
  false_picks: string[];
  score_earned: number;
  total_score: number;
  accuracy: number;
  passed: boolean;
  level_up: boolean;
  next_level: number;
  message: string;
  next_round?: MemoryRoundResponse | null;
}

export type GamePhase = 'idle' | 'memorize' | 'guess' | 'result';
