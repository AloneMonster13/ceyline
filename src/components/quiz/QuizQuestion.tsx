import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularTimer } from './CircularTimer';
import { AnswerOption } from './AnswerOption';
import { useTimer } from '@/hooks/useTimer';
import { Question } from '@/data/questions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  shuffledOptions: string[];
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string | null) => void;
}

export const QuizQuestion = ({
  question,
  shuffledOptions,
  questionNumber,
  totalQuestions,
  onSubmit,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleTimeout = useCallback(() => {
    if (!hasSubmitted) {
      setHasSubmitted(true);
      // Submit the selected answer (even if null) - saves user's selection on timeout
      onSubmit(selectedAnswer);
    }
  }, [hasSubmitted, onSubmit, selectedAnswer]);

  const { timeLeft } = useTimer({
    duration: 10,
    onTimeout: handleTimeout,
    isActive: !hasSubmitted,
  });

  const handleOptionClick = (option: string) => {
    if (!hasSubmitted) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (!hasSubmitted) {
      setHasSubmitted(true);
      onSubmit(selectedAnswer);
    }
  };

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
  }, [question.id]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="glass-card border-border/50 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80"
              initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <CardContent className="p-6 sm:p-8">
            {/* Header with timer and progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Question</span>
                <span className="text-2xl font-bold text-primary">
                  {questionNumber} <span className="text-muted-foreground text-lg">/ {totalQuestions}</span>
                </span>
              </div>
              <CircularTimer timeLeft={timeLeft} duration={10} />
            </div>

            {/* Question */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-semibold text-foreground mb-8 leading-relaxed"
            >
              {question.question}
            </motion.h2>

            {/* Options */}
            <div className="space-y-3">
              {shuffledOptions.map((option, index) => (
                <AnswerOption
                  key={`${question.id}-${option}`}
                  option={option}
                  index={index}
                  isSelected={selectedAnswer === option}
                  onSelect={() => handleOptionClick(option)}
                  disabled={hasSubmitted}
                />
              ))}
            </div>

            {/* Submit button */}
            {!hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Submit Answer</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Status indicator */}
            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                Answer submitted! Loading next question...
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
