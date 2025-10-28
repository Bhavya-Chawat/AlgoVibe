"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Github,
  Globe,
  Download,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { getSubmissions, updateSubmissionStatus } from "../actions";
import SubmissionDetailsModal from "@/components/admin/SubmissionDetailsModal";

interface Submission {
  submission_id: number;
  team: {
    team_id: number;
    team_name: string;
  };
  member: {
    member_id: number;
    name: string;
    email: string;
  } | null;
  problem: {
    problem_id: number;
    title: string;
  };
  submission: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  score: number;
  feedback: string;
  submitted_at: string;
  submission_type: "code" | "github" | "deployment";
}

export default function AdminSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const result = await getSubmissions(filterStatus);
      if (result.success && result.data) {
        setSubmissions(result.data);
      } else {
        console.error("Failed to fetch submissions:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    submissionId: number,
    status: "ACCEPTED" | "REJECTED",
    score?: number,
    feedback?: string
  ) => {
    try {
      // Set default score based on status if not provided
      const finalScore =
        score !== undefined ? score : status === "ACCEPTED" ? 100 : 0;
      const finalFeedback =
        feedback ||
        (status === "ACCEPTED" ? "Well done!" : "Needs improvement");

      const result = await updateSubmissionStatus(
        submissionId,
        status,
        finalFeedback,
        finalScore
      );
      if (result.success && result.data) {
        // Update the local state
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.submission_id === submissionId
              ? { ...sub, status, score: finalScore, feedback: finalFeedback }
              : sub
          )
        );
      } else {
        console.error("Failed to update submission status:", result.error);
      }
    } catch (error) {
      console.error("Failed to update submission status:", error);
    }
  };

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add headers
      csvContent +=
        "Team Name,Problem,Member Name,Member Email,Submission Type,Status,Score,Submitted At,Feedback\n";

      // Add submission data
      filteredSubmissions.forEach((submission) => {
        const memberName = submission.member?.name || "N/A";
        const memberEmail = submission.member?.email || "N/A";
        const submittedAt = new Date(submission.submitted_at).toLocaleString();

        csvContent += `"${submission.team.team_name}","${submission.problem.title}","${memberName}","${memberEmail}","${submission.submission_type}","${submission.status}",${submission.score},"${submittedAt}","${submission.feedback}"\n`;
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `submissions_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Submissions data exported successfully");
    } catch (error) {
      console.error("Failed to export submissions data:", error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSubmissions().finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.team.team_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.problem.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (submission.member?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false);
    return matchesSearch;
  });

  const getStatusIcon = (status: Submission["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="w-5 h-5 text-matrix-green" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-alert-red" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-cyber-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-cyber-blue-400" />;
    }
  };

  const getSubmissionTypeIcon = (type: Submission["submission_type"]) => {
    switch (type) {
      case "code":
        return <Code className="w-5 h-5" />;
      case "github":
        return <Github className="w-5 h-5" />;
      case "deployment":
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Submission Management
        </h1>
        <p className="text-gray-400">Review and evaluate team submissions</p>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team name, problem, or member..."
              className="w-full pl-12 pr-4 py-3 bg-hack-navy/50 border border-cyber-blue-400/30 rounded-xl text-gray-200 placeholder-gray-500 focus:border-cyber-blue-400 focus:ring-2 focus:ring-cyber-blue-400/20 transition-all duration-300"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-hack-navy/50 border border-cyber-blue-400/30 text-gray-200 rounded-xl focus:border-cyber-blue-400 focus:ring-2 focus:ring-cyber-blue-400/20 transition-all duration-300 appearance-none cursor-pointer pr-10"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-4 py-3 glass-panel border border-cyber-blue-400/30 hover:border-cyber-blue-400 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RefreshCw
              className={`w-5 h-5 text-cyber-blue-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-4 py-3 bg-gradient-to-r from-cyber-blue-400 to-neon-blue hover:from-cyber-blue-500 hover:to-neon-blue text-hack-black font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Submissions",
            value: submissions.length,
            color: "cyber-blue-400",
          },
          {
            label: "Pending",
            value: submissions.filter((s) => s.status === "PENDING").length,
            color: "warning-orange",
          },
          {
            label: "Accepted",
            value: submissions.filter((s) => s.status === "ACCEPTED").length,
            color: "matrix-green",
          },
          {
            label: "Rejected",
            value: submissions.filter((s) => s.status === "REJECTED").length,
            color: "alert-red",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel-strong p-4 rounded-xl border border-cyber-blue-400/20"
          >
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Submissions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-strong rounded-2xl border border-cyber-blue-400/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-blue-400/20">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">
                  Team
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">
                  Problem
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">
                  Member
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">
                  Type
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    {isLoading
                      ? "Loading submissions..."
                      : "No submissions found"}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission.submission_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-cyber-blue-400/10 hover:bg-hack-navy/30 transition-colors duration-300"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-200">
                        {submission.team.team_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(submission.submitted_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {submission.problem.title}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300">
                        {submission.member?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {submission.member?.email || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-blue-400/10 rounded-full text-cyber-blue-400 text-sm">
                        {getSubmissionTypeIcon(submission.submission_type)}
                        {submission.submission_type}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold">
                        {getStatusIcon(submission.status)}
                        <span
                          className={
                            submission.status === "ACCEPTED"
                              ? "text-matrix-green"
                              : submission.status === "REJECTED"
                              ? "text-alert-red"
                              : "text-cyber-blue-400"
                          }
                        >
                          {submission.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {submission.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  submission.submission_id,
                                  "ACCEPTED",
                                  100,
                                  "Well done!"
                                )
                              }
                              className="p-2 bg-matrix-green/10 hover:bg-matrix-green/20 rounded-lg text-matrix-green transition-colors duration-300"
                              title="Accept"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  submission.submission_id,
                                  "REJECTED",
                                  0,
                                  "Needs improvement"
                                )
                              }
                              className="p-2 bg-alert-red/10 hover:bg-alert-red/20 rounded-lg text-alert-red transition-colors duration-300"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          className="p-2 bg-cyber-blue-400/10 hover:bg-cyber-blue-400/20 rounded-lg text-cyber-blue-400 transition-colors duration-300"
                          title="View Details"
                          onClick={() => handleViewDetails(submission)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Submission Details Modal */}
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
