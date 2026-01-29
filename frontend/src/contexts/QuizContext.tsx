import React, { createContext, useContext, ReactNode } from 'react';
import { useQuiz } from '@/hooks/useQuiz';

type QuizContextType = ReturnType<typeof useQuiz>;

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const quiz = useQuiz();
  return <QuizContext.Provider value={quiz}>{children}</QuizContext.Provider>;
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};
