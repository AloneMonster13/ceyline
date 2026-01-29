import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'quiz_current_user',
  PLAYED_EMAILS: 'quiz_played_emails',
  LEADERBOARD: 'quiz_leaderboard',
  USER_ANSWERS: 'quiz_user_answers',
} as const;

// Types
export interface LeaderboardEntry {
  email: string;
  score: number;
  date: string;
}

export interface UserAnswer {
  questionId: number;
  question: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface UserGameData {
  email: string;
  answers: UserAnswer[];
  score: number;
}
