import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'light' | 'medium' | 'heavy';
  border?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  blur = 'medium',
  border = true
}) => {
  const blurStyles = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl'
  };

  return (
    <div
      className={`
        relative 
        ${blurStyles[blur]}
        ${border ? 'border border-cyber-blue-400/20' : ''}
        rounded-2xl
        ${className}
      `}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent rounded-2xl"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue-400/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Border glow */}
      {border && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 20px rgba(28, 171, 242, 0.2)'
          }}
        ></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};