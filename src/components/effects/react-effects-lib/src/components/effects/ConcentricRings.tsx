import React from 'react';
import { motion } from "framer-motion";

interface ConcentricRingsProps {
  className?: string;
  color: string;
  count: number;
  duration: number;
}

export const ConcentricRings: React.FC<ConcentricRingsProps> = ({ 
  className = '', 
  color, 
  count, 
  duration 
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            delay: (i * duration) / (count * 1000),
          }}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            backgroundColor: 'transparent'
          }}
        />
      ))}
    </div>
  );
};