import React from 'react';

interface ConcentricRingsProps {
  className?: string;
  count?: number;
}

export const ConcentricRings: React.FC<ConcentricRingsProps> = ({ 
  className = '', 
  count = 5 
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const size = (i + 1) * 200;
        const delay = i * 0.3;
        const duration = 3 + i * 0.5;
        
        return (
          <div
            key={i}
            className="absolute rounded-full border border-cyber-blue-400/20"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animation: `pulse-ring ${duration}s ease-in-out ${delay}s infinite`
            }}
          />
        );
      })}
      
      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};