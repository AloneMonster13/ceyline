import { motion } from 'framer-motion';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAnswer } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface AnswerReviewProps {
  answers: UserAnswer[];
  score: number;
  onBack: () => void;
}

export const AnswerReview = ({ answers, score, onBack }: AnswerReviewProps) => {
  return (
    <div className="min-h-screen p-4 py-8 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Answer Review
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                See how you performed on each question
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{score}/{answers.length}</div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>
          </div>
        </motion.div>

        {/* Answers list */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 pr-4">
            {answers.map((answer, index) => (
              <motion.div
                key={answer.questionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "border-2 overflow-hidden transition-all",
                  answer.isCorrect 
                    ? "border-success/30 bg-success/5" 
                    : "border-destructive/30 bg-destructive/5"
                )}>
                  {/* Status bar */}
                  <div className={cn(
                    "h-1",
                    answer.isCorrect 
                      ? "bg-gradient-to-r from-success to-success/80" 
                      : "bg-gradient-to-r from-destructive to-destructive/80"
                  )} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base font-medium leading-relaxed">
                        <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
                        {answer.question}
                      </CardTitle>
                      <div className={cn(
                        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        answer.isCorrect ? "bg-success/20" : "bg-destructive/20"
                      )}>
                        {answer.isCorrect ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <X className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    {/* User's answer */}
                    <div className={cn(
                      "p-3 rounded-lg border",
                      answer.isCorrect 
                        ? "bg-success/10 border-success/30" 
                        : "bg-destructive/10 border-destructive/30"
                    )}>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Your Answer
                      </span>
                      <p className={cn(
                        "font-medium mt-1",
                        answer.isCorrect ? "text-success" : "text-destructive"
                      )}>
                        {answer.selectedAnswer || "No answer (timed out)"}
                      </p>
                    </div>

                    {/* Correct answer (only show if wrong) */}
                    {!answer.isCorrect && (
                      <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Correct Answer
                        </span>
                        <p className="font-medium mt-1 text-success">
                          {answer.correctAnswer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
