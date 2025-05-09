import { useState, useEffect } from 'react';
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
  Flex,
  Badge,
  ScaleFade,
  keyframes,
  useColorModeValue,
  Container,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import WebApp from '@twa-dev/sdk';
import { useGame } from '../context/GameContext';
import * as apiService from '../services/api';

// Import SVG avatars directly from the assets folder
import avatar1 from '../assets/avatars/avatar1.svg';
import avatar2 from '../assets/avatars/avatar2.svg';
import avatar3 from '../assets/avatars/avatar3.svg';
import avatar4 from '../assets/avatars/avatar4.svg';
import avatar5 from '../assets/avatars/avatar5.svg';
import avatar6 from '../assets/avatars/avatar6.svg';
import avatar7 from '../assets/avatars/avatar7.svg';
import avatar8 from '../assets/avatars/avatar8.svg';
import avatar9 from '../assets/avatars/avatar9.svg';
import avatar10 from '../assets/avatars/avatar10.svg';
import avatar11 from '../assets/avatars/avatar11.svg';
import avatar12 from '../assets/avatars/avatar12.svg';

// Create an array of avatar sources
const AVATARS = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
];

// Animation for the pulsing effect
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Improved animation for smooth vertical sliding without overlap
const slideUpInAnimation = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const slideUpOutAnimation = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
`;

// Button gradient animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Button glow effect animation
const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.6); }
  50% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.8), 0 0 30px rgba(99, 179, 237, 0.5); }
  100% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.6); }
`;

// Motion component variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const MotionBox = motion(Box);

const NumberSlot = ({ interval = 3000 }: { interval?: number }) => {
  const [currentNumber, setCurrentNumber] = useState(Math.floor(Math.random() * 9) + 1);
  const [nextNumber, setNextNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // Generate next number different from current
      let newNumber;
      do {
        newNumber = Math.floor(Math.random() * 9) + 1;
      } while (newNumber === currentNumber);

      setNextNumber(newNumber);
      setIsAnimating(true);

      // After animation completes, update current number and reset
      const animationTimeout = setTimeout(() => {
        setCurrentNumber(newNumber);
        setNextNumber(null);
        setIsAnimating(false);
      }, 500); // Match with animation duration

      return () => clearTimeout(animationTimeout);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, currentNumber]);

  return (
    <Box
      bg="whiteAlpha.300"
      borderRadius="md"
      width={{ base: "36px", md: "44px" }}
      height={{ base: "36px", md: "44px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Current number - slides up and out */}
      <Text
        fontWeight="bold"
        fontSize={{ base: "lg", md: "xl" }}
        color="white"
        position="absolute"
        width="100%"
        textAlign="center"
        sx={{
          animation: isAnimating ? `${slideUpOutAnimation} 500ms ease-out forwards` : 'none',
        }}
      >
        {currentNumber}
      </Text>

      {/* Next number - slides in from bottom */}
      {nextNumber !== null && (
        <Text
          fontWeight="bold"
          fontSize={{ base: "lg", md: "xl" }}
          color="white"
          position="absolute"
          width="100%"
          textAlign="center"
          sx={{
            animation: `${slideUpInAnimation} 500ms ease-out forwards`,
          }}
        >
          {nextNumber}
        </Text>
      )}
    </Box>
  );
};

const Welcome = () => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useGame();
  const toast = useToast();
  const bgColor = useColorModeValue('blue.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  // Start animations when component mounts
  useEffect(() => {
    setShowAnimation(true);
  }, []);

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
      let telegramId = WebApp.initDataUnsafe.user?.id?.toString();
      if (!telegramId) {
        telegramId = '1234567890';
        //throw new Error('Telegram user ID not found');
      }
      // Call the backend API to create the user in Firebase
      const newUser = await apiService.createUser({
        telegramId,
        name: name.trim(),
        avatar: selectedAvatar,
      });

      setUser(newUser);
      navigate('/game');
    } catch (error) {
      console.error('Error creating user:', error);
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
    <Container maxW="container.md" p={3} height="auto" minHeight="100vh">
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="2xl"
        overflow="visible"
        w="full"
        mb={4}
      >
        <Flex direction="column" align="center">
          {/* Header section with game logo/title */}
          <Box
            w="full"
            bg="blue.600"
            p={5}
            textAlign="center"
            position="relative"
            overflow="hidden"
            borderTopRadius="xl"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient="linear(to-r, blue.600, purple.500)"
              opacity="0.8"
            />

            <MotionBox
              position="relative"
              variants={itemVariants}
            >
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                color="white"
                fontWeight="extrabold"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Sudoku Master
              </Heading>

              {/* Animated number slots with improved sliding effect */}
              <HStack justify="center" spacing={2} mb={2}>
                <NumberSlot interval={3000} />
                <NumberSlot interval={3700} />
                <NumberSlot interval={4300} />
                <NumberSlot interval={4700} />
                <NumberSlot interval={5200} />
                <NumberSlot interval={5800} />
              </HStack>
            </MotionBox>
          </Box>

          {/* Main content - without fixed height to allow natural scrolling */}
          <Box
            p={{ base: 5, md: 7 }}
            w="full"
          >
            <VStack spacing={{ base: 5, md: 6 }}>
              <MotionBox variants={itemVariants} pt={1}>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="medium" textAlign="center" color={headingColor}>
                  Create your player profile to start the challenge!
                </Text>
              </MotionBox>

              <MotionBox w="full" variants={itemVariants}>
                <Input
                  placeholder="Enter your player name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="lg"
                  bg={cardBg}
                  borderWidth={2}
                  borderColor="blue.200"
                  _focus={{ borderColor: "blue.400" }}
                  _hover={{ borderColor: "blue.300" }}
                  rounded="lg"
                  h={{ base: "50px", md: "56px" }}
                  fontSize={{ base: "md", md: "lg" }}
                />
              </MotionBox>

              <MotionBox w="full" variants={itemVariants} pt={1}>
                <Flex justify="flex-start" align="center" mb={3}>
                  <Text fontWeight="semibold" fontSize={{ base: "lg", md: "xl" }}>Select your avatar</Text>
                </Flex>

                {/* Fixed avatar grid with consistent sizing - with more breathing room */}
                <Box width="100%" overflow="visible" mb={2}>
                  <SimpleGrid
                    columns={{ base: 4, sm: 4 }}
                    spacing={{ base: "10px", md: "16px" }}
                    width="100%"
                  >
                    {AVATARS.map((avatar, index) => (
                      <ScaleFade
                        in={showAnimation}
                        delay={index * 0.05}
                        key={avatar}
                      >
                        <Box
                          cursor="pointer"
                          borderWidth={2}
                          borderColor={selectedAvatar === avatar ? 'blue.500' : 'transparent'}
                          borderRadius="lg"
                          p={{ base: 2, md: 3 }}
                          onClick={() => setSelectedAvatar(avatar)}
                          transition="all 0.3s"
                          _hover={{ transform: 'scale(1.05)', bg: 'blue.50' }}
                          bg={cardBg}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow={selectedAvatar === avatar ? "0 0 0 2px rgba(66, 153, 225, 0.6)" : "md"}
                          position="relative"
                          aspectRatio="1/1"
                          minH={{ base: "60px", md: "75px" }}
                        >
                          {selectedAvatar === avatar && (
                            <Badge
                              position="absolute"
                              top="-2"
                              right="-2"
                              borderRadius="full"
                              colorScheme="green"
                              boxSize={{ base: "20px", md: "24px" }}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="xs"
                            >
                              ✓
                            </Badge>
                          )}
                          <Image
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            width="85%"
                            height="85%"
                            animation={selectedAvatar === avatar ? `${pulseAnimation} 2s infinite` : "none"}
                          />
                        </Box>
                      </ScaleFade>
                    ))}
                  </SimpleGrid>
                </Box>
              </MotionBox>

              <MotionBox
                w="full"
                variants={itemVariants}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                mt={{ base: 3, md: 5 }}
              >
                {/* Simplified button with animation but ensuring it's fully visible */}
                <Button
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  h={{ base: "52px", md: "60px" }}
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  borderRadius="lg"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  position="relative"
                  overflow="hidden"
                  bgGradient="linear(to-r, blue.400, blue.600)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, blue.700)",
                    transform: "translateY(-2px)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  boxShadow="md"
                  sx={{
                    animation: `${glowEffect} 3s ease-in-out infinite`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "0",
                      right: "0",
                      bottom: "0",
                      left: "0",
                      bgGradient: "linear(to-r, blue.400, purple.500, blue.600, blue.400)",
                      backgroundSize: "300% 100%",
                      animation: `${gradientShift} 3s ease infinite`,
                      opacity: "0.8",
                      zIndex: "0",
                    }
                  }}
                  leftIcon={<FaPlay style={{ position: 'relative', zIndex: 2 }} />}
                >
                  <Box position="relative" zIndex="2">
                    Start Your Adventure
                  </Box>
                </Button>
              </MotionBox>
            </VStack>
          </Box>
        </Flex>
      </MotionBox>
    </Container>
  );
};

export default Welcome;

