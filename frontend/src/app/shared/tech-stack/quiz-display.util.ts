import { TechQuizQuestion } from './tech-stack.types';

export interface DisplayQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Shuffle options so the correct answer is not always first; keeps indices in sync. */
export function prepareQuizQuestion(q: TechQuizQuestion): DisplayQuizQuestion {
  const tagged = q.options.map((text, originalIndex) => ({ text, originalIndex }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  const correctIndex = tagged.findIndex((t) => t.originalIndex === q.correctIndex);
  return {
    question: q.question,
    options: tagged.map((t) => t.text),
    correctIndex,
    explanation: q.explanation,
  };
}
