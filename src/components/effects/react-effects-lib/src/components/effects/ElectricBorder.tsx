import React, { useRef, useEffect } from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  animationDuration?: string; // New prop for customizing animation duration
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ 
  children, 
  className = '',
  speed = 2,
  animationDuration = '2s' // Default value
}) => {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = borderRef.current;
    if (!element) return;

    let animationFrame: number;
    let progress = 0;

    const animate = () => {
      progress += 0.01 * speed;
      
      const offset = Math.sin(progress) * 50;
      element.style.setProperty('--electric-offset', `${offset}px`);
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [speed]);

  return (
    <div
      ref={borderRef}
      className={`relative group ${className}`}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(28, 171, 242, 0.4) 25%, 
              rgba(0, 217, 255, 0.6) 50%, 
              rgba(28, 171, 242, 0.4) 75%, 
              transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: `electric-flow ${animationDuration} linear infinite`
          }}
        />
      </div>
      
      <div className="relative z-10 border-2 border-cyber-blue-400/30 rounded-lg group-hover:border-cyber-blue-400/60 transition-colors duration-700">
        {children}
      </div>

      <style>{`
        @keyframes electric-flow {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};