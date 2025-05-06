import type { User, GameState, SudokuGame } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createUser = async (user: Omit<User, 'score'>): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};

export const getUser = async (telegramId: string): Promise<User | null> => {
  const response = await fetch(`${API_URL}/users/${telegramId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  return response.json();
};

export const updateUserScore = async (telegramId: string, score: number): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${telegramId}/score`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    throw new Error('Failed to update score');
  }
};

export const updateUserGame = async (telegramId: string, gameState: GameState): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${telegramId}/game`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameState }),
  });

  if (!response.ok) {
    throw new Error('Failed to update game state');
  }
};

export const getRandomGame = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<SudokuGame> => {
  const response = await fetch(`${API_URL}/games/random?difficulty=${difficulty}`);

  if (!response.ok) {
    throw new Error('Failed to get random game');
  }

  return response.json();
}; 