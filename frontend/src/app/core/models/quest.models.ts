export interface Topic {
  id: string;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  topic: string;
  level: number;
  difficulty: number;
  expected_concepts: string[];
  hint?: string | null;
  mission_title: string;
}

export interface QuestState {
  session_id: string;
  topic: string;
  player_name: string;
  level: number;
  xp: number;
  difficulty: number;
  streak: number;
  missions_completed: number;
  current_question: Question;
  weak_concepts: string[];
}

export interface ScoreBreakdown {
  base: number;
  creativity_bonus: number;
  risk_bonus: number;
  repetition_penalty: number;
  difficulty_multiplier: number;
  final_score: number;
}

export interface EvaluationResult {
  concept_similarity: number;
  quality: string;
  matched_concepts: string[];
  repeated_mistake: boolean;
}

export interface AIFeedback {
  narrative: string;
  tone: string;
  highlights: string[];
}

export interface QuestStartResponse {
  session_id: string;
  quest_state: QuestState;
  message: string;
}

export interface AnswerResponse {
  session_id: string;
  evaluation: EvaluationResult;
  score: ScoreBreakdown;
  explanation: AIFeedback;
  level_up: boolean;
  new_level: number;
  xp: number;
  streak: number;
  next_question: Question;
  weak_topic_warning?: string | null;
}
