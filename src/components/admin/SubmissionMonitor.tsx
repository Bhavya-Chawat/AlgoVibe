"use client";

import { useState } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Code, Github, Globe, Download } from "lucide-react";
import { motion } from "framer-motion";

interface Submission {
  id: string;
  team: string;
  type: "code" | "github" | "deployment";
  status: "pending" | "accepted" | "rejected" | "evaluating";
  score: number;
  submittedAt: string;
  link: string;
}

export default function SubmissionMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "code" | "github" | "deployment">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected" | "evaluating">("all");

  const submissions: Submission[] = [
    {
      id: "1",
      team: "CodeNinjas",
      type: "code",
      status: "accepted",
      score: 100,
      submittedAt: "2 min ago",
      link: "https://codeforces.com/..."
    },
    {
      id: "2",
      team: "ByteBuilders",
      type: "github",
      status: "accepted",
      score: 85,
      submittedAt: "5 min ago",
      link: "https://github.com/..."
    },
    {
      id: "3",
      team: "AlgoMasters",
      type: "code",
      status: "evaluating",
      score: 0,
      submittedAt: "8 min ago",
      link: "https://codeforces.com/..."
    },
    {
      id: "4",
      team: "DevDynamos",
      type: "deployment",
      status: "accepted",
      score: 95,
      submittedAt: "12 min ago",
      link: "https://vercel.app/..."
    },
    {
      id: "5",
      team: "CodeCrafters",
      type: "code",
      status: "rejected",
      score: 40,
      submittedAt: "15 min ago",
      link: "https://codeforces.com/..."
    },
    {
      id: "6",
      team: "TechTitans",
      type: "github",
      status: "pending",
      score: 0,
      submittedAt: "18 min ago",
      link: "https://github.com/techtitans/contest-repo"
    },
    {
      id: "7",
      team: "WebWizards",
      type: "deployment",
      status: "pending",
      score: 0,
      submittedAt: "20 min ago",
      link: "https://contest-app.vercel.app"
    }
  ];

  // Filter submissions based on search query and filters
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || submission.type === filterType;
    const matchesStatus = filterStatus === "all" || submission.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: Submission["status"]) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-matrix-green" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-alert-red" />;
      case "evaluating":
        return <Clock className="w-5 h-5 text-warning-orange animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-cyber-blue-400" />;
    }
  };

  const getSubmissionTypeIcon = (type: Submission["type"]) => {
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
        
        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="px-4 py-2 bg-hack-black border border-cyber-blue-400/20 rounded-xl text-white focus:border-cyber-blue-400/60 focus:outline-none transition-all"
          >
            <option value="all">All Types</option>
            <option value="code">Code</option>
            <option value="github">GitHub</option>
            <option value="deployment">Deployment</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 bg-hack-black border border-cyber-blue-400/20 rounded-xl text-white focus:border-cyber-blue-400/60 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="evaluating">Evaluating</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
              setFilterStatus("all");
            }}
            className="px-4 py-2 bg-hack-black border border-cyber-blue-400/20 rounded-xl text-white hover:bg-cyber-blue-400/10 transition-all"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-hack-black/50 border border-cyber-blue-400/20 rounded-xl hover:border-cyber-blue-400/40 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyber-blue-400/10 rounded-lg">
                  {getSubmissionTypeIcon(submission.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{submission.team}</h3>
                  <p className="text-sm text-gray-400">{submission.submittedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span className="text-sm font-medium capitalize">{submission.status}</span>
                </div>
                <div className="text-cyber-blue-400 font-semibold">
                  {submission.score} pts
                </div>
                <a
                  href={submission.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-cyber-blue-400/10 rounded-lg transition-all"
                >
                  <Eye className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}