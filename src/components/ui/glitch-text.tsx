"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="relative z-10 text-gradient">{text}</span>
      <span className="absolute left-[2px] top-0 w-full h-full text-matrix-green opacity-50 glitch-1">
        {text}
      </span>
      <span className="absolute left-[-2px] top-0 w-full h-full text-cyber-blue-400 opacity-50 glitch-2">
        {text}
      </span>
      <style jsx>{`
        @keyframes glitch-1 {
          0% { clip-path: inset(20% 0 30% 0); }
          20% { clip-path: inset(60% 0 1% 0); }
          40% { clip-path: inset(25% 0 58% 0); }
          60% { clip-path: inset(90% 0 1% 0); }
          80% { clip-path: inset(1% 0 58% 0); }
          100% { clip-path: inset(40% 0 40% 0); }
        }
        @keyframes glitch-2 {
          0% { clip-path: inset(40% 0 40% 0); }
          20% { clip-path: inset(33% 0 33% 0); }
          40% { clip-path: inset(66% 0 66% 0); }
          60% { clip-path: inset(22% 0 22% 0); }
          80% { clip-path: inset(88% 0 88% 0); }
          100% { clip-path: inset(20% 0 20% 0); }
        }
        .glitch-1 {
          animation: glitch-1 0.9s infinite linear alternate-reverse;
        }
        .glitch-2 {
          animation: glitch-2 1.1s infinite linear alternate-reverse;
        }
      `}</style>
    </motion.div>
  );
}