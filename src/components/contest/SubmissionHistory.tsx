"use client";

import { useState } from "react";
import { ChevronDown, Code, Github, Globe, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";

interface SubmissionHistoryProps {
  submissions: Array<{
    id: string;
    type: 'code' | 'github' | 'deployment';
    link: string;
    status: 'pending' | 'submitted' | 'accepted' | 'rejected';
    timestamp: Date;
    score?: number;
    message?: string;
  }>;
}

export default function SubmissionHistory({ submissions }: SubmissionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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
    };

    const config = configs[status] || configs.pending;

    return (
      <Badge className={`px-3 py-1 text-xs font-semibold border flex items-center gap-1.5 ${config.color}`}>
        {config.icon}
        {config.label}
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

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
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
      >
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-cyber-blue-400" />
          <h3 className="text-2xl font-bold text-gradient">
            SUBMISSION HISTORY
          </h3>
          <Badge className="px-2 py-1 text-xs bg-cyber-blue-400/20 text-cyber-blue-400 border border-cyber-blue-400/30">
            {submissions.length}
          </Badge>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-cyber-blue-400 group-hover:text-neon-blue transition-colors" />
        </motion.div>
      </button>

      {/* Submissions List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
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
                          <p className="text-xs text-gray-500 mt-0.5">
                            {getTimeAgo(submission.timestamp)}
                          </p>
                        </div>
                      </div>

                      {submission.message && (
                        <p className="text-sm text-gray-400 mb-3">
                          {submission.message}
                        </p>
                      )}

                      {submission.score !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Score:</span>
                          <span className="text-cyber-blue-400 font-bold">
                            {submission.score}/100
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(submission.status)}
                      
                      {submission.link && (
                        <motion.a
                          href={submission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1.5 glass-panel border border-cyber-blue-400/30 
                            rounded-lg text-xs text-cyber-blue-400 hover:bg-cyber-blue-400/10 transition-all"
                        >
                          <span>View Submission</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </motion.a>
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
  );
}