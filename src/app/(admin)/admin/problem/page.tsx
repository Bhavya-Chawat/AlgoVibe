"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProblemEditor from "@/components/admin/ProblemEditor";
import { FileText, Zap } from "lucide-react";
import { getTeams, getProblems, createProblem, updateProblem, assignProblemToTeam } from "../actions";

export default function AdminProblemPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamsAndProblems();
  }, []);

  const fetchTeamsAndProblems = async () => {
    try {
      setIsLoading(true);
      
      // Fetch teams
      const teamsResult = await getTeams();
      if (teamsResult.success && teamsResult.data) {
        setTeams(teamsResult.data);
      } else {
        console.error("Failed to fetch teams:", teamsResult.error);
      }
      
      // Fetch problems
      const problemsResult = await getProblems();
      if (problemsResult.success && problemsResult.data) {
        setProblems(problemsResult.data);
      } else {
        console.error("Failed to fetch problems:", problemsResult.error);
      }
    } catch (error) {
      console.error("Failed to fetch teams and problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-cyber-blue-400/10 rounded-xl">
            <FileText className="w-8 h-8 text-cyber-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">
              Problem Statement Editor
            </h1>
            <p className="text-gray-400 mt-1">
              Create and manage custom problem statements for each team
            </p>
          </div>
        </div>

        {/* Quick Info Banner */}
        <div className="glass-panel p-4 rounded-xl border border-neon-blue/20 bg-neon-blue/5">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-neon-blue mb-1">Team-Based Problems</p>
              <p className="text-xs">
                Each team can be assigned a unique problem statement. Select a team from the dropdown,
                write the problem description, and save to assign it. Teams will see their specific
                problem during the contest.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problem Editor Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProblemEditor 
          teams={teams} 
          problems={problems} 
          isLoading={isLoading}
          onCreateProblem={createProblem}
          onUpdateProblem={updateProblem}
          onAssignProblem={assignProblemToTeam}
        />
      </motion.div>
    </div>
  );
}