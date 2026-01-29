import { motion } from 'framer-motion';
import { Trophy, Star, Target, PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FinalScoreProps {
  score: number;
  totalQuestions: number;
  onViewAnswers: () => void;
  onViewLeaderboard: () => void;
}

export const FinalScore = ({ score, totalQuestions, onViewAnswers, onViewLeaderboard }: FinalScoreProps) => {
  const percentage = (score / totalQuestions) * 100;

  const getMessage = () => {
    if (percentage === 100) return { text: "Perfect Score!", icon: Trophy, emoji: "🏆" };
    if (percentage >= 80) return { text: "Excellent!", icon: Star, emoji: "🌟" };
    if (percentage >= 60) return { text: "Good Job!", icon: Target, emoji: "👍" };
    if (percentage >= 40) return { text: "Nice Try!", icon: PartyPopper, emoji: "💪" };
    return { text: "Keep Learning!", icon: Target, emoji: "📚" };
  };

  const message = getMessage();
  const MessageIcon = message.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
      {/* Celebration background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${166 + Math.random() * 30} 70% ${50 + Math.random() * 20}%)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-border/50 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />
          
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
            >
              <MessageIcon className="w-12 h-12 text-primary-foreground" />
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {message.text}
                </span>
                <span className="ml-2">{message.emoji}</span>
              </h1>
              <p className="text-muted-foreground mb-6">Quiz completed!</p>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="mb-8"
            >
              <div className="inline-flex items-baseline gap-1 px-8 py-4 rounded-2xl bg-primary/10 border border-primary/20">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-6xl font-bold text-primary"
                >
                  {score}
                </motion.span>
                <span className="text-2xl text-muted-foreground">/ {totalQuestions}</span>
              </div>
              <p className="mt-3 text-muted-foreground">
                {percentage.toFixed(0)}% correct
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <Button
                onClick={onViewAnswers}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                Review My Answers
              </Button>
              <Button
                onClick={onViewLeaderboard}
                variant="outline"
                className="w-full h-12 text-base font-semibold border-primary/50 hover:bg-primary/10"
              >
                View Leaderboard
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
