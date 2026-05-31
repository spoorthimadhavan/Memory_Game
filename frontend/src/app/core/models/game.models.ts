export interface Enemy {
  id: string;
  name: string;
  max_health: number;
  difficulty: number;
  description: string;
  weaknesses: string[];
  current_health?: number;
}

export interface ScoreBreakdown {
  base: number;
  creativity_bonus: number;
  risk_bonus: number;
  repetition_penalty: number;
  difficulty_multiplier: number;
  final_score: number;
}

export interface SimilarityResult {
  is_repeated: boolean;
  max_similarity: number;
  most_similar_action?: string | null;
  threshold: number;
}

export interface AIFeedback {
  narrative: string;
  tone: 'positive' | 'neutral' | 'warning';
  highlights: string[];
}

export interface ActionHistoryItem {
  id: string;
  action_text: string;
  category?: string | null;
  score: number;
  enemy_health_after: number;
  is_repeated: boolean;
  timestamp: string;
}

export interface GameState {
  session_id: string;
  enemy: Enemy;
  player_score: number;
  turn_count: number;
  game_over: boolean;
  victory: boolean;
}

export interface GameStartResponse {
  session_id: string;
  game_state: GameState;
  message: string;
}

export interface PlayerActionResponse {
  session_id: string;
  feedback: AIFeedback;
  score: ScoreBreakdown;
  similarity: SimilarityResult;
  enemy_health: number;
  player_score: number;
  strategy_warning?: string | null;
  history_item: ActionHistoryItem;
  game_over: boolean;
  victory: boolean;
}

export type ActionCategory = 'Attack' | 'Defend' | 'Trick' | 'Magic';
