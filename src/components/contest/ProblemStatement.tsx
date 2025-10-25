"use client";

import { useState, useEffect } from "react";
import { Code2, Trophy, Clock, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import CompactTimer from "@/components/contest/CompactTimer";

interface Problem {
  problem_id: number;
  title: string;
  description: string;
}

interface ProblemStatementProps {
  problem: Problem;
}

export default function ProblemStatement({ problem }: ProblemStatementProps) {
  const [glitchText, setGlitchText] = useState(problem.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel-strong p-12 rounded-3xl border-2 border-cyber-blue-400/40 relative overflow-hidden"
      style={{
        boxShadow: "0 0 60px rgba(28, 171, 242, 0.5)",
      }}
    >
      {/* Compact Timer at the top */}
      <div className="mb-8">
        <CompactTimer
          status="live"
          startTimeISO={new Date(Date.now() - 2 * 60 * 1000).toISOString()}
          endTimeISO={new Date(Date.now() + 88 * 60 * 1000).toISOString()}
        />{" "}
      </div>

      {/* Header with glowing title */}
      <div className="mb-10 pb-10 border-b border-cyber-blue-400/30">
        <div className="flex items-start justify-between gap-8 mb-8">
          <h1 className="text-5xl font-bold text-gradient flex-1">
            {problem.title}
          </h1>
          <Code2 className="w-12 h-12 text-cyber-blue-400 flex-shrink-0" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 text-lg text-gray-300">
            <Trophy className="w-8 h-8 text-warning-orange" />
            <span className="font-bold text-warning-orange text-2xl">
              100 Points
            </span>
          </div>

          <div className="flex items-center gap-4 text-lg text-gray-400">
            <Clock className="w-8 h-8" />
            <span className="text-2xl">90 minutes</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10">
        <h3 className="text-3xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
          <div className="w-3 h-12 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
          Problem Description
        </h3>
        <div className="text-gray-300 text-xl leading-relaxed whitespace-pre-wrap">
          {problem.description}
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-10 glass-panel p-8 rounded-2xl border-2 border-cyber-blue-400/20">
        <h3 className="text-2xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8" />
          Submission Requirements
        </h3>
        <ul className="space-y-4 text-gray-300 text-xl">
          <li className="flex items-start gap-4">
            <Check className="w-8 h-8 text-matrix-green mt-1 flex-shrink-0" />
            <span>Code submission with your solution</span>
          </li>
          <li className="flex items-start gap-4">
            <Check className="w-8 h-8 text-matrix-green mt-1 flex-shrink-0" />
            <span>GitHub repository with clean, documented code</span>
          </li>
          <li className="flex items-start gap-4">
            <Check className="w-8 h-8 text-matrix-green mt-1 flex-shrink-0" />
            <span>
              Live deployment URL (Vercel, Netlify, GitHub Pages, etc.)
            </span>
          </li>
        </ul>
      </div>

      {/* Evaluation Criteria */}
      <div className="mb-10 glass-panel p-8 rounded-2xl border-2 border-warning-orange/20">
        <h3 className="text-2xl font-bold text-warning-orange mb-6 flex items-center gap-4">
          <Trophy className="w-8 h-8" />
          Evaluation Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Code Quality</span>
              <span className="text-cyber-blue-400 font-mono">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Functionality</span>
              <span className="text-cyber-blue-400 font-mono">30%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Documentation</span>
              <span className="text-cyber-blue-400 font-mono">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Deployment</span>
              <span className="text-cyber-blue-400 font-mono">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="glass-panel p-8 rounded-2xl border-2 border-alert-red/20 bg-alert-red/5">
        <h3 className="text-2xl font-bold text-alert-red mb-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8" />
          Important Notes
        </h3>
        <ul className="space-y-4 text-gray-300 text-lg">
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>
              You can submit multiple times. Only your latest submission will be
              evaluated.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>
              Ensure your deployment is publicly accessible for evaluation.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>
              Include a README.md with setup instructions in your GitHub
              repository.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>All submissions must be made before the timer expires.</span>
          </li>
        </ul>
      </div>

      {/* Animated glow pulse effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-3xl pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(28, 171, 242, 0.2), transparent 70%)",
        }}
      />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyber-blue-400/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-neon-blue/20 to-transparent rounded-tr-full pointer-events-none" />
    </motion.div>
  );
}
