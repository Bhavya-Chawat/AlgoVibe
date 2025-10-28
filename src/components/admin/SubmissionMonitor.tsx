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
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getSubmissions,
  updateSubmissionStatus,
} from "@/app/(admin)/admin/actions";
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

export default function SubmissionMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    // Filter submissions based on search query
    const filtered = submissions.filter((submission) => {
      const matchesSearch = submission.team.team_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredSubmissions(filtered);
  }, [searchQuery, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const result = await getSubmissions();
      if (result.success && result.data) {
        setSubmissions(result.data);
      } else {
        console.error("Failed to fetch submissions:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: Submission["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="w-5 h-5 text-matrix-green" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-alert-red" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-warning-orange animate-spin" />;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <div className="w-full pl-10 pr-4 py-2 bg-hack-black border border-cyber-blue-400/20 rounded-xl text-white focus:border-cyber-blue-400/60 focus:outline-none transition-all animate-pulse">
              Loading...
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="p-4 bg-hack-black/50 border border-cyber-blue-400/20 rounded-xl animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team name..."
            className="w-full pl-10 pr-4 py-2 bg-hack-black border border-cyber-blue-400/20 rounded-xl text-white focus:border-cyber-blue-400/60 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <motion.div
            key={submission.submission_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-hack-black/50 border border-cyber-blue-400/20 rounded-xl hover:border-cyber-blue-400/40 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyber-blue-400/10 rounded-lg">
                  {getSubmissionTypeIcon(submission.submission_type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {submission.team.team_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span className="text-sm font-medium capitalize">
                    {submission.status.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                        className="p-2 hover:bg-matrix-green/10 rounded-lg transition-all text-matrix-green"
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
                        className="p-2 hover:bg-alert-red/10 rounded-lg transition-all text-alert-red"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
                    onClick={() => handleViewDetails(submission)}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submission Details Modal */}
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
