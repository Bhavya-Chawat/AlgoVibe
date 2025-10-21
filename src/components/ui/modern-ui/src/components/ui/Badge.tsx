import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-cyber-blue-400/20 text-cyber-blue-400',
    success: 'bg-matrix-green/20 text-matrix-green',
    warning: 'bg-warning-orange/20 text-warning-orange',
    error: 'bg-alert-red/20 text-alert-red'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};