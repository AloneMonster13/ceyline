import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import addUserRoute from './routes/addUser.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json());

// Routes
app.use('/addUser', addUserRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
