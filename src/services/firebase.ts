import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import type { User, GameState, SudokuGame } from '../types';

const usersCollection = 'users';
const gamesCollection = 'games';

export const createUser = async (user: User) => {
  await setDoc(doc(db, usersCollection, user.telegramId), user);
};

export const getUser = async (telegramId: string) => {
  const userDoc = await getDoc(doc(db, usersCollection, telegramId));
  return userDoc.exists() ? (userDoc.data() as User) : null;
};

export const updateUserScore = async (telegramId: string, score: number) => {
  const userRef = doc(db, usersCollection, telegramId);
  await updateDoc(userRef, { score });
};

export const updateUserGame = async (telegramId: string, gameState: GameState) => {
  const userRef = doc(db, usersCollection, telegramId);
  await updateDoc(userRef, { currentGame: gameState });
};

export const getRandomGame = async (difficulty: 'easy' | 'medium' | 'hard') => {
  const gamesQuery = query(
    collection(db, gamesCollection),
    where('difficulty', '==', difficulty)
  );
  const gamesSnapshot = await getDocs(gamesQuery);
  const games = gamesSnapshot.docs.map(doc => doc.data() as SudokuGame);
  return games[Math.floor(Math.random() * games.length)];
};

export const saveGame = async (game: SudokuGame) => {
  await setDoc(doc(db, gamesCollection, game.id), game);
}; 