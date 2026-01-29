import { useState, useCallback, useEffect } from 'react';
import { Question, getRandomQuestions, shuffleOptions } from '@/data/questions';
import { UserAnswer, LeaderboardEntry } from './useLocalStorage';
import { supabase } from '@/integrations/supabase/client';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  isComplete: boolean;
  score: number;
}

export const useGoogleSheetsQuiz = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('quiz_current_user_email');
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userAnswersData, setUserAnswersData] = useState<UserAnswer[] | null>(null);

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
    score: 0,
  });

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Fetch leaderboard from Google Sheets
  const fetchLeaderboard = useCallback(async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-sheets?action=get-leaderboard`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      
      const result = await response.json();
      if (result.leaderboard) {
        const sortedLeaderboard = result.leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
        setLeaderboard(sortedLeaderboard);
        return sortedLeaderboard;
      }
      return [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }, []);

  // Check if user has played
  const checkUserPlayed = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-sheets?action=check-played&email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      
      const result = await response.json();
      return result.hasPlayed || false;
    } catch (error) {
      console.error('Error checking if user played:', error);
      return false;
    }
  }, []);

  // Save score to Google Sheets
  const saveScore = useCallback(async (email: string, score: number, answers: UserAnswer[]) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-sheets?action=save-score`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            email,
            score,
            date: new Date().toISOString(),
          }),
        }
      );
      
      const result = await response.json();
      if (result.success) {
        // Store answers locally for review
        localStorage.setItem('quiz_user_answers', JSON.stringify({
          email,
          answers,
          score,
        }));
        
        // Refresh leaderboard
        await fetchLeaderboard();
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }, [fetchLeaderboard]);

  const hasUserPlayed = useCallback((email: string) => {
    return hasPlayed;
  }, [hasPlayed]);

  const getUserScore = useCallback((email: string) => {
    const entry = leaderboard.find(e => e.email.toLowerCase() === email.toLowerCase());
    return entry?.score ?? null;
  }, [leaderboard]);

  const getUserAnswers = useCallback((email: string) => {
    const stored = localStorage.getItem('quiz_user_answers');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.email.toLowerCase() === email.toLowerCase()) {
        return data.answers;
      }
    }
    return null;
  }, []);

  const login = useCallback(async (email: string) => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase();
    setCurrentUser(normalizedEmail);
    localStorage.setItem('quiz_current_user_email', normalizedEmail);
    
    // Fetch fresh leaderboard and get the returned data directly (avoid stale state)
    const freshLeaderboard = await fetchLeaderboard();
    
    // Check if user has already played
    const played = await checkUserPlayed(normalizedEmail);
    setHasPlayed(played);
    
    if (played) {
      // Try localStorage first (most accurate for this user)
      const storedAnswers = localStorage.getItem('quiz_user_answers');
      if (storedAnswers) {
        const data = JSON.parse(storedAnswers);
        if (data.email.toLowerCase() === normalizedEmail) {
          setUserScore(data.score);
          setIsLoading(false);
          return;
        }
      }
      // Fallback to fresh leaderboard data
      const entry = freshLeaderboard.find(e => e.email.toLowerCase() === normalizedEmail);
      if (entry) {
        setUserScore(entry.score);
      }
    }
    
    setIsLoading(false);
  }, [checkUserPlayed, fetchLeaderboard]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setHasPlayed(false);
    setUserScore(null);
    localStorage.removeItem('quiz_current_user_email');
  }, []);

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

  const submitAnswer = useCallback(async (selectedAnswer: string | null) => {
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

    // If quiz is complete, save results to Google Sheets
    if (isComplete && currentUser) {
      setHasPlayed(true);
      setUserScore(newScore);
      await saveScore(currentUser, newScore, newAnswers);
    }
  }, [quizState, currentUser, saveScore]);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  // Load leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Check if current user has played on mount and when leaderboard updates
  useEffect(() => {
    const checkStatus = async () => {
      if (currentUser) {
        const played = await checkUserPlayed(currentUser);
        setHasPlayed(played);
        if (played) {
          // Try to get score from local storage first (more accurate)
          const storedAnswers = localStorage.getItem('quiz_user_answers');
          if (storedAnswers) {
            const data = JSON.parse(storedAnswers);
            if (data.email.toLowerCase() === currentUser.toLowerCase()) {
              setUserScore(data.score);
              return;
            }
          }
          // Fallback to leaderboard
          const entry = leaderboard.find(e => e.email.toLowerCase() === currentUser.toLowerCase());
          if (entry) {
            setUserScore(entry.score);
          }
        }
      }
    };
    checkStatus();
  }, [currentUser, checkUserPlayed, leaderboard]);

  return {
    // Auth
    currentUser,
    login,
    logout,
    hasUserPlayed,
    getUserScore,
    getUserAnswers,
    isLoading,
    userScore,
    hasPlayed,
    
    // Quiz
    quizState,
    currentQuestion,
    shuffledOptions,
    startQuiz,
    submitAnswer,
    
    // Leaderboard
    leaderboard,
    fetchLeaderboard,
  };
};
