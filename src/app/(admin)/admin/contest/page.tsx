"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, StopCircle, RotateCcw, Clock, Users, FileCode } from "lucide-react";
import ContestControls from "@/components/admin/ContestControls";
import LiveStats from "@/components/admin/LiveStats";

// Add type for contest status
type ContestStatus = "pre" | "live" | "paused" | "ended";

export default function AdminContestPage() {
  const [contestStatus, setContestStatus] = useState<ContestStatus>("pre");
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    fetchContestStatus();
  }, []);

  useEffect(() => {
    if (contestStatus === "live") {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setContestStatus("ended");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [contestStatus]);

  const fetchContestStatus = async () => {
    try {
      const response = await fetch("/api/admin/contest/status");
      const data = await response.json();
      setContestStatus(data.status || "pre");
      setTimeRemaining(data.timeRemaining || 90 * 60);
      setStartTime(data.startTime ? new Date(data.startTime) : null);
      setEndTime(data.endTime ? new Date(data.endTime) : null);
    } catch (error) {
      console.error("Failed to fetch contest status:", error);
    }
  };

  const handleStartContest = async () => {
    try {
      await fetch("/api/admin/contest/start", { method: "POST" });
      setContestStatus("live");
      setStartTime(new Date());
      setEndTime(new Date(Date.now() + 90 * 60 * 1000));
    } catch (error) {
      console.error("Failed to start contest:", error);
    }
  };

  const handlePauseContest = async () => {
    try {
      await fetch("/api/admin/contest/pause", { method: "POST" });
      setContestStatus("paused");
    } catch (error) {
      console.error("Failed to pause contest:", error);
    }
  };

  const handleStopContest = async () => {
    try {
      await fetch("/api/admin/contest/stop", { method: "POST" });
      setContestStatus("ended");
    } catch (error) {
      console.error("Failed to stop contest:", error);
    }
  };

  const handleResetContest = async () => {
    if (!confirm("Are you sure you want to reset the contest? This will delete all submissions.")) {
      return;
    }
    
    try {
      await fetch("/api/admin/contest/reset", { method: "POST" });
      setContestStatus("pre");
      setTimeRemaining(90 * 60);
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      console.error("Failed to reset contest:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getStatusConfig = () => {
    switch (contestStatus) {
      case "pre":
        return {
          label: "Not Started",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
        };
      case "live":
        return {
          label: "Live",
          color: "text-matrix-green",
          bgColor: "bg-matrix-green/10",
          borderColor: "border-matrix-green/30",
        };
      case "paused":
        return {
          label: "Paused",
          color: "text-warning-orange",
          bgColor: "bg-warning-orange/10",
          borderColor: "border-warning-orange/30",
        };
      case "ended":
        return {
          label: "Ended",
          color: "text-alert-red",
          bgColor: "bg-alert-red/10",
          borderColor: "border-alert-red/30",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Contest Controls
        </h1>
        <p className="text-gray-400">
          Start, pause, or stop the contest and monitor its progress
        </p>
      </div>

      {/* Status Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel-strong p-6 rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">Contest Status</h3>
            <Clock className="w-5 h-5 text-cyber-blue-400" />
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.bgColor.replace('/10', '')} animate-pulse`} />
            <span className={`font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </motion.div>

        {/* Time Remaining Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel-strong p-6 rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">Time Remaining</h3>
            <Clock className="w-5 h-5 text-cyber-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gradient">
            {formatTime(timeRemaining)}
          </div>
        </motion.div>

        {/* Duration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel-strong p-6 rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">Total Duration</h3>
            <Clock className="w-5 h-5 text-cyber-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gradient">
            90:00
          </div>
          <p className="text-sm text-gray-400 mt-2">minutes</p>
        </motion.div>
      </div>

      {/* Contest Controls Component */}
      <ContestControls
        status={contestStatus}
        onStart={handleStartContest}
        onPause={handlePauseContest}
        onStop={handleStopContest}
        onReset={handleResetContest}
      />

      {/* Live Stats Component */}
      <LiveStats status={contestStatus} />
    </div>
  );
}