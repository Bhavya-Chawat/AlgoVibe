"use client";

import { motion } from "framer-motion";
import ProblemViewer from "@/components/evaluator/ProblemViewer";
import SubmissionReview from "@/components/evaluator/SubmissionReview";
import { FileText, Code, Eye, Users } from "lucide-react";
import { useState } from "react";

interface Team {
  id: string;
  name: string;
  leader: string;
  members: number;
}

export default function EvaluatorProblemPage() {
  // Mock teams data - replace with actual API call
  const teams: Team[] = [
    { id: "1", name: "CodeNinjas", leader: "John Doe", members: 3 },
    { id: "2", name: "AlgoMasters", leader: "Jane Smith", members: 4 },
    { id: "3", name: "ByteBreakers", leader: "Mike Johnson", members: 3 },
    { id: "4", name: "DevDynamos", leader: "Sarah Williams", members: 4 },
    { id: "5", name: "CodeCrafters", leader: "Alex Brown", members: 3 }
  ];

  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const selectedTeamData = teams.find(t => t.id === selectedTeam);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyber-blue-400/10 rounded-xl">
            <Eye className="w-8 h-8 text-cyber-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">
              Evaluator Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Review team submissions and assigned problems
            </p>
          </div>
        </div>

        {/* Team Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyber-blue-400" />
            Select Team
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Choose a team to review their problem and submissions
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-4 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 appearance-none cursor-pointer bg-transparent"
            >
              <option value="" className="bg-hack-navy text-gray-400">
                -- Select a Team --
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id} className="bg-hack-navy text-gray-200">
                  {team.name} - Led by {team.leader} ({team.members} members)
                </option>
              ))}
            </select>

            {selectedTeamData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 glass-panel rounded-lg border border-neon-blue/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-200">{selectedTeamData.name}</p>
                    <p className="text-sm text-gray-400">
                      Team Leader: {selectedTeamData.leader}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                    <span className="text-xs font-semibold text-neon-blue">
                      {selectedTeamData.members} Members
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Content - Only show when a team is selected */}
      {selectedTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Problem Statement */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Assigned Problem Statement
            </h2>
            <ProblemViewer selectedTeam={selectedTeam} />
          </div>

          {/* Submissions */}
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Team Submissions
            </h2>
            <SubmissionReview selectedTeam={selectedTeam} />
          </div>
        </motion.div>
      )}
    </div>
  );
}