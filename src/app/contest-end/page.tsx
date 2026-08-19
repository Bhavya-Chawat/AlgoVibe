"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Users,
  Code,
  Github,
  Globe,
  Trophy,
  Clock,
  ChevronDown,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";
import {
  getTeamDetails,
  getSubmissionStatus,
} from "@/app/actions/submissionConfirmation";
import { logout } from "@/app/actions/auth";
import { getTeamInfo } from "@/app/actions/auth";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  member_id: number;
  name: string;
  usn: string | null;
  email: string | null;
  phone_number: string | null;
  role: "Leader" | "Member";
}

interface Team {
  team_id: number;
  team_name: string;
  pass: string;
}

// Updated Submission interface to match the actual database structure
interface Submission {
  submission_id: number;
  team_id: number;
  problem_id: number;
  submission: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  submission_type: "code" | "github" | "deployment";
}

export default function ContestEndedPage() {
  const [teamDetails, setTeamDetails] = useState<{
    team: Team;
    members: TeamMember[];
  } | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState({
    codeSubmitted: false,
    githubSubmitted: false,
    deploymentSubmitted: false,
    submissions: [] as Submission[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Get the actual team ID from the authenticated user
        const teamInfo = await getTeamInfo();

        console.log("Raw teamInfo:", teamInfo);

        if (!teamInfo) {
          setError("Unable to retrieve team information");
          setLoading(false);
          return;
        }

        const teamId = teamInfo.team_id;
        console.log("Extracted team ID:", teamId);
        console.log("Team info object:", teamInfo);

        // Let's also check what the actual team ID should be by looking at the teamInfo structure
        if (teamInfo.team_id === undefined) {
          console.error("team_id is undefined in teamInfo:", teamInfo);
          setError("Team ID is undefined in team information");
          setLoading(false);
          return;
        }

        console.log("Fetching data for team ID:", teamId);

        const [teamResult, statusResult] = await Promise.all([
          getTeamDetails(teamId),
          getSubmissionStatus(teamId),
        ]);

        console.log("Team result:", teamResult);
        console.log("Status result:", statusResult);

        if (teamResult.success && teamResult.data) {
          setTeamDetails(teamResult.data);
        } else {
          setError(teamResult.error || "Failed to load team details");
        }

        if (statusResult.success && statusResult.data) {
          console.log(
            "Setting submission status with data:",
            statusResult.data
          );
          setSubmissionStatus(statusResult.data);
        } else if (statusResult.error) {
          console.error("Submission status error:", statusResult.error);
          setError((prev) =>
            prev
              ? `${prev}; ${statusResult.error}`
              : statusResult.error || "Failed to load submission status"
          );
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleReturnHome = async () => {
    try {
      // Logout the user when they return to home
      await logout();
    } catch (err) {
      console.error("Error during logout:", err);
      // Even if logout fails, still redirect to home
      window.location.href = "/";
    }
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="w-5 h-5 text-cyber-blue-400" />;
      case "github":
        return <Github className="w-5 h-5 text-electric-cyan" />;
      case "deployment":
        return <Globe className="w-5 h-5 text-neon-blue" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
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

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const inputDate = new Date(timestamp);
    const diff = now.getTime() - inputDate.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";
      case "REJECTED":
        return "Rejected";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "text-matrix-green";
      case "REJECTED":
        return "text-alert-red";
      case "PENDING":
        return "text-cyber-blue-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-gray-400">Loading contest conclusion...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div
          className="text-center p-8 rounded-xl backdrop-blur-xl"
          style={{
            background: "rgba(10, 10, 31, 0.6)",
            border: "1px solid rgba(28, 171, 242, 0.3)",
          }}
        >
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl font-semibold backdrop-blur-lg transition-all hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(28, 171, 242, 0.4)",
              color: "#1cabf2",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug: Log the submission status data
  console.log("Rendering with submissionStatus:", submissionStatus);
  console.log("Submission count:", submissionStatus.submissions.length);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
          linear-gradient(rgba(28, 171, 242, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(28, 171, 242, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              boxShadow: "0 0 40px rgba(28, 171, 242, 0.5)",
            }}
          >
            <Trophy className="w-10 h-10 text-black" />
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contest Ended
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thank you for participating in AlgoVibe 2026
          </p>
        </div>

        {/* Confirmation Message */}
        <div
          className="backdrop-blur-xl rounded-2xl p-8 mb-10 text-center"
          style={{
            background: "rgba(10, 10, 31, 0.6)",
            border: "1px solid rgba(28, 171, 242, 0.3)",
            boxShadow: "0 8px 32px rgba(28, 171, 242, 0.2)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              boxShadow: "0 0 20px rgba(28, 171, 242, 0.4)",
            }}
          >
            <CheckCircle className="w-8 h-8 text-black" />
          </div>

          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Submissions Successfully Received
          </h2>

          <p className="text-gray-300 text-lg mb-6 max-w-3xl mx-auto">
            Congratulations on completing AlgoVibe 2026! We've received all your
            submissions and appreciate the time and effort you put into this
            competition.
          </p>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-cyan-400 font-medium flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              Results will be announced soon. Please check back later or watch
              your email for updates.
            </p>
          </div>
        </div>

        {/* Team Details */}
        {teamDetails && (
          <div className="mb-10">
            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{
                background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <Users className="inline w-6 h-6 mr-2" />
              Your Team
            </h3>

            <div
              className="backdrop-blur-xl rounded-2xl p-6 mb-6"
              style={{
                background: "rgba(10, 10, 31, 0.6)",
                border: "1px solid rgba(28, 171, 242, 0.2)",
                boxShadow: "0 8px 32px rgba(28, 171, 242, 0.2)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {teamDetails.team.team_name}
                  </h4>
                  {/* Removed team ID display as requested */}
                </div>

                <div className="flex flex-wrap gap-2">
                  {teamDetails.members.map((member) => (
                    <div
                      key={member.member_id}
                      className="flex items-center gap-2 bg-cyan-500/10 px-3 py-1 rounded-full text-sm"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          member.role === "Leader"
                            ? "bg-yellow-500"
                            : "bg-cyan-500"
                        }`}
                      ></span>
                      <span className="text-gray-300">{member.name}</span>
                      {member.role === "Leader" && (
                        <span className="text-yellow-500 text-xs">
                          (Leader)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission Status */}
        <div className="mb-12">
          <h3
            className="text-2xl font-bold mb-6 text-center"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Submission Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="backdrop-blur-lg p-6 rounded-xl text-center"
              style={{
                background: submissionStatus.codeSubmitted
                  ? "rgba(0, 255, 65, 0.1)"
                  : "rgba(255, 255, 255, 0.05)",
                border: submissionStatus.codeSubmitted
                  ? "1px solid rgba(0, 255, 65, 0.4)"
                  : "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: submissionStatus.codeSubmitted
                    ? "rgba(0, 255, 65, 0.2)"
                    : "rgba(28, 171, 242, 0.2)",
                  border: submissionStatus.codeSubmitted
                    ? "1px solid rgba(0, 255, 65, 0.6)"
                    : "1px solid rgba(28, 171, 242, 0.4)",
                }}
              >
                <Code
                  className={`w-6 h-6 ${
                    submissionStatus.codeSubmitted
                      ? "text-[#00ff41]"
                      : "text-cyan-400"
                  }`}
                />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Code Solution
              </h4>
              <p
                className={`font-medium ${
                  submissionStatus.codeSubmitted
                    ? "text-[#00ff41]"
                    : "text-gray-400"
                }`}
              >
                {submissionStatus.codeSubmitted ? "Submitted" : "Not Submitted"}
              </p>
            </div>

            <div
              className="backdrop-blur-lg p-6 rounded-xl text-center"
              style={{
                background: submissionStatus.githubSubmitted
                  ? "rgba(0, 255, 65, 0.1)"
                  : "rgba(255, 255, 255, 0.05)",
                border: submissionStatus.githubSubmitted
                  ? "1px solid rgba(0, 255, 65, 0.4)"
                  : "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: submissionStatus.githubSubmitted
                    ? "rgba(0, 255, 65, 0.2)"
                    : "rgba(28, 171, 242, 0.2)",
                  border: submissionStatus.githubSubmitted
                    ? "1px solid rgba(0, 255, 65, 0.6)"
                    : "1px solid rgba(28, 171, 242, 0.4)",
                }}
              >
                <Github
                  className={`w-6 h-6 ${
                    submissionStatus.githubSubmitted
                      ? "text-[#00ff41]"
                      : "text-cyan-400"
                  }`}
                />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                GitHub Repository
              </h4>
              <p
                className={`font-medium ${
                  submissionStatus.githubSubmitted
                    ? "text-[#00ff41]"
                    : "text-gray-400"
                }`}
              >
                {submissionStatus.githubSubmitted
                  ? "Submitted"
                  : "Not Submitted"}
              </p>
            </div>

            <div
              className="backdrop-blur-lg p-6 rounded-xl text-center"
              style={{
                background: submissionStatus.deploymentSubmitted
                  ? "rgba(0, 255, 65, 0.1)"
                  : "rgba(255, 255, 255, 0.05)",
                border: submissionStatus.deploymentSubmitted
                  ? "1px solid rgba(0, 255, 65, 0.4)"
                  : "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: submissionStatus.deploymentSubmitted
                    ? "rgba(0, 255, 65, 0.2)"
                    : "rgba(28, 171, 242, 0.2)",
                  border: submissionStatus.deploymentSubmitted
                    ? "1px solid rgba(0, 255, 65, 0.6)"
                    : "1px solid rgba(28, 171, 242, 0.4)",
                }}
              >
                <Globe
                  className={`w-6 h-6 ${
                    submissionStatus.deploymentSubmitted
                      ? "text-[#00ff41]"
                      : "text-cyan-400"
                  }`}
                />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Deployment</h4>
              <p
                className={`font-medium ${
                  submissionStatus.deploymentSubmitted
                    ? "text-[#00ff41]"
                    : "text-gray-400"
                }`}
              >
                {submissionStatus.deploymentSubmitted
                  ? "Submitted"
                  : "Not Submitted"}
              </p>
            </div>
          </div>
        </div>

        {/* Submission History */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="backdrop-blur-xl rounded-2xl p-6"
            style={{
              background: "rgba(10, 10, 31, 0.6)",
              border: "1px solid rgba(28, 171, 242, 0.2)",
              boxShadow: "0 8px 32px rgba(28, 171, 242, 0.2)",
            }}
          >
            {/* Header */}
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full flex items-center justify-between group"
              aria-expanded={isHistoryExpanded}
              aria-controls="submission-history-list"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-cyber-blue-400" />
                <h3
                  className="text-2xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  SUBMISSION HISTORY
                </h3>
                <div className="px-2 py-1 text-xs bg-cyber-blue-400/20 text-cyber-blue-400 border border-cyber-blue-400/30 rounded-full">
                  {submissionStatus.submissions.length}
                </div>
              </div>

              <motion.div
                animate={{ rotate: isHistoryExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6 text-cyber-blue-400 group-hover:text-neon-blue transition-colors" />
              </motion.div>
            </button>

            {/* Submissions List */}
            <AnimatePresence>
              {isHistoryExpanded && (
                <motion.div
                  id="submission-history-list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-4 overflow-hidden"
                >
                  {submissionStatus.submissions.length === 0 ? (
                    <div
                      className="text-center py-12 backdrop-blur-lg rounded-xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(28, 171, 242, 0.1)",
                      }}
                    >
                      <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No submissions yet</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Your submissions will appear here
                      </p>
                      {/* Debug info */}
                      <div className="mt-4 text-xs text-gray-500">
                        <p>
                          Submission count:{" "}
                          {submissionStatus.submissions.length}
                        </p>
                        <p>
                          Code submitted:{" "}
                          {submissionStatus.codeSubmitted ? "Yes" : "No"}
                        </p>
                        <p>
                          GitHub submitted:{" "}
                          {submissionStatus.githubSubmitted ? "Yes" : "No"}
                        </p>
                        <p>
                          Deployment submitted:{" "}
                          {submissionStatus.deploymentSubmitted ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    submissionStatus.submissions.map((submission, index) => (
                      <motion.div
                        key={submission.submission_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="backdrop-blur-lg p-5 rounded-xl"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(28, 171, 242, 0.1)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Left Side - Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getSubmissionTypeIcon(
                                submission.submission_type
                              )}
                              <div>
                                <h4 className="font-semibold text-gray-200">
                                  #{submissionStatus.submissions.length - index}{" "}
                                  • {getTypeLabel(submission.submission_type)}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {getTimeAgo(submission.submitted_at)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Side - Status & Actions */}
                          <div className="flex flex-col items-end gap-3">
                            <div
                              className={`text-sm font-semibold ${getStatusColor(
                                submission.status
                              )}`}
                            >
                              {getStatusLabel(submission.status)}
                            </div>

                            {submission.submission_type === "code" && (
                              <button
                                onClick={() =>
                                  setSelectedCode(submission.submission)
                                }
                                className="flex items-center gap-2 px-3 py-1.5 backdrop-blur-lg border rounded-lg text-xs hover:bg-cyber-blue-400/10 transition-all"
                                style={{
                                  border: "1px solid rgba(28, 171, 242, 0.3)",
                                  color: "#1cabf2",
                                }}
                              >
                                View Code
                              </button>
                            )}

                            {(submission.submission_type === "github" ||
                              submission.submission_type === "deployment") && (
                              <a
                                href={submission.submission}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 backdrop-blur-lg border rounded-lg text-xs hover:bg-cyber-blue-400/10 transition-all"
                                style={{
                                  border: "1px solid rgba(28, 171, 242, 0.3)",
                                  color: "#1cabf2",
                                }}
                              >
                                View Submission{" "}
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Feedback Section */}
        <div className="mb-12 text-center">
          <h3
            className="text-2xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We Value Your Feedback
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Your insights help us improve future competitions. Please take a
            moment to share your experience.
          </p>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe7sa-INTuAfUKREtN8OQzjxc36lxYZwO42jQ60gfNldk-4Cw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold backdrop-blur-lg transition-all hover:scale-105 inline-flex items-center gap-2"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(28, 171, 242, 0.4)",
              color: "#1cabf2",
            }}
          >
            Provide Feedback
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>

        {/* Closing Message */}
        <div className="text-center">
          <h3
            className="text-2xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Until Next Time
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Thank you for being part of AlgoVibe 2026. We hope you enjoyed the
            challenge and learned something new. Stay connected for future
            competitions and opportunities!
          </p>

          <button
            onClick={handleReturnHome}
            className="px-8 py-3 rounded-xl font-semibold backdrop-blur-lg transition-all hover:scale-105 inline-block"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              boxShadow: "0 0 30px rgba(28, 171, 242, 0.4)",
              color: "#000",
            }}
          >
            Return to Home
          </button>
        </div>
      </div>

      {/* Code View Modal */}
      <AnimatePresence>
        {selectedCode !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto p-6 relative"
            >
              <button
                onClick={() => setSelectedCode(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close code view"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                Code Submission
              </h3>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-200 bg-gray-800 p-4 rounded-lg">
                {selectedCode}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
