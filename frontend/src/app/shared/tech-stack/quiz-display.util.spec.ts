import { prepareQuizQuestion } from './quiz-display.util';

describe('prepareQuizQuestion', () => {
  it('keeps the correct answer after shuffling', () => {
    const q = {
      question: 'Test?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 2,
      explanation: 'Because C.',
    };
    for (let i = 0; i < 20; i++) {
      const d = prepareQuizQuestion(q);
      expect(d.options[d.correctIndex]).toBe('C');
      expect(d.options.length).toBe(4);
    }
  });
});
