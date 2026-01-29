import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailLoginProps {
  onLogin: (email: string) => void;
}

export const EmailLogin = ({ onLogin }: EmailLoginProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onLogin(email.trim().toLowerCase());
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/20 to-primary/20"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glowing blobs */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl top-[-100px] left-[-100px]"
        animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl bottom-[-120px] right-[-120px]"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Random floating icons */}
      {[...Array(12)].map((_, i) => {
        const Icon = i % 2 === 0 ? Brain : Sparkles;
        return (
          <motion.div
            key={i}
            className="absolute text-primary/40"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            initial={{ opacity: 0.2, scale: 0.7 }}
            animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1.2, 0.7], y: [0, -20, 0] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon size={16 + Math.random() * 20} />
          </motion.div>
        );
      })}

      {/* Login form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md glass-card border-border/50 overflow-hidden backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />

          <CardHeader className="text-center pb-2 pt-8">
            <motion.div
              className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Brain className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Quiz Master
              </span>
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Test your knowledge with 10 challenging questions
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email to start"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="h-12 pl-4 pr-4 text-base bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
              />
              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm">
                  {error}
                </motion.p>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>One attempt per email</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
