import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Select,
  Text,
  useToast,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useGame } from '../context/GameContext';
import * as apiService from '../services/api';
import type { GameState } from '../types';

const Game = () => {
  const { user, currentGame, setCurrentGame } = useGame();
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (currentGame) {
      return;
    }
    loadNewGame();
  }, [difficulty]);

  const loadNewGame = async () => {
    setIsLoading(true);
    try {
      const game = await apiService.getRandomGame(difficulty);
      if (!game) {
        throw new Error('No games available for selected difficulty');
      }

      const newGameState: GameState = {
        id: game.id,
        difficulty: game.difficulty,
        board: game.board,
        solution: game.solution,
        userInput: Array(9).fill(null).map(() => Array(9).fill(0)),
        startTime: Date.now(),
        isCompleted: false,
      };

      setCurrentGame(newGameState);
      if (user) {
        await apiService.updateUserGame(user.telegramId, newGameState);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load game. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentGame) {
    return null;
  }

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <HStack w="full" justify="space-between">
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            w="200px"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Button onClick={loadNewGame} isLoading={isLoading}>
            New Game
          </Button>
        </HStack>

        <Grid
          templateColumns="repeat(9, 1fr)"
          gap={0.5}
          borderWidth={2}
          borderColor="gray.500"
        >
          {currentGame.board.map((row, i) =>
            row.map((cell, j) => (
              <Box
                key={`${i}-${j}`}
                w="40px"
                h="40px"
                bg={selectedCell?.[0] === i && selectedCell?.[1] === j ? 'blue.100' : 'white'}
                borderWidth={1}
                borderColor="gray.300"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor={cell === 0 ? 'pointer' : 'default'}
                onClick={() => cell === 0 && setSelectedCell([i, j])}
              >
                <Text fontSize="lg" fontWeight={cell !== 0 ? 'bold' : 'normal'}>
                  {cell !== 0 ? cell : currentGame.userInput[i][j] || ''}
                </Text>
              </Box>
            ))
          )}
        </Grid>

        <Grid templateColumns="repeat(5, 1fr)" gap={2} w="full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => {
                if (!selectedCell) return;
                const [row, col] = selectedCell;
                const newUserInput = [...currentGame.userInput];
                newUserInput[row][col] = num;
                const newGameState = { ...currentGame, userInput: newUserInput };
                setCurrentGame(newGameState);
                if (user) {
                  apiService.updateUserGame(user.telegramId, newGameState);
                }
              }}
              size="lg"
              colorScheme="blue"
            >
              {num}
            </Button>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default Game; 