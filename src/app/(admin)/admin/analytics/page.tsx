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
  Zap,
} from "lucide-react";
import { getAnalytics, getSubmissions, getTopPerformers } from "../actions";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeSubmissions: 0,
    acceptedSubmissions: 0,
    rejectedSubmissions: 0,
    contestStatus: "pre",
    timeRemaining: "00:00:00",
  });
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [topTeams, setTopTeams] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch analytics data
      const analyticsResult = await getAnalytics();
      if (analyticsResult.success && analyticsResult.data) {
        setStats(analyticsResult.data);
        console.log("Analytics data fetched:", analyticsResult.data);
      } else {
        console.error("Failed to fetch analytics:", analyticsResult.error);
      }

      // Fetch submissions data
      const submissionsResult = await getSubmissions();
      if (submissionsResult.success && submissionsResult.data) {
        setSubmissions(submissionsResult.data);
        console.log("Submissions data fetched:", submissionsResult.data.length);
      } else {
        console.error("Failed to fetch submissions:", submissionsResult.error);
      }

      // Fetch top performers data from scores table
      const topPerformersResult = await getTopPerformers();
      if (topPerformersResult.success && topPerformersResult.data) {
        setTopTeams(topPerformersResult.data);
        console.log("Top performers data fetched:", topPerformersResult.data);
      } else {
        console.error(
          "Failed to fetch top performers:",
          topPerformersResult.error
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Calculate submission types from actual data
  const submissionStats = {
    code: submissions.filter((s: any) => s.submission_type === "code").length,
    github: submissions.filter((s: any) => s.submission_type === "github")
      .length,
    deployment: submissions.filter(
      (s: any) => s.submission_type === "deployment"
    ).length,
    pending: submissions.filter((s: any) => s.status === "PENDING").length,
  };

  // Generate submission trend data
  const submissionTrend = [
    { time: "00:00", code: 12, github: 8, deploy: 5 },
    { time: "04:00", code: 18, github: 12, deploy: 9 },
    { time: "08:00", code: 25, github: 18, deploy: 14 },
    { time: "12:00", code: 42, github: 28, deploy: 22 },
    { time: "16:00", code: 35, github: 22, deploy: 18 },
    { time: "20:00", code: 24, github: 10, deploy: 20 },
  ];

  // Generate recent activity from submissions
  const recentActivity = submissions.slice(0, 5).map((submission: any) => {
    // Fix: More robust team name access
    let teamName = "Unknown Team";
    if (submission.team && typeof submission.team === "object") {
      if (Array.isArray(submission.team) && submission.team.length > 0) {
        teamName = submission.team[0].team_name || "Unknown Team";
      } else if (submission.team.team_name) {
        teamName = submission.team.team_name;
      }
    }

    return {
      team: teamName,
      action: `${submission.submission_type} submission`,
      status:
        submission.status === "ACCEPTED"
          ? "success"
          : submission.status === "REJECTED"
          ? "failed"
          : "pending",
      time: "Recent",
    };
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData().finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  const handleExport = () => {
    try {
      // Debug: Log the data to see what's available
      console.log("Exporting data:", {
        topTeams,
        submissionStats,
        stats,
        submissions,
      });

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add headers for top teams
      csvContent += "=== Top Performing Teams ===\n";
      csvContent += "Rank,Team Name,Total Score,Submissions Count\n";

      // Add top teams data
      if (topTeams && topTeams.length > 0) {
        topTeams.forEach((team) => {
          csvContent += `${team.rank},"${team.team}",${team.score},${team.submissions}\n`;
        });
      } else {
        csvContent += "No top teams data available\n";
      }

      // Add a blank line
      csvContent += "\n";

      // Add submission stats
      csvContent += "=== Submission Statistics ===\n";
      csvContent += "Submission Type,Count\n";
      csvContent += `Code,${submissionStats.code}\n`;
      csvContent += `GitHub,${submissionStats.github}\n`;
      csvContent += `Deployment,${submissionStats.deployment}\n`;
      csvContent += `Pending,${submissionStats.pending}\n`;

      // Add a blank line
      csvContent += "\n";

      // Add overall stats
      csvContent += "=== Overall Statistics ===\n";
      csvContent += "Metric,Value\n";
      csvContent += `"Total Teams",${stats.totalTeams}\n`;
      csvContent += `"Total Submissions",${
        stats.activeSubmissions +
        stats.acceptedSubmissions +
        stats.rejectedSubmissions
      }\n`;
      csvContent += `"Active Submissions",${stats.activeSubmissions}\n`;
      csvContent += `"Accepted Submissions",${stats.acceptedSubmissions}\n`;
      csvContent += `"Rejected Submissions",${stats.rejectedSubmissions}\n`;

      // Add a blank line
      csvContent += "\n";

      // Add recent activity
      csvContent += "=== Recent Activity ===\n";
      csvContent += "Team Name,Action,Status,Time\n";

      // Generate recent activity data
      const recentActivityData = submissions
        .slice(0, 10)
        .map((submission: any) => {
          let teamName = "Unknown Team";
          if (submission.team && typeof submission.team === "object") {
            if (Array.isArray(submission.team) && submission.team.length > 0) {
              teamName = submission.team[0].team_name || "Unknown Team";
            } else if (submission.team.team_name) {
              teamName = submission.team.team_name;
            }
          }

          let action = "";
          switch (submission.submission_type) {
            case "code":
              action = "Submitted Code Solution";
              break;
            case "github":
              action = "Submitted GitHub Link";
              break;
            case "deployment":
              action = "Submitted Deployment";
              break;
            default:
              action = "Submitted Solution";
          }

          const status = submission.status.toLowerCase();

          return {
            team: teamName,
            action,
            status,
            time: new Date(submission.submitted_at).toLocaleString(),
          };
        });

      if (recentActivityData && recentActivityData.length > 0) {
        recentActivityData.forEach((activity: any) => {
          csvContent += `"${activity.team}","${activity.action}","${activity.status}","${activity.time}"\n`;
        });
      } else {
        csvContent += "No recent activity data available\n";
      }

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `contest_analytics_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Analytics data exported successfully");
    } catch (error) {
      console.error("Failed to export analytics data:", error);
    }
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
              <RefreshCw
                className={`w-5 h-5 text-cyber-blue-400 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
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
            {stats.activeSubmissions +
              stats.acceptedSubmissions +
              stats.rejectedSubmissions}
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
            {stats.totalTeams}
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
            <h3 className="text-xl font-bold text-gray-200">
              Submission Types
            </h3>
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
                  {submissionStats.code}
                </span>
              </div>
              <div className="h-2 bg-hack-deep rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (submissionStats.code /
                        (submissionStats.code +
                          submissionStats.github +
                          submissionStats.deployment)) *
                        100 || 0
                    }%`,
                  }}
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
                  {submissionStats.github}
                </span>
              </div>
              <div className="h-2 bg-hack-deep rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (submissionStats.github /
                        (submissionStats.code +
                          submissionStats.github +
                          submissionStats.deployment)) *
                        100 || 0
                    }%`,
                  }}
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
                  {submissionStats.deployment}
                </span>
              </div>
              <div className="h-2 bg-hack-deep rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (submissionStats.deployment /
                        (submissionStats.code +
                          submissionStats.github +
                          submissionStats.deployment)) *
                        100 || 0
                    }%`,
                  }}
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
                {submissionStats.pending}
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
            <h3 className="text-xl font-bold text-gray-200">
              Submission Trends
            </h3>
            <LineChart className="w-5 h-5 text-cyber-blue-400" />
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-6">
            {submissionTrend.map((data, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-400 w-12">
                    {data.time}
                  </span>
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
            {topTeams.length > 0 ? (
              topTeams.map((team, index) => (
                <motion.div
                  key={team.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="glass-panel p-4 rounded-lg hover:border-cyber-blue-400/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${
                          team.rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-hack-black"
                            : team.rank === 2
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-hack-black"
                            : team.rank === 3
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-hack-black"
                            : "bg-cyber-blue-400/20 text-cyber-blue-400"
                        }
                      `}
                      >
                        {team.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200">
                          {team.team}
                        </p>
                        <p className="text-xs text-gray-400">
                          {team.submissions} submissions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gradient">
                        {team.score}
                      </p>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No team data available
              </div>
            )}
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const statusConfig = {
                  success: {
                    icon: CheckCircle,
                    color: "text-matrix-green",
                    bg: "bg-matrix-green/10",
                  },
                  pending: {
                    icon: Clock,
                    color: "text-warning-orange",
                    bg: "bg-warning-orange/10",
                  },
                  failed: {
                    icon: XCircle,
                    color: "text-alert-red",
                    bg: "bg-alert-red/10",
                  },
                };

                const config =
                  statusConfig[activity.status as keyof typeof statusConfig];
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
                          <p className="font-semibold text-gray-200 text-sm">
                            {activity.team}
                          </p>
                          <p className="text-xs text-gray-400">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                No recent activity
              </div>
            )}
          </div>

          <Link
            href="/admin/activity"
            className="w-full mt-4 py-2 glass-panel border border-cyber-blue-400/30 hover:border-cyber-blue-400 rounded-lg text-cyber-blue-400 text-sm font-semibold transition-all duration-300 text-center block"
          >
            View All Activity
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
