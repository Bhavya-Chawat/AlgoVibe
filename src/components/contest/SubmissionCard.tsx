import React from 'react';
import { motion } from 'framer-motion';

interface SubmissionCardProps {
  title: string;
  icon: React.ReactNode;
  timer?: string;
  color: string;
  children: React.ReactNode;
  glowEffect?: boolean;
}

export default function SubmissionCard({
  title,
  icon,
  timer,
  color = 'cyber-blue-400',
  children,
  glowEffect = false
}: SubmissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        ${glowEffect ? 'cyber-glow-strong animate-pulse-glow' : ''}
        transition-all duration-300
        hover:bg-white/10 hover:border-${color}/30
      `}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan-line" />
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-${color}/10 border border-${color}/20`}>
              {icon}
            </div>
            <h3 className="text-2xl font-bold text-gradient">
              {title}
            </h3>
          </div>
          
          {timer && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning-orange/10 border border-warning-orange/20"
            >
              <div className="w-2 h-2 bg-warning-orange rounded-full animate-pulse" />
              <span className="text-lg font-bold text-warning-orange">
                {timer}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {children}
      </div>

      {/* Bottom glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${color}/50 to-transparent`} />
    </motion.div>
  );
}

// Custom CSS for animations (add to globals.css)
/*
@keyframes scan-line {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.animate-scan-line {
  animation: scan-line 3s linear infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(28, 171, 242, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(28, 171, 242, 0.6), 0 0 60px rgba(28, 171, 242, 0.3);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.cyber-glow-strong {
  box-shadow: 0 0 30px rgba(28, 171, 242, 0.4), 0 0 60px rgba(28, 171, 242, 0.2);
}

.text-gradient {
  background: linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
*/