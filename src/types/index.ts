export interface User {
  telegramId: string;
  name: string;
  avatar: string;
  score: number;
  currentGame?: GameState;
}

export interface GameState {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  board: number[][];
  solution: number[][];
  userInput: number[][];
  startTime: number;
  isCompleted: boolean;
}

export interface SudokuGame {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  board: number[][];
  solution: number[][];
} 