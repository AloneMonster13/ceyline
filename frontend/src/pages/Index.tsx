import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EmailLogin } from '@/components/auth/EmailLogin';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { FinalScore } from '@/components/results/FinalScore';
import { AnswerReview } from '@/components/results/AnswerReview';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useQuiz } from '@/hooks/useQuiz';

type View = 'login' | 'dashboard' | 'quiz' | 'score' | 'review' | 'leaderboard';

const Index = () => {
  const [view, setView] = useState<View>('login');
  const {
    currentUser,
    login,
    logout,
    hasUserPlayed,
    getUserScore,
    getUserAnswers,
    quizState,
    currentQuestion,
    shuffledOptions,
    startQuiz,
    submitAnswer,
    leaderboard,
  } = useQuiz();

  const handleLogin = (email: string) => {
    login(email);
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

  const userHasPlayed = currentUser ? hasUserPlayed(currentUser) : false;
  const userScore = currentUser ? getUserScore(currentUser) : null;
  const userAnswers = currentUser ? getUserAnswers(currentUser) : null;

  return (
    <>
      <ThemeToggle />
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <EmailLogin onLogin={handleLogin} hasPlayed={hasUserPlayed} />
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
          />
        )}

        {view === 'quiz' && currentQuestion && (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
            <QuizQuestion
              question={currentQuestion}
              shuffledOptions={shuffledOptions}
              questionNumber={quizState.currentQuestionIndex + 1}
              totalQuestions={quizState.questions.length}
              onSubmit={handleSubmitAnswer}
            />
          </div>
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
