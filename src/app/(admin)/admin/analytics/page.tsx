"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Code,
  Trophy,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Calendar,
  Github,
  Globe,
  Zap
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - replace with real API calls
  const stats = {
    totalSubmissions: 342,
    activeTeams: 28,
    codeSubmissions: 156,
    githubSubmissions: 98,
    deploymentSubmissions: 88,
    pendingEvaluations: 12
  };

  const submissionTrend = [
    { time: "00:00", code: 12, github: 8, deploy: 5 },
    { time: "04:00", code: 18, github: 12, deploy: 9 },
    { time: "08:00", code: 25, github: 18, deploy: 14 },
    { time: "12:00", code: 42, github: 28, deploy: 22 },
    { time: "16:00", code: 35, github: 22, deploy: 18 },
    { time: "20:00", code: 24, github: 10, deploy: 20 }
  ];

  const topTeams = [
    { rank: 1, name: "CodeNinjas", score: 450, submissions: 18, lastActive: "2m ago" },
    { rank: 2, name: "AlgoMasters", score: 420, submissions: 16, lastActive: "5m ago" },
    { rank: 3, name: "ByteBreakers", score: 400, submissions: 15, lastActive: "8m ago" },
    { rank: 4, name: "DevDynamos", score: 380, submissions: 14, lastActive: "12m ago" },
    { rank: 5, name: "CodeCrafters", score: 350, submissions: 13, lastActive: "15m ago" }
  ];

  const recentActivity = [
    { team: "CodeNinjas", action: "Code Submission", status: "success", time: "2m ago" },
    { team: "AlgoMasters", action: "Deployment", status: "success", time: "5m ago" },
    { team: "ByteBreakers", action: "GitHub Link", status: "pending", time: "8m ago" },
    { team: "DevDynamos", action: "Code Submission", status: "failed", time: "10m ago" },
    { team: "CodeCrafters", action: "Deployment", status: "success", time: "12m ago" }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    console.log("Exporting analytics data...");
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Contest Analytics
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-matrix-green animate-pulse" />
              Real-time performance insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 glass-panel border border-cyber-blue-400/30 hover:border-cyber-blue-400 rounded-lg transition-all duration-300"
            >
              <RefreshCw className={`w-5 h-5 text-cyber-blue-400 ${isRefreshing ? "animate-spin" : ""}`} />
            </motion.button>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="px-4 py-2 bg-gradient-to-r from-cyber-blue-400 to-neon-blue hover:from-cyber-blue-500 hover:to-neon-blue text-hack-black font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid - Only 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-strong p-6 rounded-xl border border-cyber-blue-400/20 hover:border-cyber-blue-400/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyber-blue-400/10 rounded-lg">
              <Code className="w-6 h-6 text-cyber-blue-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gradient mb-1">
            {stats.totalSubmissions}
          </h3>
          <p className="text-sm text-gray-400">Total Submissions</p>
        </motion.div>

        {/* Active Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel-strong p-6 rounded-xl border border-cyber-blue-400/20 hover:border-cyber-blue-400/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-neon-blue/10 rounded-lg">
              <Users className="w-6 h-6 text-neon-blue" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gradient mb-1">
            {stats.activeTeams}
          </h3>
          <p className="text-sm text-gray-400">Active Teams</p>
        </motion.div>
      </div>

      {/* Submission Breakdown & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Submission Types Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel-strong p-6 rounded-xl border border-cyber-blue-400/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-200">Submission Types</h3>
            <PieChart className="w-5 h-5 text-cyber-blue-400" />
          </div>

          <div className="space-y-4">
            {/* Code Submissions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyber-blue-400" />
                  <span className="text-sm text-gray-300">Code</span>
                </div>
                <span className="text-sm font-semibold text-cyber-blue-400">
                  {stats.codeSubmissions}
                </span>
              </div>
              <div className="h-2 bg-hack-deep rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-cyber-blue-400 to-neon-blue"
                />
              </div>
            </div>

            {/* GitHub Submissions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-matrix-green" />
                  <span className="text-sm text-gray-300">GitHub</span>
                </div>
                <span className="text-sm font-semibold text-matrix-green">
                  {stats.githubSubmissions}
                </span>
              </div>
              <div className="h-2 bg-hack-deep rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "29%" }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-matrix-green to-electric-cyan"
                />
              </div>
            </div>

            {/* Deployment Submissions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-warning-orange" />
                  <span className="text-sm text-gray-300">Deployment</span>
                </div>
                <span className="text-sm font-semibold text-warning-orange">
                  {stats.deploymentSubmissions}
                </span>
              </div>
              <div className="h-2 bg-hack-deep rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "26%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-warning-orange to-alert-red"
                />
              </div>
            </div>
          </div>

          {/* Pending Evaluations */}
          <div className="mt-6 pt-6 border-t border-cyber-blue-400/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Pending Evaluations</span>
              <span className="px-3 py-1 bg-warning-orange/10 text-warning-orange text-sm font-semibold rounded-full">
                {stats.pendingEvaluations}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Submission Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass-panel-strong p-6 rounded-xl border border-cyber-blue-400/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-200">Submission Trends</h3>
            <LineChart className="w-5 h-5 text-cyber-blue-400" />
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-6">
            {submissionTrend.map((data, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-400 w-12">{data.time}</span>
                  <div className="flex-1 flex gap-1">
                    {/* Code bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.code / 50) * 100}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-8 bg-gradient-to-r from-cyber-blue-400 to-neon-blue rounded-l"
                      title={`Code: ${data.code}`}
                    />
                    {/* GitHub bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.github / 50) * 100}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-8 bg-gradient-to-r from-matrix-green to-electric-cyan"
                      title={`GitHub: ${data.github}`}
                    />
                    {/* Deploy bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.deploy / 50) * 100}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-8 bg-gradient-to-r from-warning-orange to-alert-red rounded-r"
                      title={`Deploy: ${data.deploy}`}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {data.code + data.github + data.deploy}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-cyber-blue-400/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-cyber-blue-400 to-neon-blue rounded-full" />
              <span className="text-xs text-gray-400">Code</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-matrix-green to-electric-cyan rounded-full" />
              <span className="text-xs text-gray-400">GitHub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-warning-orange to-alert-red rounded-full" />
              <span className="text-xs text-gray-400">Deploy</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Teams & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Teams */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel-strong p-6 rounded-xl border border-cyber-blue-400/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-200">Top Teams</h3>
            <Trophy className="w-5 h-5 text-cyber-blue-400" />
          </div>

          <div className="space-y-3">
            {topTeams.map((team, index) => (
              <motion.div
                key={team.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="glass-panel p-4 rounded-lg hover:border-cyber-blue-400/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${team.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-hack-black" :
                        team.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-hack-black" :
                        team.rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-hack-black" :
                        "bg-cyber-blue-400/20 text-cyber-blue-400"}
                    `}>
                      {team.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-200">{team.name}</p>
                      <p className="text-xs text-gray-400">
                        {team.submissions} submissions • {team.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gradient">{team.score}</p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-panel-strong p-6 rounded-xl border border-cyber-blue-400/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-200">Recent Activity</h3>
            <Activity className="w-5 h-5 text-matrix-green animate-pulse" />
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const statusConfig = {
                success: { icon: CheckCircle, color: "text-matrix-green", bg: "bg-matrix-green/10" },
                pending: { icon: Clock, color: "text-warning-orange", bg: "bg-warning-orange/10" },
                failed: { icon: XCircle, color: "text-alert-red", bg: "bg-alert-red/10" }
              };
              
              const config = statusConfig[activity.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="glass-panel p-4 rounded-lg hover:border-cyber-blue-400/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${config.bg} rounded-lg`}>
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200 text-sm">{activity.team}</p>
                        <p className="text-xs text-gray-400">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-2 glass-panel border border-cyber-blue-400/30 hover:border-cyber-blue-400 rounded-lg text-cyber-blue-400 text-sm font-semibold transition-all duration-300"
          >
            View All Activity
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}