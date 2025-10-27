"use client";

import { useState } from "react";
import {
  ChevronDown,
  Code,
  Github,
  Globe,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";

interface SubmissionHistoryProps {
  submissions: Array<{
    id: string;
    type: "code" | "github" | "deployment";
    link: string;
    status: "pending" | "submitted" | "accepted" | "rejected";
    timestamp: Date | string;
    score?: number;
    message?: string;
    submission?: string; // for code content
  }>;
}

export default function SubmissionHistory({ submissions }: SubmissionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const getIcon = (type: string) => {
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

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
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
    };

    const config = configs[status.toLowerCase()] || configs.pending;

    return (
      <Badge className={`px-3 py-1 text-xs font-semibold border flex items-center gap-1.5 ${config.color}`}>
        {config.icon} {config.label}
      </Badge>
    );
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

  const getTimeAgo = (timestamp: Date | string) => {
    const now = new Date();
    const inputDate = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const diff = now.getTime() - inputDate.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between group"
          aria-expanded={isExpanded}
          aria-controls="submission-history-list"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-cyber-blue-400" />
            <h3 className="text-2xl font-bold text-gradient">SUBMISSION HISTORY</h3>
            <Badge className="px-2 py-1 text-xs bg-cyber-blue-400/20 text-cyber-blue-400 border border-cyber-blue-400/30">
              {submissions.length}
            </Badge>
          </div>

          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-6 h-6 text-cyber-blue-400 group-hover:text-neon-blue transition-colors" />
          </motion.div>
        </button>

        {/* Submissions List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="submission-history-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4 overflow-hidden"
            >
              {submissions.length === 0 ? (
                <div className="text-center py-12 glass-panel rounded-xl border border-cyber-blue-400/10">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No submissions yet</p>
                  <p className="text-gray-500 text-sm mt-1">Your submissions will appear here</p>
                </div>
              ) : (
                submissions.map((submission, index) => (
                  <motion.div
                    key={submission.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-5 rounded-xl border border-cyber-blue-400/10 hover:border-cyber-blue-400/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Side - Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getIcon(submission.type)}
                          <div>
                            <h4 className="font-semibold text-gray-200 group-hover:text-cyber-blue-400 transition-colors">
                              #{submissions.length - index} • {getTypeLabel(submission.type)}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">{getTimeAgo(submission.timestamp)}</p>
                          </div>
                        </div>

                        {submission.message && (
                          <p className="text-sm text-gray-400 mb-3 whitespace-pre-wrap">{submission.message}</p>
                        )}

                        {submission.score !== undefined && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Score:</span>
                            <span className="text-cyber-blue-400 font-bold">{submission.score}/100</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {getStatusBadge(submission.status)}

                        {submission.type === "code" && submission.submission && (
                          <button
                            onClick={() => setSelectedCode(submission.submission || "")}
                            className="flex items-center gap-2 px-3 py-1.5 glass-panel border border-cyber-blue-400/30 rounded-lg text-xs text-cyber-blue-400 hover:bg-cyber-blue-400/10 transition-all"
                          >
                            View Code
                          </button>
                        )}

                        {(submission.type === "github" || submission.type === "deployment") && submission.link && (
                          <a
                            href={submission.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 glass-panel border border-cyber-blue-400/30 rounded-lg text-xs text-cyber-blue-400 hover:bg-cyber-blue-400/10 transition-all"
                          >
                            View Submission <ExternalLink className="w-3.5 h-3.5" />
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
              className="bg-hack-black rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto p-6 relative"
            >
              <button
                onClick={() => setSelectedCode(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close code view"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-semibold mb-4 text-cyber-blue-400">Code Submission</h3>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-200 bg-gray-900 p-4 rounded-lg">{selectedCode}</pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
