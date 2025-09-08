export interface Word {
  id: number;
  headword: string;
  meaning: string;
  example?: string;
  audioKey?: string;
}

export interface Progress {
  wordId: number;
  correct: number;
  wrong: number;
}

export interface Meta {
  highScore: number;
}

export interface GameState {
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  hints: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
  questions: Question[];
  answers: string[];
}

export interface Question {
  id: number;
  type: 'choice' | 'spelling' | 'audio';
  word: Word;
  options: string[];
  correctAnswer: string;
}

export type QuestionType = 'choice' | 'spelling' | 'audio';