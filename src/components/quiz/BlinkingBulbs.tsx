import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface BulbInstance {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export const BlinkingBulbs = () => {
  const [bulbs, setBulbs] = useState<BulbInstance[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Generate a random bulb
  const generateBulb = (): BulbInstance => {
    return {
      id: idCounter,
      x: Math.random() * 90 + 5, // 5% to 95%
      y: Math.random() * 80 + 10, // 10% to 90%
      size: Math.random() * 16 + 20, // 20px to 36px
      duration: Math.random() * 0.5 + 0.3, // 0.3s to 0.8s blink duration
    };
  };

  // Add new bulbs at random intervals
  useEffect(() => {
    const addBulb = () => {
      const newBulb = generateBulb();
      setIdCounter(prev => prev + 1);
      setBulbs(prev => [...prev, { ...newBulb, id: idCounter }]);

      // Remove bulb after animation
      setTimeout(() => {
        setBulbs(prev => prev.filter(b => b.id !== newBulb.id));
      }, 1500);
    };

    // Add initial bulbs
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addBulb(), i * 200);
    }

    // Continue adding bulbs at random intervals
    const interval = setInterval(() => {
      addBulb();
    }, 400 + Math.random() * 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {bulbs.map((bulb) => (
          <motion.div
            key={bulb.id}
            className="absolute text-warning"
            style={{
              left: `${bulb.x}%`,
              top: `${bulb.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0.5, 1, 0],
              scale: [0.5, 1.2, 1, 1.1, 1, 0.5],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1.2,
              times: [0, 0.1, 0.3, 0.5, 0.7, 1],
              ease: 'easeInOut',
            }}
          >
            <motion.div
              animate={{
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(0.8)', 'brightness(1.3)', 'brightness(1)'],
              }}
              transition={{
                duration: bulb.duration,
                repeat: 3,
                ease: 'easeInOut',
              }}
            >
              <Lightbulb
                size={bulb.size}
                className="drop-shadow-[0_0_10px_hsl(var(--warning))]"
                fill="currentColor"
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
