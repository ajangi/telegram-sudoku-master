import React, { createContext, useContext, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import type { User, GameState } from '../types';
import * as apiService from '../services/api';

interface GameContextType {
  user: User | null;
  currentGame: GameState | null;
  setUser: (user: User) => void;
  setCurrentGame: (game: GameState) => void;
  loading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const telegramId = WebApp.initDataUnsafe.user?.id.toString();
        if (!telegramId) {
          setLoading(false);
          return;
        }

        const existingUser = await apiService.getUser(telegramId);
        if (existingUser) {
          setUser(existingUser);
          if (existingUser.currentGame) {
            setCurrentGame(existingUser.currentGame);
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const value = {
    user,
    currentGame,
    setUser,
    setCurrentGame,
    loading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 