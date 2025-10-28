"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Github,
  Globe,
  Play,
  MessageSquare,
  ExternalLink,
  Award,
  AlertCircle,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";
import {
  getTeamSubmissions,
  assignScoreToTeamSubmissions,
} from "@/app/(evaluator)/evaluator/actions";

interface SubmissionMember {
  name: string;
  usn: string;
}

interface Submission {
  submission_id: number;
  team_id: number;
  problem_id: number;
  submission: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  score?: number;
  feedback?: string;
  submitted_at: string;
  submission_type: "code" | "github" | "deployment";
  member?: SubmissionMember[] | null;
}

interface SubmissionReviewProps {
  selectedTeam?: string;
}

export default function SubmissionReview({
  selectedTeam,
}: SubmissionReviewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [marks, setMarks] = useState({ score: 0, review: "" });
  const [codeModal, setCodeModal] = useState<{
    isOpen: boolean;
    code: string;
    team: string;
  }>({ isOpen: false, code: "", team: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<number | null>(null);

  // Load submissions for the selected team
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (selectedTeam) {
        try {
          setIsLoading(true);
          setError(null);

          const teamId = parseInt(selectedTeam, 10);
          const result = await getTeamSubmissions(teamId);

          if (result.success) {
            // Transform the data to handle member array properly
            const transformedSubmissions = (result.submissions || []).map(
              (sub: any) => ({
                ...sub,
                member: Array.isArray(sub.member)
                  ? sub.member
                  : sub.member
                  ? [sub.member]
                  : [],
              })
            );

            setSubmissions(transformedSubmissions);
            // Set the problem ID from the first submission if available
            if (transformedSubmissions.length > 0) {
              setProblemId(transformedSubmissions[0].problem_id);
            }
          } else {
            setError(result.error || "Failed to fetch submissions");
          }
        } catch (err) {
          setError("An unexpected error occurred");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSubmissions([]);
        setProblemId(null);
      }
    };

    fetchSubmissions();
  }, [selectedTeam]);

  const getIcon = (type: Submission["submission_type"]) => {
    switch (type) {
      case "code":
        return <Code className="w-5 h-5 text-cyber-blue-400" />;
      case "github":
        return <Github className="w-5 h-5 text-electric-cyan" />;
      case "deployment":
        return <Globe className="w-5 h-5 text-neon-blue" />;
      default:
        return <Code className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusConfig = (status: Submission["status"]) => {
    const configs: Record<string, { color: string; icon: any; label: string }> =
      {
        ACCEPTED: {
          color: "bg-matrix-green/20 text-matrix-green border-matrix-green/50",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Accepted",
        },
        REJECTED: {
          color: "bg-alert-red/20 text-alert-red border-alert-red/50",
          icon: <XCircle className="w-4 h-4" />,
          label: "Rejected",
        },
        PENDING: {
          color:
            "bg-warning-orange/20 text-warning-orange border-warning-orange/50",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending",
        },
      };

    return configs[status] || configs.PENDING;
  };

  const getTypeLabel = (type: Submission["submission_type"]) => {
    switch (type) {
      case "code":
        return "Code Submission";
      case "github":
        return "GitHub Link";
      case "deployment":
        return "Deployment";
      default:
        return "Submission";
    }
  };

  const handleSubmissionClick = (submission: Submission) => {
    if (
      submission.submission_type === "github" ||
      submission.submission_type === "deployment"
    ) {
      // Open GitHub or deployment link in new tab
      if (submission.submission) {
        window.open(submission.submission, "_blank");
      }
    } else if (submission.submission_type === "code") {
      // Show code in modal
      setCodeModal({
        isOpen: true,
        code: submission.submission || "// No code submitted",
        team: `Team ${selectedTeam}`,
      });
    }
  };

  const handleCloseCodeModal = () => {
    setCodeModal({ isOpen: false, code: "", team: "" });
  };

  const handleAssignMarks = () => {
    setShowMarksModal(true);
  };

  const handleCloseMarksModal = () => {
    setShowMarksModal(false);
    setMarks({ score: 0, review: "" });
  };

  const handleSaveMarks = async () => {
    if (!selectedTeam || !problemId) {
      alert("Team or problem not selected");
      return;
    }

    try {
      const teamId = parseInt(selectedTeam, 10);
      const result = await assignScoreToTeamSubmissions(
        teamId,
        problemId,
        marks.score,
        marks.review
      );

      if (result.success) {
        // Refresh submissions to show updated scores
        const refreshResult = await getTeamSubmissions(teamId);
        if (refreshResult.success) {
          // Transform the data to handle member array properly
          const transformedSubmissions = (refreshResult.submissions || []).map(
            (sub: any) => ({
              ...sub,
              member: Array.isArray(sub.member)
                ? sub.member
                : sub.member
                ? [sub.member]
                : [],
            })
          );

          setSubmissions(transformedSubmissions);
        }
        handleCloseMarksModal();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error assigning marks:", err);
      alert("An unexpected error occurred while assigning marks");
    }
  };

  const getTimeAgo = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(codeModal.code);
  };

  // If no team is selected, don't show anything
  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 glass-panel rounded-xl border border-cyber-blue-400/10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-blue-400 mx-auto mb-3"></div>
          <p className="text-gray-400">Loading submissions...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 glass-panel rounded-xl border border-alert-red/30">
          <AlertCircle className="w-12 h-12 text-alert-red mx-auto mb-3" />
          <p className="text-alert-red">Error: {error}</p>
        </div>
      )}

      {/* Submissions List - All submissions in one view */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-xl border border-cyber-blue-400/10">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No submissions yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Submissions will appear here
              </p>
            </div>
          ) : (
            submissions.map((submission) => {
              const statusConfig = getStatusConfig(submission.status);
              return (
                <motion.div
                  key={submission.submission_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-hack-black/50 border border-cyber-blue-400/20 rounded-xl hover:border-cyber-blue-400/40 transition-all cursor-pointer"
                  onClick={() => handleSubmissionClick(submission)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyber-blue-400/10 rounded-lg">
                        {getIcon(submission.submission_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {getTypeLabel(submission.submission_type)}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Submitted: {getTimeAgo(submission.submitted_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                      >
                        <div className="flex items-center gap-1">
                          {statusConfig.icon}
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>

                      {submission.score !== undefined && (
                        <div className="text-cyber-blue-400 font-semibold">
                          {submission.score}/100
                        </div>
                      )}

                      <button className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Assign Marks Button - Moved above Judging Criteria */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAssignMarks}
          disabled={submissions.length === 0}
          className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
            submissions.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue-400/50"
          }`}
        >
          <Award className="w-5 h-5" />
          Assign Marks to All Submissions
        </button>
      </div>

      {/* Judging Criteria Section - Now below the Assign Marks button */}
      <div className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20 mt-6">
        <h3 className="text-xl font-bold text-gradient mb-4">
          Judging Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-cyber-blue-400 mb-2">
              Correctness (40%)
            </h4>
            <p className="text-gray-300 text-sm">
              Solution produces correct output for all test cases including edge
              cases.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-cyber-blue-400 mb-2">
              Efficiency (30%)
            </h4>
            <p className="text-gray-300 text-sm">
              Optimal time and space complexity. Code should be efficient and
              well-structured.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-cyber-blue-400 mb-2">
              Code Quality (20%)
            </h4>
            <p className="text-gray-300 text-sm">
              Clean, readable, and well-documented code with proper variable
              naming.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-cyber-blue-400 mb-2">
              Visualization (10%)
            </h4>
            <p className="text-gray-300 text-sm">
              Quality and creativity of the visualization for the solution.
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-hack-navy/50 rounded-lg border border-warning-orange/30">
          <h4 className="font-bold text-warning-orange mb-2">Instructions</h4>
          <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
            <li>Assign a score out of 100 based on the criteria above</li>
            <li>
              All 3 submissions (code, GitHub, deployment) will receive the same
              score
            </li>
            <li>Provide constructive feedback to help teams improve</li>
            <li>Ensure fairness and consistency across all evaluations</li>
          </ul>
        </div>
      </div>

      {/* Code Display Modal */}
      {codeModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseCodeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel-strong max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-cyber-blue-400/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">
                Code Submission - {codeModal.team}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyCodeToClipboard}
                  className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={handleCloseCodeModal}
                  className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="bg-hack-navy/50 rounded-xl p-4 border border-cyber-blue-400/20">
              <pre className="text-gray-300 overflow-x-auto">
                <code>{codeModal.code}</code>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Assign Marks Modal */}
      {showMarksModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseMarksModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel-strong max-w-md w-full rounded-2xl border border-cyber-blue-400/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">Assign Marks</h2>
              <button
                onClick={handleCloseMarksModal}
                className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Score Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Score (out of 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marks.score === 0 ? "" : marks.score}
                  onChange={(e) =>
                    setMarks({
                      ...marks,
                      score:
                        e.target.value === ""
                          ? 0
                          : parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 bg-transparent"
                  placeholder="Enter score"
                />
              </div>

              {/* Review Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Review Comments
                </label>
                <textarea
                  value={marks.review}
                  onChange={(e) =>
                    setMarks({ ...marks, review: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 bg-transparent resize-none"
                  placeholder="Enter your review comments here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCloseMarksModal}
                  className="flex-1 px-4 py-3 glass-panel border border-gray-400/30 rounded-xl text-gray-300 font-semibold hover:border-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMarks}
                  disabled={marks.score < 0 || marks.score > 100}
                  className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                    marks.score < 0 || marks.score > 100
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white"
                  }`}
                >
                  Save Marks
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
