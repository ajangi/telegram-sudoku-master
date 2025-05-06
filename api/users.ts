import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { telegramId } = req.query;

  if (!telegramId || typeof telegramId !== 'string') {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }

  try {
    switch (req.method) {
      case 'POST':
        const { name, avatar } = req.body;
        const user = {
          telegramId,
          name,
          avatar,
          score: 0
        };
        await setDoc(doc(db, 'users', telegramId), user);
        return res.json(user);

      case 'GET':
        const userDoc = await getDoc(doc(db, 'users', telegramId));
        if (!userDoc.exists()) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.json(userDoc.data());

      case 'PATCH':
        if (req.url?.includes('/score')) {
          const { score } = req.body;
          await updateDoc(doc(db, 'users', telegramId), { score });
          return res.json({ success: true });
        } else if (req.url?.includes('/game')) {
          const { gameState } = req.body;
          await updateDoc(doc(db, 'users', telegramId), { currentGame: gameState });
          return res.json({ success: true });
        }
        return res.status(400).json({ error: 'Invalid endpoint' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 