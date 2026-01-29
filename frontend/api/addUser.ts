import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI not defined in .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const client = await clientPromise;
    const db = client.db('quizDB'); // explicitly use your DB name

    const users = db.collection('users');

    const exists = await users.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const result = await users.insertOne({ email, createdAt: new Date() });
    return res.status(200).json({ message: 'Email saved', id: result.insertedId });
  } catch (err) {
    console.error('MongoDB Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
