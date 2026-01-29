import { motion } from 'framer-motion';
import { Brain, Play, Trophy, ClipboardList, LogOut, Lightbulb, Sparkles, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardProps {
  email: string;
  hasPlayed: boolean;
  score: number | null;
  onStartQuiz: () => void;
  onViewAnswers: () => void;
  onViewLeaderboard: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

export const Dashboard = ({
  email,
  hasPlayed,
  score,
  onStartQuiz,
  onViewAnswers,
  onViewLeaderboard,
  onLogout,
  isLoading = false,
}: DashboardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Full-screen animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/30" />
      
      {/* Animated gradient orbs with glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large pulsing orb - top left */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Medium orb - bottom right */}
        <motion.div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-primary/25 to-success/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        {/* Small accent orb - center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Floating brain icons */}
        <motion.div
          className="absolute top-[15%] left-[10%] text-primary/20"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain size={32} />
        </motion.div>
        
        <motion.div
          className="absolute top-[25%] right-[12%] text-primary/15"
          animate={{
            y: [0, -15, 0],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, -8, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Lightbulb size={28} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[20%] left-[8%] text-primary/20"
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.35, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkles size={24} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[30%] right-[10%] text-primary/15"
          animate={{
            y: [0, -12, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Brain size={26} />
        </motion.div>

        {/* Blinking dots / particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-border/50 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />

          <CardContent className="p-8">
            {/* Logo and title */}
            <div className="text-center mb-8">
              <motion.div
                className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Quiz Master
                </span>
              </h1>
              <p className="text-muted-foreground">
                Welcome, <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>

            {hasPlayed && score !== null ? (
              /* Already played state */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center p-6 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Your Final Score</p>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {score}<span className="text-2xl text-muted-foreground">/10</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Quiz completed!</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={onViewAnswers}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                  >
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Review My Answers
                  </Button>
                  <Button
                    onClick={onViewLeaderboard}
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-primary/50 hover:bg-primary/10"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    View Leaderboard
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Ready to play state */
              <motion.div className="space-y-6">
                <div className="text-center p-6 rounded-2xl bg-muted/50 border border-border/50">
                  <p className="text-muted-foreground mb-1">Ready to test your knowledge?</p>
                  <p className="text-sm text-muted-foreground">
                    10 questions • 7 seconds each • One attempt only
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onStartQuiz}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Animated glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                    <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                    Play Game
                  </Button>
                </motion.div>

                <Button
                  onClick={() => {
                    toast.info('Complete the quiz first to view the leaderboard!', {
                      description: 'Play the game to see how you rank against others.',
                      icon: <Lock className="w-4 h-4" />,
                    });
                  }}
                  variant="ghost"
                  className="w-full h-10 text-muted-foreground hover:text-foreground hover:bg-primary/10 opacity-60"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                  <Lock className="w-3 h-3 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Logout */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
