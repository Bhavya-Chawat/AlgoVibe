"use client";

import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  const handleScroll = () => {
    document
      .getElementById("timeline")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
      <button
        onClick={handleScroll}
        aria-label="Scroll to timeline"
        className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/60 rounded-full"
      >
        {/* Label */}
        <span className="text-sm font-semibold text-gray-400 transition-colors group-hover:text-cyber-blue-400">
          Scroll to Explore
        </span>

        {/* Indicator */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-cyber-blue-400/20 blur-xl rounded-full transition-all group-hover:bg-cyber-blue-400/40" />

          {/* Circle + Chevron */}
          <div className="relative w-11 h-11 rounded-full glass-panel flex items-center justify-center transition-all group-hover:glass-panel-strong animate-float">
            {/* Main chevron */}
            <ChevronDown
              className="w-5 h-5 text-cyber-blue-400 transition-colors group-hover:text-neon-blue"
              aria-hidden
            />
            {/* Ghost trail chevron */}
            <ChevronDown
              className="w-5 h-5 absolute text-cyber-blue-400/45 translate-y-2 animate-chev-ghost"
              aria-hidden
            />
          </div>
        </div>
      </button>

      {/* Scoped animations with reduced-motion support */}
      <style jsx>{`
        @keyframes floatY {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes chevGhost {
          0% {
            opacity: 0;
            transform: translateY(-4px);
          }
          50% {
            opacity: 0.6;
            transform: translateY(4px);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }
        .animate-float {
          animation: floatY 2.2s ease-in-out infinite;
        }
        .animate-chev-ghost {
          animation: chevGhost 2.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-chev-ghost {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
