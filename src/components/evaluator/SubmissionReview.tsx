"use client";

import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Clock, Code, Github, Globe, Play, MessageSquare, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Submission {
  id: string;
  team: string;
  type: "code" | "github" | "deployment";
  status: "pending" | "submitted" | "accepted" | "rejected" | "live" | "correct" | "wrong";
  score?: number;
  submittedAt: string;
  link: string;
  message?: string;
}

interface SubmissionReviewProps {
  selectedTeam?: string;
}

export default function SubmissionReview({ selectedTeam }: SubmissionReviewProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Mock teams data - replace with actual API call
  const teams = [
    { id: "1", name: "CodeNinjas" },
    { id: "2", name: "AlgoMasters" },
    { id: "3", name: "ByteBreakers" },
    { id: "4", name: "DevDynamos" },
    { id: "5", name: "CodeCrafters" }
  ];

  const selectedTeamData = teams.find(t => t.id === selectedTeam);

  // Load submissions for the selected team
  useEffect(() => {
    if (selectedTeam) {
      // Simulate fetching submissions for the selected team
      const mockSubmissions: Submission[] = [
        {
          id: "1",
          team: selectedTeamData?.name || "Unknown Team",
          type: "code",
          status: "correct",
          score: 100,
          submittedAt: "2 min ago",
          link: "#",
          message: "Excellent solution with optimal time complexity. Clean code and good documentation."
        },
        {
          id: "2",
          team: selectedTeamData?.name || "Unknown Team",
          type: "github",
          status: "submitted",
          submittedAt: "5 min ago",
          link: "https://github.com/bytebuilders/contest-solution"
        },
        {
          id: "3",
          team: selectedTeamData?.name || "Unknown Team",
          type: "deployment",
          status: "live",
          submittedAt: "12 min ago",
          link: "https://devdynamos-contest.vercel.app"
        }
      ];
      
      // Add some variety based on team
      if (selectedTeam === "2") {
        mockSubmissions.push({
          id: "4",
          team: selectedTeamData?.name || "Unknown Team",
          type: "code",
          status: "wrong",
          score: 40,
          submittedAt: "15 min ago",
          link: "#",
          message: "Solution fails on edge cases. Time complexity needs optimization."
        });
      }
      
      setSubmissions(mockSubmissions);
    } else {
      setSubmissions([]);
    }
  }, [selectedTeam]);

  const getIcon = (type: Submission["type"]) => {
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
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      correct: {
        color: "bg-matrix-green/20 text-matrix-green border-matrix-green/50",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Accepted",
      },
      wrong: {
        color: "bg-alert-red/20 text-alert-red border-alert-red/50",
        icon: <XCircle className="w-4 h-4" />,
        label: "Wrong Answer",
      },
      submitted: {
        color: "bg-cyber-blue-400/20 text-cyber-blue-400 border-cyber-blue-400/50",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Submitted",
      },
      live: {
        color: "bg-matrix-green/20 text-matrix-green border-matrix-green/50",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Live",
      },
      pending: {
        color: "bg-warning-orange/20 text-warning-orange border-warning-orange/50",
        icon: <Clock className="w-4 h-4" />,
        label: "Pending",
      },
      accepted: {
        color: "bg-matrix-green/20 text-matrix-green border-matrix-green/50",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Accepted",
      },
      rejected: {
        color: "bg-alert-red/20 text-alert-red border-alert-red/50",
        icon: <XCircle className="w-4 h-4" />,
        label: "Rejected",
      },
    };

    return configs[status] || configs.pending;
  };

  const getTypeLabel = (type: Submission["type"]) => {
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

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseReview = () => {
    setSelectedSubmission(null);
  };

  // If no team is selected, don't show anything
  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Submissions List - Removed search and filters */}
      <div className="space-y-4">
        {submissions.map((submission) => {
          const statusConfig = getStatusConfig(submission.status);
          
          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-hack-black/50 border border-cyber-blue-400/20 rounded-xl hover:border-cyber-blue-400/40 transition-all cursor-pointer"
              onClick={() => handleViewSubmission(submission)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-cyber-blue-400/10 rounded-lg">
                    {getIcon(submission.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{submission.team}</h3>
                    <p className="text-sm text-gray-400">{getTypeLabel(submission.type)} • {submission.submittedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${statusConfig.color}`}>
                    <div className="flex items-center gap-1.5">
                      {statusConfig.icon}
                      {statusConfig.label}
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
        })}
      </div>

      {/* Submission Review Modal */}
      {selectedSubmission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseReview}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel-strong max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-cyber-blue-400/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">Submission Review</h2>
              <button
                onClick={handleCloseReview}
                className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Submission Info */}
              <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedSubmission.team}</h3>
                    <p className="text-gray-400">{getTypeLabel(selectedSubmission.type)} • Submitted {selectedSubmission.submittedAt}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getIcon(selectedSubmission.type)}
                      <span className="capitalize">{selectedSubmission.type}</span>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusConfig(selectedSubmission.status).color}`}>
                      <div className="flex items-center gap-1.5">
                        {getStatusConfig(selectedSubmission.status).icon}
                        {getStatusConfig(selectedSubmission.status).label}
                      </div>
                    </div>
                    
                    {selectedSubmission.score !== undefined && (
                      <div className="text-cyber-blue-400 font-bold text-xl">
                        {selectedSubmission.score}/100
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {selectedSubmission.link && selectedSubmission.link !== "#" && (
                  <a
                    href={selectedSubmission.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-cyber-blue-400 font-semibold hover:border-cyber-blue-400 transition-all duration-300 flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Submission
                  </a>
                )}
                
                <button className="px-6 py-3 glass-panel border border-matrix-green/30 rounded-xl text-matrix-green font-semibold hover:border-matrix-green transition-all duration-300 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Run Tests
                </button>
                
                <button className="px-6 py-3 glass-panel border border-warning-orange/30 rounded-xl text-warning-orange font-semibold hover:border-warning-orange transition-all duration-300 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Add Feedback
                </button>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-xl font-bold text-cyber-blue-400 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Evaluator Comments
                </h3>
                
                {selectedSubmission.message ? (
                  <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                    <p className="text-gray-300">{selectedSubmission.message}</p>
                  </div>
                ) : (
                  <div className="glass-panel p-8 rounded-xl border border-cyber-blue-400/20 text-center">
                    <MessageSquare className="w-12 h-12 text-cyber-blue-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">No Comments Yet</h4>
                    <p className="text-gray-400 mb-4">Add your evaluation feedback for this submission.</p>
                    <button className="px-4 py-2 bg-cyber-blue-400/10 border border-cyber-blue-400/30 rounded-lg text-cyber-blue-400 hover:bg-cyber-blue-400/20 transition-all">
                      Add Comment
                    </button>
                  </div>
                )}
              </div>

              {/* Scoring Section */}
              <div>
                <h3 className="text-xl font-bold text-cyber-blue-400 mb-4">Scoring Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                    <h4 className="font-semibold text-white mb-2">Creativity (60%)</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Score</span>
                      <span className="text-cyber-blue-400 font-bold">60/60</span>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                    <h4 className="font-semibold text-white mb-2">Clarity (20%)</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Score</span>
                      <span className="text-cyber-blue-400 font-bold">20/20</span>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/20">
                    <h4 className="font-semibold text-white mb-2">Correctness (20%)</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Score</span>
                      <span className="text-cyber-blue-400 font-bold">20/20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}