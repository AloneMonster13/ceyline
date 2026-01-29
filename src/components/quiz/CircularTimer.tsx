import { motion } from 'framer-motion';

interface CircularTimerProps {
  timeLeft: number;
  duration: number;
}

export const CircularTimer = ({ timeLeft, duration }: CircularTimerProps) => {
  const percentage = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color changes based on time remaining
  const getColor = () => {
    if (timeLeft <= 2) return 'hsl(var(--destructive))';
    if (timeLeft <= 4) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };

  return (
    <div className="relative w-24 h-24">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <motion.circle
          cx="48"
          cy="48"
          r="45"
          fill="none"
          stroke={getColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold"
          style={{ color: getColor() }}
        >
          {timeLeft}
        </motion.span>
      </div>

      {/* Pulse effect when time is low */}
      {timeLeft <= 3 && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: getColor() }}
          animate={{
            scale: [1, 1.2],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
};
