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
  User,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";
import {
  getTeamSubmissions,
  assignDetailedScoresToTeamSubmissions,
  getTeamScores,
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
  const [detailedScores, setDetailedScores] = useState({
    visualizationQuality: 0,
    coreLogicEfficiency: 0,
    webAppUX: 0,
    engineeringRepo: 0,
    review: "",
    evaluatorName: "",
  });
  const [codeModal, setCodeModal] = useState<{
    isOpen: boolean;
    code: string;
    team: string;
  }>({ isOpen: false, code: "", team: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<number | null>(null);
  const [existingScores, setExistingScores] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // Load existing scores when team and problem are selected
  useEffect(() => {
    const fetchExistingScores = async () => {
      if (selectedTeam && problemId) {
        try {
          const teamId = parseInt(selectedTeam, 10);
          const result = await getTeamScores(teamId, problemId);

          if (result.success && result.scores) {
            setExistingScores(result.scores);
            setDetailedScores({
              visualizationQuality:
                result.scores.visualization_quality_score || 0,
              coreLogicEfficiency:
                result.scores.core_logic_efficiency_score || 0,
              webAppUX: result.scores.web_app_ux_score || 0,
              engineeringRepo: result.scores.engineering_repo_score || 0,
              review: result.scores.feedback || "",
              evaluatorName: result.scores.evaluator_name || "",
            });
          } else {
            setExistingScores(null);
          }
        } catch (err) {
          console.error("Error fetching existing scores:", err);
        }
      }
    };

    fetchExistingScores();
  }, [selectedTeam, problemId]);

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
  };

  const handleSaveMarks = async () => {
    if (!selectedTeam || !problemId) {
      alert("Team or problem not selected");
      return;
    }

    try {
      setIsSaving(true);
      const teamId = parseInt(selectedTeam, 10);
      const result = await assignDetailedScoresToTeamSubmissions(
        teamId,
        problemId,
        {
          visualizationQuality: detailedScores.visualizationQuality,
          coreLogicEfficiency: detailedScores.coreLogicEfficiency,
          webAppUX: detailedScores.webAppUX,
          engineeringRepo: detailedScores.engineeringRepo,
        },
        detailedScores.review,
        detailedScores.evaluatorName
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
    } finally {
      setIsSaving(false);
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

  // Calculate total score
  const totalScore =
    detailedScores.visualizationQuality +
    detailedScores.coreLogicEfficiency +
    detailedScores.webAppUX +
    detailedScores.engineeringRepo;

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

      {/* Evaluation Status Box - REMOVED as it's now shown in the evaluator page */}

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
          {existingScores ? "Update Evaluation" : "Evaluate Team"}
        </button>
      </div>

      {/* Judging Criteria Section - Now below the Assign Marks button */}
      <div className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20 mt-6">
        <h3 className="text-xl font-bold text-gradient mb-4">
          Judging Criteria
        </h3>

        {/* Visualization Quality & Insight (45%) */}
        <div className="glass-panel p-4 rounded-lg mb-4">
          <h4 className="font-bold text-cyber-blue-400 mb-2">
            1. Visualization Quality & Insight (45%)
          </h4>
          <p className="text-gray-300 text-sm mb-3">
            Clarity, Creativity, and Pedagogical Value. Does the visualization
            clearly explain the algorithm's steps? Is it creative, engaging, and
            easy to follow? Must include advanced features like reset buttons,
            speed control, step-by-step navigation, and optional sound/animation
            controls.
          </p>

          <div className="ml-4 space-y-2">
            <div>
              <h5 className="font-semibold text-gray-300">
                A. Clarity of Steps & Pedagogical Value (15 pts)
              </h5>
              <p className="text-gray-400 text-sm">
                Precision in reflecting the algorithm's execution; clearly
                highlighting the current operation (e.g., comparison, swap,
                recursion). The visualization must genuinely aid understanding.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-300">
                B. Interactivity & Advanced Controls (15 pts)
              </h5>
              <p className="text-gray-400 text-sm">
                Must include Reset/Randomize input button, Speed Control slider,
                Step-by-Step navigation (forward/backward), and the ability to
                input custom test cases.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-300">
                C. Creativity, Animation, & Engagement (10 pts)
              </h5>
              <p className="text-gray-400 text-sm">
                Creative use of animations, sound effects (optional), color, and
                visual metaphors to make the complex logic intuitive and highly
                engaging.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-300">
                D. Display of Performance Metrics (5 pts)
              </h5>
              <p className="text-gray-400 text-sm">
                The visualization should display real-time or final metrics like
                the number of comparisons/swaps or the actual execution time for
                the given input.
              </p>
            </div>
          </div>
        </div>

        {/* Core Logic & Efficiency (25%) */}
        <div className="glass-panel p-4 rounded-lg mb-4">
          <h4 className="font-bold text-cyber-blue-400 mb-2">
            2. Core Logic & Efficiency (25%)
          </h4>
          <p className="text-gray-300 text-sm mb-3">
            Correctness, Robustness, and Performance. The solution must produce
            the correct output for all test cases. Focus remains on choosing
            optimal data structures and achieving strong time/space complexity,
            though with a reduced weight.
          </p>

          <div className="ml-4 space-y-2">
            <div>
              <h5 className="font-semibold text-gray-300">
                A. Algorithmic Correctness (15 pts)
              </h5>
              <p className="text-gray-400 text-sm">
                The underlying code must solve the problem completely and handle
                all specified constraints and edge cases without runtime errors.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-300">
                B. Time & Space Complexity (10 pts)
              </h5>
              <p className="text-gray-400 text-sm">
                Solution achieves the theoretically optimal (or near-optimal)
                time and space complexity. The repository should briefly justify
                the complexity.
              </p>
            </div>
          </div>
        </div>

        {/* Web Application UX & Polish (20%) */}
        <div className="glass-panel p-4 rounded-lg mb-4">
          <h4 className="font-bold text-cyber-blue-400 mb-2">
            3. Web Application UX & Polish (20%)
          </h4>
          <p className="text-gray-300 text-sm">
            User Experience, Aesthetics, and Responsiveness. Is the deployed
            application visually appealing, intuitive, and easy to navigate?
            Focus includes clear presentation of the DSA problem description and
            a smooth user flow.
          </p>
        </div>

        {/* Engineering & Repository Management (10%) */}
        <div className="glass-panel p-4 rounded-lg">
          <h4 className="font-bold text-cyber-blue-400 mb-2">
            4. Engineering & Repository Management (10%)
          </h4>
          <p className="text-gray-300 text-sm">
            Documentation, Readability, and Project Structure. Repository must
            be well-organized with a clear README.md. Emphasis on code
            maintainability (clear separation of concerns) and professional
            documentation.
          </p>
        </div>

        <div className="mt-4 p-4 bg-hack-navy/50 rounded-lg border border-warning-orange/30">
          <h4 className="font-bold text-warning-orange mb-2">Instructions</h4>
          <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
            <li>
              Assign scores based on the criteria above with the specified
              weightings
            </li>
            <li>
              All 3 submissions (code, GitHub, deployment) will receive the same
              detailed scores
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
            className="glass-panel-strong max-w-2xl w-full rounded-2xl border border-cyber-blue-400/30 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">
                Team Evaluation
              </h2>
              <button
                onClick={handleCloseMarksModal}
                className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
                disabled={isSaving}
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {isSaving ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-blue-400 mb-4"></div>
                <p className="text-gray-400">Saving evaluation...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Evaluator Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Evaluator Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={detailedScores.evaluatorName}
                      onChange={(e) =>
                        setDetailedScores({
                          ...detailedScores,
                          evaluatorName: e.target.value,
                        })
                      }
                      className="w-full pl-10 px-4 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 bg-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                {/* Detailed Scoring Section */}
                <div className="border border-cyber-blue-400/20 rounded-xl p-4">
                  <h3 className="font-bold text-cyber-blue-400 mb-4">
                    Detailed Scoring
                  </h3>

                  <div className="space-y-5">
                    {/* Visualization Quality & Insight (45%) */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-semibold text-gray-300">
                          Visualization Quality & Insight (45%)
                        </label>
                        <span className="text-sm font-semibold text-cyber-blue-400">
                          {detailedScores.visualizationQuality}/45
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="45"
                        value={detailedScores.visualizationQuality}
                        onChange={(e) =>
                          setDetailedScores({
                            ...detailedScores,
                            visualizationQuality: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-blue-400"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>45</span>
                      </div>
                    </div>

                    {/* Core Logic & Efficiency (25%) */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-semibold text-gray-300">
                          Core Logic & Efficiency (25%)
                        </label>
                        <span className="text-sm font-semibold text-cyber-blue-400">
                          {detailedScores.coreLogicEfficiency}/25
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={detailedScores.coreLogicEfficiency}
                        onChange={(e) =>
                          setDetailedScores({
                            ...detailedScores,
                            coreLogicEfficiency: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-blue-400"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>25</span>
                      </div>
                    </div>

                    {/* Web Application UX & Polish (20%) */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-semibold text-gray-300">
                          Web Application UX & Polish (20%)
                        </label>
                        <span className="text-sm font-semibold text-cyber-blue-400">
                          {detailedScores.webAppUX}/20
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={detailedScores.webAppUX}
                        onChange={(e) =>
                          setDetailedScores({
                            ...detailedScores,
                            webAppUX: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-blue-400"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>20</span>
                      </div>
                    </div>

                    {/* Engineering & Repository Management (10%) */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-semibold text-gray-300">
                          Engineering & Repository Management (10%)
                        </label>
                        <span className="text-sm font-semibold text-cyber-blue-400">
                          {detailedScores.engineeringRepo}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={detailedScores.engineeringRepo}
                        onChange={(e) =>
                          setDetailedScores({
                            ...detailedScores,
                            engineeringRepo: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-blue-400"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Score Display */}
                <div className="p-4 bg-cyber-blue-400/10 rounded-xl border border-cyber-blue-400/30">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-300">
                      Total Score:
                    </span>
                    <span className="text-2xl font-bold text-cyber-blue-400">
                      {totalScore}/100
                    </span>
                  </div>
                </div>

                {/* Review Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Review Comments
                  </label>
                  <textarea
                    value={detailedScores.review}
                    onChange={(e) =>
                      setDetailedScores({
                        ...detailedScores,
                        review: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 bg-transparent resize-none"
                    placeholder="Enter your review comments here..."
                  />
                </div>

                {/* Evaluated Status */}
                {existingScores && (
                  <div className="p-4 bg-green-400/10 rounded-xl border border-green-400/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-green-400">
                        Already Evaluated
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          Evaluated by: {existingScores.evaluator_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Evaluated at:{" "}
                          {new Date(
                            existingScores.evaluated_at
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCloseMarksModal}
                    className="flex-1 px-4 py-3 glass-panel border border-gray-400/30 rounded-xl text-gray-300 font-semibold hover:border-gray-400 transition-all duration-300"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMarks}
                    disabled={!detailedScores.evaluatorName.trim() || isSaving}
                    className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                      !detailedScores.evaluatorName.trim()
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white"
                    }`}
                  >
                    {existingScores ? "Update Evaluation" : "Submit Evaluation"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
