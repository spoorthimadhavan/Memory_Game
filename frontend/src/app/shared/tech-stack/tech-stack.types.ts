export type TechCategory = 'frontend' | 'backend' | 'data' | 'ai' | 'devops';

export interface TechQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: TechCategory;
  tagline: string;
  simpleExplanation: string;
  realWorldScenario: string;
  /** Why this technology is used in Memory Words. */
  usedIn: string;
  /** Command(s) to run or try this tech locally. */
  runLocally: string;
  color: string;
  quiz: TechQuizQuestion[];
}
