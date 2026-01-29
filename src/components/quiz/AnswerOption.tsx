import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const optionLabels = ['A', 'B', 'C', 'D', 'E'];

export const AnswerOption = ({ option, index, isSelected, onSelect, disabled }: AnswerOptionProps) => {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
          : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-200",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {optionLabels[index]}
      </span>
      <span className={cn(
        "text-base font-medium transition-colors duration-200",
        isSelected ? "text-foreground" : "text-foreground/80"
      )}>
        {option}
      </span>
    </motion.button>
  );
};
