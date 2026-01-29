import { motion } from 'framer-motion';
import { Brain, Lightbulb } from 'lucide-react';

const icons = [
  { Icon: Brain, delay: 0, x: '10%', y: '15%', size: 28 },
  { Icon: Lightbulb, delay: 0.5, x: '85%', y: '20%', size: 24 },
  { Icon: Brain, delay: 1, x: '5%', y: '70%', size: 22 },
  { Icon: Lightbulb, delay: 1.5, x: '90%', y: '75%', size: 26 },
  { Icon: Brain, delay: 2, x: '15%', y: '45%', size: 20 },
  { Icon: Lightbulb, delay: 2.5, x: '80%', y: '50%', size: 22 },
];

export const FloatingIcons = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map(({ Icon, delay, x, y, size }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.15, 0.35, 0.15],
            scale: [1, 1.15, 1],
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + index * 0.5,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};
