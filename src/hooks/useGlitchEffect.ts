import { useState, useEffect, useCallback } from 'react';

interface UseGlitchEffectOptions {
  text: string;
  duration?: number;
  glitchInterval?: number;
  characters?: string;
  autoPlay?: boolean;
}

export const useGlitchEffect = ({
  text,
  duration = 300,
  glitchInterval = 3000,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  autoPlay = true
}: UseGlitchEffectOptions) => {
  const [glitchedText, setGlitchedText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const glitch = useCallback(() => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    let iteration = 0;
    const steps = text.length * 3;

    const interval = setInterval(() => {
      setGlitchedText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            const progress = iteration / steps;
            const charProgress = index / text.length;
            
            if (progress > charProgress) {
              return text[index];
            }
            
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration >= steps) {
        clearInterval(interval);
        setGlitchedText(text);
        setIsGlitching(false);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [text, duration, characters, isGlitching]);

  useEffect(() => {
    if (autoPlay) {
      glitch();
      const autoInterval = setInterval(glitch, glitchInterval);
      return () => clearInterval(autoInterval);
    }
  }, [autoPlay, glitch, glitchInterval]);

  return {
    glitchedText,
    isGlitching,
    triggerGlitch: glitch
  };
};