'use client';

import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
  const handleScroll = () => {
    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <button
        onClick={handleScroll}
        className="group flex flex-col items-center gap-2 animate-bounce hover:scale-110 transition-transform duration-300"
        aria-label="Scroll to timeline"
      >
        {/* Text */}
        <span className="text-sm font-semibold text-gray-400 group-hover:text-cyber-blue-400 transition-colors">
          Scroll to Explore
        </span>

        {/* Animated Arrow Container */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-cyber-blue-400/20 blur-xl rounded-full group-hover:bg-cyber-blue-400/40 transition-all"></div>

          {/* Arrow Icon */}
          <div className="relative w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:glass-panel-strong transition-all">
            <ChevronDown className="w-5 h-5 text-cyber-blue-400 group-hover:text-neon-blue transition-colors" />
          </div>

          {/* Animated Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-1 opacity-50">
            <div className="w-1 h-1 bg-cyber-blue-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-cyber-blue-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-cyber-blue-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </button>

      {/* CSS for delay classes */}
      <style jsx>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}