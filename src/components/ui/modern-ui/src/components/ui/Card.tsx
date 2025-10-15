import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  glow = false 
}) => {
  return (
    <div
      className={`
        relative bg-hack-navy/50 backdrop-blur-md 
        border border-cyber-blue-400/20 rounded-xl p-6
        transition-all duration-300 hover:border-cyber-blue-400/50
        ${glow ? 'hover:shadow-[0_0_30px_rgba(28,171,242,0.3)]' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue-400/5 to-transparent rounded-xl pointer-events-none"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return <h3 className={`text-2xl font-bold text-cyber-blue-400 ${className}`}>{children}</h3>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`text-gray-300 ${className}`}>{children}</div>;
};