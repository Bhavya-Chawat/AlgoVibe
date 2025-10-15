import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '',
  glitchOnHover = false
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (glitchOnHover) return;

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [glitchOnHover]);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
      onMouseLeave={() => glitchOnHover && setIsGlitching(false)}
    >
      <span className="relative inline-block">
        {text}
        
        {isGlitching && (
          <>
            <span 
              className="absolute top-0 left-0 text-cyber-blue-400 opacity-80"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                transform: 'translateX(-3px)',
                animation: 'glitch-1 0.3s infinite'
              }}
            >
              {text}
            </span>
            
            <span 
              className="absolute top-0 left-0 text-electric-cyan opacity-80"
              style={{
                clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                transform: 'translateX(3px)',
                animation: 'glitch-2 0.3s infinite'
              }}
            >
              {text}
            </span>
          </>
        )}
      </span>

      <style>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translateX(-3px); }
          25% { transform: translateX(3px); }
          50% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translateX(3px); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>
    </div>
  );
};