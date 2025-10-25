"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Code, Clock, Activity, Award, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
  color: string;
}

interface LiveStatsProps {
  status: "pre" | "live" | "paused" | "ended";
}

export default function LiveStats({ status }: LiveStatsProps) {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats: StatCard[] = [
    {
      title: "Active Teams",
      value: "42",
      change: "+8",
      trend: "up",
      icon: Users,
      color: "#1cabf2"
    },
    {
      title: "Total Submissions",
      value: "287",
      change: "+23",
      trend: "up",
      icon: Code,
      color: "#00ff41"
    }
  ];

  const recentActivity = [
    { team: "CodeNinjas", action: "Submitted Code Solution", time: "2 min ago", status: "success" },
    { team: "ByteBuilders", action: "Submitted GitHub Link", time: "5 min ago", status: "success" },
    { team: "AlgoMasters", action: "Failed Test Case", time: "8 min ago", status: "error" },
    { team: "DevDynamos", action: "Submitted Deployment", time: "12 min ago", status: "success" },
    { team: "CodeCrafters", action: "Submitted Code Solution", time: "15 min ago", status: "pending" }
  ];

  const topPerformers = [
    { rank: 1, team: "CodeNinjas", score: 450, submissions: 12, badge: "🥇" },
    { rank: 2, team: "ByteBuilders", score: 420, submissions: 10, badge: "🥈" },
    { rank: 3, team: "DevDynamos", score: 400, submissions: 15, badge: "🥉" },
    { rank: 4, team: "AlgoMasters", score: 380, submissions: 8, badge: "" },
    { rank: 5, team: "CodeCrafters", score: 350, submissions: 9, badge: "" }
  ];

  const statusColors = {
    success: { bg: "bg-[#00ff41]/10", text: "text-[#00ff41]", dot: "bg-[#00ff41]" },
    error: { bg: "bg-[#ff0055]/10", text: "text-[#ff0055]", dot: "bg-[#ff0055]" },
    pending: { bg: "bg-[#ff6b35]/10", text: "text-[#ff6b35]", dot: "bg-[#ff6b35]" }
  };

  return (
    <div className="space-y-6">
      {/* Live Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#00ff41]/10 border border-[#00ff41]/40 rounded-full">
            <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-[#00ff41]">LIVE</span>
          </div>
          <span className="text-sm text-gray-400">
            Updated {Math.floor((Date.now() - lastUpdate) / 1000)}s ago
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          Real-time monitoring active
        </div>
      </motion.div>

      {/* Stats Grid - Only 2 cards now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#1cabf2]" />
              Recent Activity
            </h3>
            <span className="text-xs text-gray-400">Last 30 minutes</span>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-[#0a0a1f] border border-[#1cabf2]/10 rounded-xl hover:border-[#1cabf2]/30 transition-all duration-300"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${statusColors[activity.status as keyof typeof statusColors].dot} animate-pulse`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{activity.team}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[activity.status as keyof typeof statusColors].bg} ${statusColors[activity.status as keyof typeof statusColors].text}`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{activity.action}</div>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-[#1cabf2] hover:text-[#00d9ff] font-semibold transition-colors duration-300">
            View All Activity →
          </button>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#1cabf2]" />
              Top Performers
            </h3>
            <span className="text-xs text-gray-400">Current standings</span>
          </div>

          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  performer.rank <= 3 
                    ? "bg-gradient-to-r from-[#1cabf2]/20 to-[#1cabf2]/5 border-[#1cabf2]/40" 
                    : "bg-[#0a0a1f] border-[#1cabf2]/10 hover:border-[#1cabf2]/30"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-[#1cabf2]/20 rounded-lg font-bold text-[#1cabf2]">
                  {performer.badge || performer.rank}
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{performer.team}</div>
                  <div className="text-xs text-gray-400">{performer.submissions} submissions</div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-[#1cabf2]">{performer.score}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-[#1cabf2] hover:text-[#00d9ff] font-semibold transition-colors duration-300">
            View Full Leaderboard →
          </button>
        </motion.div>
      </div>
    </div>
  );
}