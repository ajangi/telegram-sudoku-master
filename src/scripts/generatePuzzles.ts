import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

function generateSudoku(difficulty: 'easy' | 'medium' | 'hard'): { board: number[][]; solution: number[][] } {
  // This is a simplified version. In a real implementation, you would want to use
  // a more sophisticated algorithm to generate valid Sudoku puzzles
  const solution = Array(9).fill(null).map(() => Array(9).fill(0));
  const board = Array(9).fill(null).map(() => Array(9).fill(0));

  // Fill the solution grid with a valid Sudoku solution
  // This is a placeholder - you should implement a proper Sudoku generation algorithm
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      solution[i][j] = ((i * 3 + Math.floor(i / 3) + j) % 9) + 1;
    }
  }

  // Create the puzzle by removing numbers based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 40,
    hard: 50,
  }[difficulty];

  for (let i = 0; i < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    board[row][col] = solution[row][col];
  }

  return { board, solution };
}

async function generateAndSavePuzzles() {
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  const puzzlesPerDifficulty = 10;

  for (const difficulty of difficulties) {
    for (let i = 0; i < puzzlesPerDifficulty; i++) {
      const { board, solution } = generateSudoku(difficulty);
      const puzzle = {
        id: uuidv4(),
        difficulty,
        board,
        solution,
      };

      try {
        await addDoc(collection(db, 'games'), puzzle);
        console.log(`Saved ${difficulty} puzzle ${i + 1}/${puzzlesPerDifficulty}`);
      } catch (error) {
        console.error(`Error saving ${difficulty} puzzle ${i + 1}:`, error);
      }
    }
  }
}

// Run the script
generateAndSavePuzzles().then(() => {
  console.log('Finished generating puzzles');
  process.exit(0);
}).catch((error) => {
  console.error('Error generating puzzles:', error);
  process.exit(1);
}); 