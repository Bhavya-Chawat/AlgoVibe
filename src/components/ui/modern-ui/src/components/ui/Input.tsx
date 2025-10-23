import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-cyber-blue-400 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            bg-hack-navy/50 backdrop-blur-sm
            border-2 border-cyber-blue-400/20 
            rounded-lg
            text-white placeholder-gray-500
            focus:outline-none focus:border-cyber-blue-400 
            focus:shadow-[0_0_15px_rgba(28,171,242,0.3)]
            transition-all duration-300
            ${error ? 'border-alert-red focus:border-alert-red' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-alert-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';