import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  duration: number;
  onTimeout: () => void;
  isActive: boolean;
}

export const useTimer = ({ duration, onTimeout, isActive }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep the callback ref updated
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
      return;
    }

    setTimeLeft(duration);

    timeoutRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
          }
          // Use setTimeout to avoid state update during render
          setTimeout(() => onTimeoutRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [isActive, duration]);

  const percentage = (timeLeft / duration) * 100;

  return {
    timeLeft,
    percentage,
    reset,
  };
};
