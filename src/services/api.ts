import type { User, GameState, SudokuGame } from '../types';

// This should be updated to point to your backend API when it's ready
// For development, you can use a mock API or update this to your backend URL
//const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-api.com/api';

// TODO: Replace these mock implementations with actual API calls when your backend is ready

export const createUser = async (user: Omit<User, 'score'>): Promise<User> => {
  console.log('Creating user (mock):', user);

  // This is a mock implementation for development
  // Replace with actual API call when backend is ready
  return {
    ...user,
    score: 0
  };
};

export const getUser = async (telegramId: string): Promise<User | null> => {
  console.log('Getting user (mock):', telegramId);

  // This is a mock implementation for development
  // Replace with actual API call when backend is ready
  return null;
};

export const updateUserScore = async (telegramId: string, score: number): Promise<void> => {
  console.log('Updating user score (mock):', { telegramId, score });

  // This is a mock implementation for development
  // Replace with actual API call when backend is ready
};

export const updateUserGame = async (telegramId: string, gameState: GameState): Promise<void> => {
  console.log('Updating user game (mock):', { telegramId, gameState });

  // This is a mock implementation for development
  // Replace with actual API call when backend is ready
};

export const getRandomGame = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<SudokuGame> => {
  console.log('Getting random game (mock):', difficulty);

  // Generate a valid Sudoku solution
  const solution = generateSudokuSolution();

  // Create a puzzle by removing numbers from the solution
  // The number of cells to remove depends on the difficulty
  const cellsToRemove = {
    'easy': 30,
    'medium': 45,
    'hard': 55
  }[difficulty];

  // Start with a copy of the solution
  const board = solution.map(row => [...row]);

  // Remove cells to create the puzzle
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }

  return {
    id: `mock-${difficulty}-${Date.now()}`,
    difficulty,
    board,
    solution
  };
};

// Helper function to generate a valid Sudoku solution
function generateSudokuSolution(): number[][] {
  // Start with an empty grid
  const grid = Array(9).fill(0).map(() => Array(9).fill(0));

  // Try to solve it
  if (solveSudoku(grid)) {
    return grid;
  }

  // If solving fails (should be extremely rare), return a pre-made valid solution
  return [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];
}

// Solver using backtracking algorithm
function solveSudoku(grid: number[][]): boolean {
  const emptyCell = findEmptyCell(grid);

  // If no empty cell is found, the puzzle is solved
  if (!emptyCell) return true;

  const [row, col] = emptyCell;

  // Try digits 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;

      if (solveSudoku(grid)) {
        return true;
      }

      // If placing num doesn't lead to a solution, backtrack
      grid[row][col] = 0;
    }
  }

  return false;
}

// Find an empty cell in the grid
function findEmptyCell(grid: number[][]): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

// Check if placing a number at the specified position is valid
function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}
