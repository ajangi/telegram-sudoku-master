import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  SimpleGrid,
  Image,
  useToast,
} from '@chakra-ui/react';
import WebApp from '@twa-dev/sdk';
import { useGame } from '../context/GameContext';
import * as apiService from '../services/api';

const AVATARS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
];

const Welcome = () => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useGame();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name.trim() || !selectedAvatar) {
      toast({
        title: 'Error',
        description: 'Please enter your name and select an avatar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const telegramId = WebApp.initDataUnsafe.user?.id.toString();
      if (!telegramId) {
        throw new Error('Telegram user ID not found');
      }

      const newUser = await apiService.createUser({
        telegramId,
        name: name.trim(),
        avatar: selectedAvatar,
      });

      setUser(newUser);
      navigate('/game');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxW="container.sm" mx="auto">
      <VStack spacing={8}>
        <Heading>Welcome to Sudoku Master!</Heading>
        <Text>Please enter your name and select an avatar to begin</Text>

        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="lg"
        />

        <SimpleGrid columns={3} spacing={4} w="full">
          {AVATARS.map((avatar) => (
            <Box
              key={avatar}
              cursor="pointer"
              borderWidth={2}
              borderColor={selectedAvatar === avatar ? 'blue.500' : 'transparent'}
              borderRadius="md"
              p={2}
              onClick={() => setSelectedAvatar(avatar)}
            >
              <Image src={avatar} alt="Avatar" />
            </Box>
          ))}
        </SimpleGrid>

        <Button
          colorScheme="blue"
          size="lg"
          w="full"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Start Playing
        </Button>
      </VStack>
    </Box>
  );
};

export default Welcome; 