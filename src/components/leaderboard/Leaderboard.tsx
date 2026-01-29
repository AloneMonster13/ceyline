import { motion } from 'framer-motion';
import { Trophy, Medal, Award, ArrowLeft, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LeaderboardEntry } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserEmail?: string;
  onBack: () => void;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-medium">{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border-yellow-500/30";
    case 2:
      return "bg-gradient-to-r from-gray-400/20 to-gray-400/10 border-gray-400/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-amber-600/10 border-amber-600/30";
    default:
      return "";
  }
};

export const Leaderboard = ({ entries, currentUserEmail, onBack }: LeaderboardProps) => {
  // Filter out entries with no valid score (only show players who completed the game)
  // Then sort by score (descending) and assign ranks
  const sortedEntries = [...entries]
    .filter((entry) => entry.score != null && entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

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
            Back
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Leaderboard
                </span>
              </h1>
              <p className="text-muted-foreground">
                {entries.length} player{entries.length !== 1 ? 's' : ''} have completed the quiz
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard table */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
          
          {entries.length === 0 ? (
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No scores yet. Be the first to complete the quiz!</p>
            </CardContent>
          ) : (
            <ScrollArea className="h-[60vh] w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-20 text-center">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right w-24">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEntries.map((entry, index) => {
                    const isCurrentUser = entry.email.toLowerCase() === currentUserEmail?.toLowerCase();
                    
                    return (
                      <motion.tr
                        key={`${entry.email}-${entry.date}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "border-border/50 transition-colors",
                          getRankStyle(entry.rank),
                          isCurrentUser && "ring-2 ring-primary/50 ring-inset"
                        )}
                      >
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center w-8 h-8 mx-auto">
                            {getRankIcon(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              isCurrentUser && "text-primary"
                            )}>
                              {entry.email}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                You
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "font-bold text-lg",
                            entry.rank <= 3 ? "text-primary" : "text-foreground"
                          )}>
                            {entry.score}/10
                          </span>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
};
