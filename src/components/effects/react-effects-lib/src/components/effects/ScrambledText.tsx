import React, { useState, useEffect } from 'react';

interface ScrambledTextProps {
  text: string;
  className?: string;
  speed?: number;
  trigger?: 'auto' | 'hover';
}

export const ScrambledText: React.FC<ScrambledTextProps> = ({ 
  text, 
  className = '',
  speed = 50,
  trigger = 'auto'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const scramble = () => {
    setIsScrambling(true);
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / 3;

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (trigger === 'auto') {
      scramble();
      const interval = setInterval(scramble, 5000);
      return () => clearInterval(interval);
    }
  }, [text, trigger]);

  return (
    <span
      className={`inline-block font-mono ${className}`}
      onMouseEnter={() => trigger === 'hover' && !isScrambling && scramble()}
    >
      {displayText}
    </span>
  );
};