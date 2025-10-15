import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group';
  
  const variantStyles = {
    primary: 'bg-cyber-blue-400 hover:bg-cyber-blue-500 text-hack-black border-2 border-cyber-blue-400 hover:shadow-[0_0_20px_rgba(28,171,242,0.6)]',
    secondary: 'bg-transparent border-2 border-cyber-blue-400 text-cyber-blue-400 hover:bg-cyber-blue-400/10 hover:shadow-[0_0_20px_rgba(28,171,242,0.4)]',
    ghost: 'bg-transparent text-cyber-blue-400 hover:bg-cyber-blue-400/5'
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-cyber-blue-400 via-neon-blue to-electric-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
    </button>
  );
};