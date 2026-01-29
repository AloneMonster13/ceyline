import { useState, useCallback } from 'react';
import { Question, getRandomQuestions, shuffleOptions } from '@/data/questions';
import { useLocalStorage, STORAGE_KEYS, LeaderboardEntry, UserAnswer, UserGameData } from './useLocalStorage';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  isComplete: boolean;
  score: number;
}

export const useQuiz = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>(STORAGE_KEYS.CURRENT_USER, null);
  const [playedEmails, setPlayedEmails] = useLocalStorage<string[]>(STORAGE_KEYS.PLAYED_EMAILS, []);
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, []);
  const [userAnswers, setUserAnswers] = useLocalStorage<UserGameData | null>(STORAGE_KEYS.USER_ANSWERS, null);

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
    score: 0,
  });

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const hasUserPlayed = useCallback((email: string) => {
    return playedEmails.includes(email.toLowerCase());
  }, [playedEmails]);

  const getUserScore = useCallback((email: string) => {
    const entry = leaderboard.find(e => e.email.toLowerCase() === email.toLowerCase());
    return entry?.score ?? null;
  }, [leaderboard]);

  const getUserAnswers = useCallback((email: string) => {
    if (userAnswers && userAnswers.email.toLowerCase() === email.toLowerCase()) {
      return userAnswers.answers;
    }
    return null;
  }, [userAnswers]);

  const login = useCallback((email: string) => {
    setCurrentUser(email.toLowerCase());
  }, [setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const startQuiz = useCallback(() => {
    const selectedQuestions = getRandomQuestions(10);
    setQuizState({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
      score: 0,
    });
    if (selectedQuestions.length > 0) {
      setShuffledOptions(shuffleOptions(selectedQuestions[0].options));
    }
  }, []);

  const submitAnswer = useCallback((selectedAnswer: string | null) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    const newAnswers = [...quizState.answers, answer];
    const newScore = quizState.score + (isCorrect ? 1 : 0);
    const nextIndex = quizState.currentQuestionIndex + 1;
    const isComplete = nextIndex >= quizState.questions.length;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: newScore,
      currentQuestionIndex: nextIndex,
      isComplete,
    }));

    if (!isComplete && quizState.questions[nextIndex]) {
      setShuffledOptions(shuffleOptions(quizState.questions[nextIndex].options));
    }

    // If quiz is complete, save results
    if (isComplete && currentUser) {
      // Mark email as played
      setPlayedEmails(prev => [...prev, currentUser.toLowerCase()]);
      
      // Add to leaderboard
      const newEntry: LeaderboardEntry = {
        email: currentUser,
        score: newScore,
        date: new Date().toISOString(),
      };
      setLeaderboard(prev => [...prev, newEntry].sort((a, b) => b.score - a.score));
      
      // Save user answers for review
      setUserAnswers({
        email: currentUser,
        answers: newAnswers,
        score: newScore,
      });
    }
  }, [quizState, currentUser, setPlayedEmails, setLeaderboard, setUserAnswers]);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return {
    // Auth
    currentUser,
    login,
    logout,
    hasUserPlayed,
    getUserScore,
    getUserAnswers,
    
    // Quiz
    quizState,
    currentQuestion,
    shuffledOptions,
    startQuiz,
    submitAnswer,
    
    // Leaderboard
    leaderboard,
  };
};
