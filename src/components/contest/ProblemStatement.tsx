"use client";

import { useState, useEffect } from "react";
import { Code2, Trophy, Clock, AlertCircle, Check } from "lucide-react";
import { GlitchText } from "@/components/effects/react-effects-lib/src/components/effects/GlitchText";
import { ElectricBorder } from "@/components/effects/react-effects-lib/src/components/effects/ElectricBorder";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";

export default function ProblemStatement() {
  const [problem, setProblem] = useState({
    title: "Algorithm Challenge",
    difficulty: "Medium",
    points: 100,
    description: "",
    constraints: [],
    sampleTestCases: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const response = await fetch("/api/contest/problem");
      const data = await response.json();
      setProblem(data);
    } catch (error) {
      console.error("Failed to fetch problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-matrix-green/20 text-matrix-green border-matrix-green/50";
      case "medium":
        return "bg-warning-orange/20 text-warning-orange border-warning-orange/50";
      case "hard":
        return "bg-alert-red/20 text-alert-red border-alert-red/50";
      default:
        return "bg-cyber-blue-400/20 text-cyber-blue-400 border-cyber-blue-400/50";
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/30 animate-pulse">
        <div className="h-8 bg-cyber-blue-400/20 rounded mb-4" />
        <div className="h-4 bg-cyber-blue-400/20 rounded mb-2" />
        <div className="h-4 bg-cyber-blue-400/20 rounded mb-2" />
        <div className="h-4 bg-cyber-blue-400/20 rounded w-2/3" />
      </div>
    );
  }

  return (
    <ElectricBorder>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel-strong p-10 rounded-3xl border-2 border-cyber-blue-400/40 sticky top-32 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar"
        style={{
          boxShadow: "0 0 50px rgba(28, 171, 242, 0.4)",
        }}
      >
        {/* Header with glowing title */}
        <div className="mb-8 pb-8 border-b border-cyber-blue-400/30">
          <div className="flex items-start justify-between gap-6 mb-6">
            <h1 className="text-4xl font-bold text-gradient flex-1">
              <GlitchText text={problem.title} />
            </h1>
            <Code2 className="w-10 h-10 text-cyber-blue-400 flex-shrink-0" />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4">
            <Badge className={`px-4 py-2 text-lg font-bold border-2 ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </Badge>
            
            <div className="flex items-center gap-3 text-base text-gray-300">
              <Trophy className="w-5 h-5 text-warning-orange" />
              <span className="font-bold text-warning-orange text-lg">{problem.points} Points</span>
            </div>
            
            <div className="flex items-center gap-3 text-base text-gray-400">
              <Clock className="w-5 h-5" />
              <span className="text-lg">90 minutes</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-cyber-blue-400 mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
            Problem Description
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            {problem.description || "Build an innovative solution that demonstrates algorithmic thinking and problem-solving skills. Your submission should include clean code, proper documentation, and a live deployment showcasing your work."}
          </p>
        </div>

        {/* Requirements */}
        <div className="mb-8 glass-panel p-6 rounded-2xl border-2 border-cyber-blue-400/20">
          <h3 className="text-xl font-bold text-cyber-blue-400 mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            Submission Requirements
          </h3>
          <ul className="space-y-3 text-gray-300 text-base">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-matrix-green mt-1" />
              <span>Code submission with valid solution link</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-matrix-green mt-1" />
              <span>GitHub repository with clean, documented code</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-matrix-green mt-1" />
              <span>Live deployment URL (Vercel, Netlify, etc.)</span>
            </li>
          </ul>
        </div>

        {/* Sample Test Cases */}
        {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-cyber-blue-400 mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
              Sample Test Cases
            </h3>
            <div className="space-y-4">
              {problem.sampleTestCases.map((testCase: any, index: number) => (
                <div key={index} className="glass-panel p-5 rounded-xl border-2 border-cyber-blue-400/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-sm text-gray-400 mb-3">Input:</p>
                      <code className="text-base text-matrix-green font-mono bg-hack-navy/50 p-3 rounded-lg block">
                        {testCase.input}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-3">Output:</p>
                      <code className="text-base text-neon-blue font-mono bg-hack-navy/50 p-3 rounded-lg block">
                        {testCase.output}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-cyber-blue-400 mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
              Constraints
            </h3>
            <ul className="space-y-3 text-gray-400 text-base font-mono">
              {problem.constraints.map((constraint: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-cyber-blue-400 text-lg">•</span>
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Glow pulse effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(28, 171, 242, 0.15), transparent 70%)",
          }}
        />
      </motion.div>
    </ElectricBorder>
  );
}