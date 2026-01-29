import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not defined');

const client = new MongoClient(uri);
let dbClient;

async function connectDB() {
  if (!dbClient) {
    await client.connect();
    dbClient = client.db('quizDB'); // use your DB name
    console.log('Connected to MongoDB');
  }
  return dbClient;
}

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const exists = await users.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const result = await users.insertOne({ email, createdAt: new Date() });
    res.status(200).json({ message: 'Email saved', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
