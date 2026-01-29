import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { QuizQuestion } from './QuizQuestion';
import { FloatingIcons } from './FloatingIcons';
import { BlinkingBulbs } from './BlinkingBulbs';
import { useBackgroundAudio } from '@/hooks/useBackgroundAudio';
import { Question } from '@/data/questions';

interface QuizContainerProps {
  question: Question;
  shuffledOptions: string[];
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string | null) => void;
  isComplete: boolean;
}

export const QuizContainer = ({
  question,
  shuffledOptions,
  questionNumber,
  totalQuestions,
  onSubmit,
  isComplete,
}: QuizContainerProps) => {
  const { play, fadeOutAndStop } = useBackgroundAudio();
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Random position offset for each question
  const positionOffset = useMemo(() => ({
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 20,
  }), [question.id]);

  // Start audio on first question
  useEffect(() => {
    if (!hasStartedAudio && questionNumber === 1) {
      play();
      setHasStartedAudio(true);
    }
  }, [questionNumber, hasStartedAudio, play]);

  // Stop audio when quiz is complete
  useEffect(() => {
    if (isComplete) {
      fadeOutAndStop();
    }
  }, [isComplete, fadeOutAndStop]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/30" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.15, 0.3],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-success/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating icons */}
      <FloatingIcons />

      {/* Blinking bulbs at random positions */}
      <BlinkingBulbs />

      {/* Question with random position offset */}
      <motion.div
        style={{ x: positionOffset.x, y: positionOffset.y }}
        className="relative z-10"
      >
        <QuizQuestion
          question={question}
          shuffledOptions={shuffledOptions}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onSubmit={onSubmit}
        />
      </motion.div>
    </div>
  );
};
