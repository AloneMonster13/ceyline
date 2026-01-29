import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EmailLogin } from '@/components/auth/EmailLogin';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { FinalScore } from '@/components/results/FinalScore';
import { AnswerReview } from '@/components/results/AnswerReview';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useGoogleSheetsQuiz } from '@/hooks/useGoogleSheetsQuiz';

type View = 'login' | 'dashboard' | 'quiz' | 'score' | 'review' | 'leaderboard';

const Index = () => {
  const [view, setView] = useState<View>('login');
  const {
    currentUser,
    login,
    logout,
    hasUserPlayed,
    getUserAnswers,
    quizState,
    currentQuestion,
    shuffledOptions,
    startQuiz,
    submitAnswer,
    leaderboard,
    isLoading,
    userScore: storedUserScore,
    hasPlayed,
  } = useGoogleSheetsQuiz();

  const handleLogin = async (email: string) => {
    await login(email);
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setView('login');
  };

  const handleStartQuiz = () => {
    startQuiz();
    setView('quiz');
  };

  const handleSubmitAnswer = (answer: string | null) => {
    submitAnswer(answer);
    
    // Check if quiz is complete after this answer
    if (quizState.currentQuestionIndex >= quizState.questions.length - 1) {
      setTimeout(() => setView('score'), 500);
    }
  };

  // Use the stored hasPlayed and userScore from the hook (persisted state)
  // These values are set during login and maintained across navigation
  const userHasPlayed = hasPlayed;
  const userScore = storedUserScore;
  const userAnswers = currentUser ? getUserAnswers(currentUser) : null;

  // Note: Dashboard is accessible to all logged-in users
  // But leaderboard access is restricted until they complete the quiz

  return (
    <>
      <ThemeToggle />
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <EmailLogin onLogin={handleLogin} />
        )}

        {view === 'dashboard' && currentUser && (
          <Dashboard
            email={currentUser}
            hasPlayed={userHasPlayed}
            score={userScore}
            onStartQuiz={handleStartQuiz}
            onViewAnswers={() => setView('review')}
            onViewLeaderboard={() => setView('leaderboard')}
            onLogout={handleLogout}
            isLoading={isLoading}
          />
        )}

        {view === 'quiz' && currentQuestion && (
          <QuizContainer
            question={currentQuestion}
            shuffledOptions={shuffledOptions}
            questionNumber={quizState.currentQuestionIndex + 1}
            totalQuestions={quizState.questions.length}
            onSubmit={handleSubmitAnswer}
            isComplete={quizState.isComplete}
          />
        )}

        {view === 'score' && (
          <FinalScore
            score={quizState.score}
            totalQuestions={quizState.questions.length}
            onViewAnswers={() => setView('review')}
            onViewLeaderboard={() => setView('leaderboard')}
          />
        )}

        {view === 'review' && (userAnswers || quizState.answers.length > 0) && (
          <AnswerReview
            answers={userAnswers || quizState.answers}
            score={userScore ?? quizState.score}
            onBack={() => setView(userHasPlayed ? 'dashboard' : 'score')}
          />
        )}

        {view === 'leaderboard' && (
          <Leaderboard
            entries={leaderboard}
            currentUserEmail={currentUser ?? undefined}
            onBack={() => setView(userHasPlayed ? 'dashboard' : 'score')}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
