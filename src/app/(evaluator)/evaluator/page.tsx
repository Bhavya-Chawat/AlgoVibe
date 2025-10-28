"use client";

import { motion } from "framer-motion";
import ProblemViewer from "@/components/evaluator/ProblemViewer";
import SubmissionReview from "@/components/evaluator/SubmissionReview";
import EvaluationStatusBadge from "@/components/evaluator/EvaluationStatusBadge";
import {
  FileText,
  Code,
  Eye,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAllTeams, getTeamProblem } from "./actions";

interface Team {
  team_id: number;
  team_name: string;
  leader: string;
  member_count: number;
}

export default function EvaluatorProblemPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const result = await getAllTeams();

        if (result.success && result.teams) {
          setTeams(result.teams);
        } else {
          setError(result.error || "Failed to fetch teams");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Fetch problem ID when team is selected
  useEffect(() => {
    const fetchProblemId = async () => {
      if (selectedTeam) {
        try {
          const teamId = parseInt(selectedTeam.toString(), 10);
          const result = await getTeamProblem(teamId);

          if (result.success && result.problem) {
            // Handle the case where result.problem might be an array
            const problem = Array.isArray(result.problem)
              ? result.problem[0] || null
              : result.problem;

            if (problem && problem.problem_id) {
              setProblemId(problem.problem_id);
            } else {
              setProblemId(null);
            }
          } else {
            setProblemId(null);
          }
        } catch (err) {
          console.error("Error fetching problem ID:", err);
          setProblemId(null);
        }
      } else {
        setProblemId(null);
      }
    };

    fetchProblemId();
  }, [selectedTeam]);

  const selectedTeamData = teams.find((t) => t.team_id === selectedTeam);

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

            {loading ? (
              <div className="w-full px-4 py-4 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 animate-pulse">
                Loading teams...
              </div>
            ) : error ? (
              <div className="w-full px-4 py-4 glass-panel border border-alert-red/30 rounded-xl text-alert-red">
                Error: {error}
              </div>
            ) : (
              <select
                value={selectedTeam}
                onChange={(e) =>
                  setSelectedTeam(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full px-4 py-4 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 appearance-none cursor-pointer bg-transparent"
              >
                <option value="" className="bg-hack-navy text-gray-400">
                  -- Select a Team -- ({teams.length} teams available)
                </option>
                {teams.map((team) => (
                  <option
                    key={team.team_id}
                    value={team.team_id}
                    className="bg-hack-navy text-gray-200"
                  >
                    {team.team_name} - Led by {team.leader} ({team.member_count}{" "}
                    members)
                  </option>
                ))}
              </select>
            )}

            {selectedTeamData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 glass-panel rounded-lg border border-neon-blue/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-200">
                      {selectedTeamData.team_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      Team Leader: {selectedTeamData.leader}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                    <span className="text-xs font-semibold text-neon-blue">
                      {selectedTeamData.member_count} Members
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
          {/* Evaluation Status Badge - Shown above Problem Statement */}
          {problemId && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gradient mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Evaluation Status
              </h2>
              <EvaluationStatusBadge
                teamId={parseInt(selectedTeam.toString(), 10)}
                problemId={problemId}
              />
            </div>
          )}

          {/* Problem Statement */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Assigned Problem Statement
            </h2>
            <ProblemViewer selectedTeam={selectedTeam.toString()} />
          </div>

          {/* Submissions */}
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Team Submissions
            </h2>
            <SubmissionReview selectedTeam={selectedTeam.toString()} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
