"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, User, Calendar, Award } from "lucide-react";
import { getTeamScores } from "@/app/(evaluator)/evaluator/actions";

interface EvaluationStatusBadgeProps {
  teamId: number;
  problemId: number;
}

export default function EvaluationStatusBadge({
  teamId,
  problemId,
}: EvaluationStatusBadgeProps) {
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluationStatus = async () => {
      if (teamId && problemId) {
        try {
          setLoading(true);
          const result = await getTeamScores(teamId, problemId);

          if (result.success && result.scores) {
            setEvaluationData(result.scores);
          }
        } catch (error) {
          console.error("Error fetching evaluation status:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvaluationStatus();
  }, [teamId, problemId]);

  if (loading) {
    return (
      <div className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 animate-pulse">
        Loading evaluation status...
      </div>
    );
  }

  if (!evaluationData) {
    return (
      <div className="flex items-center gap-2 p-3 bg-warning-orange/10 rounded-lg border border-warning-orange/30">
        <Clock className="w-5 h-5 text-warning-orange" />
        <span className="font-semibold text-warning-orange">
          Not Yet Evaluated
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-green-400/10 rounded-lg border border-green-400/30">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="font-semibold text-green-400">Team Evaluated</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-lg">
          <h4 className="font-bold text-cyber-blue-400 mb-2">
            Evaluator Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">
                Name: {evaluationData.evaluator_name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">
                Evaluated:{" "}
                {evaluationData.evaluated_at
                  ? new Date(evaluationData.evaluated_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <h4 className="font-bold text-cyber-blue-400 mb-2">
            Score Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">
                Visualization Quality (45%):
              </span>
              <span className="font-semibold">
                {evaluationData.visualization_quality_score !== null
                  ? evaluationData.visualization_quality_score
                  : 0}
                /45
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Core Logic (25%):</span>
              <span className="font-semibold">
                {evaluationData.core_logic_efficiency_score !== null
                  ? evaluationData.core_logic_efficiency_score
                  : 0}
                /25
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Web App UX (20%):</span>
              <span className="font-semibold">
                {evaluationData.web_app_ux_score !== null
                  ? evaluationData.web_app_ux_score
                  : 0}
                /20
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Engineering (10%):</span>
              <span className="font-semibold">
                {evaluationData.engineering_repo_score !== null
                  ? evaluationData.engineering_repo_score
                  : 0}
                /10
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-700">
              <span className="text-gray-300 font-bold">Total Score:</span>
              <span className="font-bold text-cyber-blue-400">
                {evaluationData.total_score !== null
                  ? evaluationData.total_score
                  : 0}
                /100
              </span>
            </div>
          </div>
        </div>
      </div>

      {evaluationData.feedback && (
        <div className="glass-panel p-4 rounded-lg">
          <h4 className="font-bold text-cyber-blue-400 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Feedback
          </h4>
          <p className="text-gray-300 text-sm">{evaluationData.feedback}</p>
        </div>
      )}
    </div>
  );
}
