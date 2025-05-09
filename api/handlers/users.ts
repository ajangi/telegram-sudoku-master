import {Request, Response} from 'express';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();


export const createUser = async(req: Request, res: Response) => {
  const { telegramId, name, avatar } = req.body;

  if (!telegramId || !name || !avatar) {
    res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userRef = db.collection('users').doc(telegramId);
    await userRef.set({ telegramId, name, avatar }, { merge: true });
    const userDoc = await userRef.get();
    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: (error as Error).message });
  }
}
