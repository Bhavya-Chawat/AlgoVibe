"use client";

import { useState, useEffect } from "react";
import { FileText, Users, Eye, Download, Code, Trophy, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Team {
  id: string;
  name: string;
  leader: string;
  members: number;
}

interface ProblemStatement {
  title: string;
  description: string;
  constraints: string[];
  sampleTestCases: Array<{ input: string; output: string }>;
  difficulty: string;
  points: number;
  timeLimit: string;
}

interface ProblemViewerProps {
  selectedTeam?: string;
}

export default function ProblemViewer({ selectedTeam }: ProblemViewerProps) {
  // Mock teams data - replace with actual API call
  const teams: Team[] = [
    { id: "1", name: "CodeNinjas", leader: "John Doe", members: 3 },
    { id: "2", name: "AlgoMasters", leader: "Jane Smith", members: 4 },
    { id: "3", name: "ByteBreakers", leader: "Mike Johnson", members: 3 },
    { id: "4", name: "DevDynamos", leader: "Sarah Williams", members: 4 },
    { id: "5", name: "CodeCrafters", leader: "Alex Brown", members: 3 }
  ];

  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTeamData = teams.find(t => t.id === selectedTeam);

  useEffect(() => {
    if (selectedTeam) {
      // Simulate fetching problem statement for the selected team
      setIsLoading(true);
      setTimeout(() => {
        // Mock problem data - in a real app, this would come from an API
        setProblem({
          title: "Maximum Subarray Sum",
          description: "Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
          constraints: [
            "1 ≤ n ≤ 10^5",
            "-10^4 ≤ arr[i] ≤ 10^4"
          ],
          sampleTestCases: [
            {
              input: "5\n-2 1 -3 4 -1",
              output: "4"
            },
            {
              input: "1\n1",
              output: "1"
            }
          ],
          difficulty: "Medium",
          points: 100,
          timeLimit: "2 seconds"
        });
        setIsLoading(false);
      }, 800);
    } else {
      setProblem(null);
    }
  }, [selectedTeam]);

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

  // If no team is selected, don't show anything
  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Problem Statement Display */}
      {isLoading ? (
        <div className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/30 animate-pulse">
          <div className="h-8 bg-cyber-blue-400/20 rounded mb-4" />
          <div className="h-4 bg-cyber-blue-400/20 rounded mb-2" />
          <div className="h-4 bg-cyber-blue-400/20 rounded mb-2" />
          <div className="h-4 bg-cyber-blue-400/20 rounded w-2/3" />
        </div>
      ) : problem ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/20"
        >
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-cyber-blue-400/20">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gradient">{problem.title}</h2>
              <FileText className="w-8 h-8 text-cyber-blue-400 flex-shrink-0" />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-warning-orange" />
                <span className="font-bold text-warning-orange">{problem.points} Points</span>
              </div>

              <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>{problem.timeLimit}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-cyber-blue-400 mb-4">Problem Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Constraints */}
          {problem.constraints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-cyber-blue-400 mb-4">Constraints</h3>
              <ul className="space-y-2 text-gray-300">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyber-blue-400">•</span>
                    <span className="font-mono">{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Test Cases */}
          {problem.sampleTestCases.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-cyber-blue-400 mb-4">Sample Test Cases</h3>
              <div className="space-y-6">
                {problem.sampleTestCases.map((testCase, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                      <p className="text-sm text-gray-400 mb-2">Input:</p>
                      <code className="text-matrix-green font-mono whitespace-pre-wrap">
                        {testCase.input}
                      </code>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                      <p className="text-sm text-gray-400 mb-2">Output:</p>
                      <code className="text-neon-blue font-mono whitespace-pre-wrap">
                        {testCase.output}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/20 text-center">
          <FileText className="w-12 h-12 text-cyber-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-200 mb-2">No Problem Assigned</h3>
          <p className="text-gray-400">
            This team doesn't have a problem assigned yet.
          </p>
        </div>
      )}
    </div>
  );
}