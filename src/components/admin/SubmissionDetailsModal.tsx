"use client";

import { useState } from "react";
import { X, Code, Github, Globe, User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface SubmissionDetailsModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionDetailsModal({
  submission,
  isOpen,
  onClose,
}: SubmissionDetailsModalProps) {
  if (!submission) return null;

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

  const formatSubmissionContent = (submission: Submission) => {
    if (submission.submission_type === "code") {
      return (
        <pre className="bg-hack-black/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
          <code>{submission.submission}</code>
        </pre>
      );
    }

    if (submission.submission_type === "github") {
      return (
        <div className="bg-hack-black/50 p-4 rounded-lg">
          <a
            href={submission.submission}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-blue-400 hover:underline break-all"
          >
            {submission.submission}
          </a>
        </div>
      );
    }

    if (submission.submission_type === "deployment") {
      return (
        <div className="bg-hack-black/50 p-4 rounded-lg">
          <a
            href={submission.submission}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-blue-400 hover:underline break-all"
          >
            {submission.submission}
          </a>
        </div>
      );
    }

    return (
      <div className="bg-hack-black/50 p-4 rounded-lg">
        {submission.submission}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-hack-navy border border-cyber-blue-400/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyber-blue-400/20">
              <h2 className="text-2xl font-bold text-gradient">
                Submission Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-hack-black/50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Team and Problem Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-hack-black/30 p-4 rounded-xl border border-cyber-blue-400/20">
                  <h3 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Team
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {submission.team.team_name}
                  </p>
                  {submission.member && (
                    <p className="text-sm text-gray-400 mt-1">
                      {submission.member.name} ({submission.member.email})
                    </p>
                  )}
                </div>

                <div className="bg-hack-black/30 p-4 rounded-xl border border-cyber-blue-400/20">
                  <h3 className="font-semibold text-gray-300 mb-2">Problem</h3>
                  <p className="text-lg font-bold text-white">
                    {submission.problem.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-cyber-blue-400/10 rounded-full text-cyber-blue-400 text-xs">
                      {getSubmissionTypeIcon(submission.submission_type)}
                      {submission.submission_type}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-warning-orange/10 rounded-full text-warning-orange text-xs">
                      {submission.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="bg-hack-black/30 p-4 rounded-xl border border-cyber-blue-400/20">
                <h3 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Submission Content
                </h3>
                {formatSubmissionContent(submission)}
              </div>

              {/* Score and Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-hack-black/30 p-4 rounded-xl border border-cyber-blue-400/20">
                  <h3 className="font-semibold text-gray-300 mb-2">Score</h3>
                  <p className="text-3xl font-bold text-matrix-green">
                    {submission.score > 0 ? submission.score : "-"}
                  </p>
                </div>

                <div className="bg-hack-black/30 p-4 rounded-xl border border-cyber-blue-400/20">
                  <h3 className="font-semibold text-gray-300 mb-2">Feedback</h3>
                  <p className="text-white">
                    {submission.feedback || "No feedback provided"}
                  </p>
                </div>
              </div>

              {/* Submission Date */}
              <div className="bg-hack-black/30 p-4 rounded-xl border border-cyber-blue-400/20">
                <h3 className="font-semibold text-gray-300 mb-2">
                  Submitted At
                </h3>
                <p className="text-white">
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
