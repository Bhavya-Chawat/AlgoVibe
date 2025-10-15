import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-cyber-blue-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 
              bg-hack-navy/50 backdrop-blur-sm
              border-2 border-cyber-blue-400/20 
              rounded-lg
              text-white
              focus:outline-none focus:border-cyber-blue-400 
              focus:shadow-[0_0_15px_rgba(28,171,242,0.3)]
              transition-all duration-300
              appearance-none cursor-pointer
              ${error ? 'border-alert-red focus:border-alert-red' : ''}
              ${className}
            `}
            {...props}
          >
            <option value="" disabled className="bg-hack-navy text-gray-400">
              Select an option
            </option>
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-hack-navy text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-cyber-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-alert-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';