"use client";

import { useState, useEffect } from "react";
import { Code2, Trophy, Clock, AlertCircle, Check } from "lucide-react";
import { ElectricBorder } from "@/components/effects/react-effects-lib/src/components/effects/ElectricBorder";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";
import CompactTimer from "@/components/contest/CompactTimer";

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
  const [glitchText, setGlitchText] = useState("Algorithm Challenge");

  useEffect(() => {
    // Implement glitch effect similar to login page
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*(){}[]<>?/~`";
      const original = "Algorithm Challenge";
      const glitched = original
        .split("")
        .map((char) => {
          if (Math.random() > 0.90 && char !== " ") {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        })
        .join("");

      setGlitchText(glitched);
      setTimeout(() => setGlitchText(original), 30);
    }, 1500);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const response = await fetch("/api/contest/problem");
      const data = await response.json();
      setProblem(data);
      // Update glitch text with actual problem title
      setGlitchText(data.title);
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
        className="glass-panel-strong p-12 rounded-3xl border-2 border-cyber-blue-400/40"
        style={{
          boxShadow: "0 0 60px rgba(28, 171, 242, 0.5)",
        }}
      >
        {/* Compact Timer at the top */}
        <div className="mb-8">
          <CompactTimer status="live" duration={120} />
        </div>

        {/* Header with glowing title */}
        <div className="mb-10 pb-10 border-b border-cyber-blue-400/30">
          <div className="flex items-start justify-between gap-8 mb-8">
            <h1 className="text-5xl font-bold text-gradient flex-1">
              {glitchText}
            </h1>
            <Code2 className="w-12 h-12 text-cyber-blue-400 flex-shrink-0" />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 text-lg text-gray-300">
              <Trophy className="w-8 h-8 text-warning-orange" />
              <span className="font-bold text-warning-orange text-2xl">{problem.points} Points</span>
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
          <p className="text-gray-300 text-xl leading-relaxed">
            {problem.description || "Build an innovative solution that demonstrates algorithmic thinking and problem-solving skills. Your submission should include clean code, proper documentation, and a live deployment showcasing your work."}
          </p>
        </div>

        {/* Requirements */}
        <div className="mb-10 glass-panel p-8 rounded-2xl border-2 border-cyber-blue-400/20">
          <h3 className="text-2xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
            <AlertCircle className="w-8 h-8" />
            Submission Requirements
          </h3>
          <ul className="space-y-4 text-gray-300 text-xl">
            <li className="flex items-start gap-4">
              <Check className="w-8 h-8 text-matrix-green mt-1" />
              <span>Code submission with valid solution link</span>
            </li>
            <li className="flex items-start gap-4">
              <Check className="w-8 h-8 text-matrix-green mt-1" />
              <span>GitHub repository with clean, documented code</span>
            </li>
            <li className="flex items-start gap-4">
              <Check className="w-8 h-8 text-matrix-green mt-1" />
              <span>Live deployment URL (Vercel, Netlify, etc.)</span>
            </li>
          </ul>
        </div>

        {/* Sample Test Cases */}
        {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
              <div className="w-3 h-12 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
              Sample Test Cases
            </h3>
            <div className="space-y-6">
              {problem.sampleTestCases.map((testCase: any, index: number) => (
                <div key={index} className="glass-panel p-8 rounded-2xl border-2 border-cyber-blue-400/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-lg text-gray-400 mb-4">Input:</p>
                      <code className="text-xl text-matrix-green font-mono bg-hack-navy/50 p-6 rounded-xl block">
                        {testCase.input}
                      </code>
                    </div>
                    <div>
                      <p className="text-lg text-gray-400 mb-4">Output:</p>
                      <code className="text-xl text-neon-blue font-mono bg-hack-navy/50 p-6 rounded-xl block">
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
            <h3 className="text-2xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
              <div className="w-3 h-12 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
              Constraints
            </h3>
            <ul className="space-y-4 text-gray-400 text-xl font-mono">
              {problem.constraints.map((constraint: string, index: number) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="text-cyber-blue-400 text-2xl">•</span>
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
            background: "radial-gradient(circle at center, rgba(28, 171, 242, 0.2), transparent 70%)",
          }}
        />
      </motion.div>
    </ElectricBorder>
  );
}