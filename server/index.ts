import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// API Routes
app.post('/api/users', async (req, res) => {
  try {
    const { telegramId, name, avatar } = req.body;
    const user = {
      telegramId,
      name,
      avatar,
      score: 0
    };
    await setDoc(doc(db, 'users', telegramId), user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const userDoc = await getDoc(doc(db, 'users', telegramId));
    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.patch('/api/users/:telegramId/score', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { score } = req.body;
    await updateDoc(doc(db, 'users', telegramId), { score });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update score' });
  }
});

app.patch('/api/users/:telegramId/game', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { gameState } = req.body;
    await updateDoc(doc(db, 'users', telegramId), { currentGame: gameState });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game state' });
  }
});

app.get('/api/games/random', async (req, res) => {
  try {
    const { difficulty } = req.query;
    const gamesQuery = query(
      collection(db, 'games'),
      where('difficulty', '==', difficulty)
    );
    const gamesSnapshot = await getDocs(gamesQuery);
    const games = gamesSnapshot.docs.map(doc => doc.data());
    const randomGame = games[Math.floor(Math.random() * games.length)];
    res.json(randomGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get random game' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 