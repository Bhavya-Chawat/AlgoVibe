"use client";

import { useState, useEffect } from "react";
import { Users, Code, Trophy, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import LiveStats from "@/components/admin/LiveStats";
import SubmissionMonitor from"@/components/admin/SubmissionMonitor";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeSubmissions: 0,
    contestStatus: "live",
    timeRemaining: "02:45:30",
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Teams",
      value: stats.totalTeams || 48,
      icon: Users,
      color: "cyber-blue-400",
      bgGradient: "from-cyber-blue-400/20 to-neon-blue/20",
      change: "+12%",
    },
    {
      title: "Active Submissions",
      value: stats.activeSubmissions || 156,
      icon: Code,
      color: "electric-cyan",
      bgGradient: "from-electric-cyan/20 to-neon-blue/20",
      change: "+8%",
    },
    {
      title: "Contest Status",
      value: stats.contestStatus === "live" ? "Live" : "Ended",
      icon: Trophy,
      color: "matrix-green",
      bgGradient: "from-matrix-green/20 to-electric-cyan/20",
      change: "Active",
    },
    {
      title: "Time Remaining",
      value: stats.timeRemaining || "02:45:30",
      icon: Clock,
      color: "warning-orange",
      bgGradient: "from-warning-orange/20 to-alert-red/20",
      change: "30.5%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Monitor and manage AlgoVibe 2025 contest in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 glass-panel-strong border border-matrix-green/30 rounded-lg">
          <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-matrix-green">System Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-panel-strong p-6 rounded-2xl border border-${card.color}/20 hover:border-${card.color}/40 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${card.bgGradient} rounded-xl`}>
                  <Icon className={`w-6 h-6 text-${card.color}`} />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-400">
                    {card.change}
                  </span>
                </div>
              </div>
              
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                {card.title}
              </h3>
              <p className={`text-3xl font-bold text-${card.color} group-hover:scale-105 transition-transform`}>
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Stats - Takes 2 columns */}
        <div className="lg:col-span-2">
          <LiveStats status={stats.contestStatus as "pre" | "live" | "paused" | "ended"} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
          >
            <h3 className="text-xl font-bold text-gradient mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-gradient-to-r from-matrix-green/20 to-electric-cyan/20 border border-matrix-green/40 text-matrix-green rounded-xl hover:border-matrix-green/60 transition-all duration-300 font-semibold text-left flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5" />
                Start Contest
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/40 text-cyber-blue-400 rounded-xl hover:border-cyber-blue-400/60 transition-all duration-300 font-semibold text-left flex items-center gap-3"
              >
                <Users className="w-5 h-5" />
                View All Teams
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 glass-panel border border-warning-orange/40 text-warning-orange rounded-xl hover:border-warning-orange/60 transition-all duration-300 font-semibold text-left flex items-center gap-3"
              >
                <TrendingUp className="w-5 h-5" />
                View Analytics
              </motion.button>
            </div>
          </motion.div>

          {/* Contest Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
          >
            <h3 className="text-xl font-bold text-gradient mb-4">
              Contest Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-cyber-blue-400 font-semibold">90 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Start Time:</span>
                <span className="text-gray-200 font-semibold">10:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">End Time:</span>
                <span className="text-gray-200 font-semibold">11:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Problems:</span>
                <span className="text-neon-blue font-semibold">1</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Submission Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SubmissionMonitor />
      </motion.div>
    </div>
  );
}