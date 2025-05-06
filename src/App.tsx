import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { GameProvider } from './context/GameContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGame } from './context/GameContext';

// We'll create these components next
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import Loading from './components/Loading';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useGame();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route
              path="/game"
              element={
                <PrivateRoute>
                  <Game />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </GameProvider>
    </ChakraProvider>
  );
}

export default App;
