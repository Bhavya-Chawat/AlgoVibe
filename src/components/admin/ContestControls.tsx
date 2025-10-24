"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Clock, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ContestControlsProps {
  status: "pre" | "live" | "paused" | "ended";
  onStart: () => Promise<void>;
  onPause: () => Promise<void>;
  onStop: () => Promise<void>;
  onReset: () => Promise<void>;
}

export default function ContestControls({
  status,
  onStart,
  onPause,
  onStop,
  onReset
}: ContestControlsProps) {
  const [contestStatus, setContestStatus] = useState<"idle" | "live" | "paused">("idle");
  const [duration, setDuration] = useState("24");
  const [startTime, setStartTime] = useState("");

  const handleStartContest = () => {
    setContestStatus("live");
    onStart();
  };

  const handlePauseContest = () => {
    setContestStatus("paused");
    onPause();
  };

  const handleResetContest = () => {
    setContestStatus("idle");
    onReset();
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative overflow-hidden rounded-2xl p-6 border-2
          ${contestStatus === "live" 
            ? "bg-gradient-to-r from-[#00ff41]/10 to-[#00ff41]/5 border-[#00ff41]/40" 
            : contestStatus === "paused"
            ? "bg-gradient-to-r from-[#ff6b35]/10 to-[#ff6b35]/5 border-[#ff6b35]/40"
            : "bg-gradient-to-r from-[#1cabf2]/10 to-[#1cabf2]/5 border-[#1cabf2]/40"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`
              w-4 h-4 rounded-full animate-pulse
              ${contestStatus === "live" ? "bg-[#00ff41]" : contestStatus === "paused" ? "bg-[#ff6b35]" : "bg-gray-500"}
            `} />
            <div>
              <h3 className="text-2xl font-bold text-white">
                {contestStatus === "live" ? "Contest is LIVE" : contestStatus === "paused" ? "Contest PAUSED" : "Contest Not Started"}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {contestStatus === "live" ? "All teams can submit solutions" : contestStatus === "paused" ? "Submissions temporarily disabled" : "Ready to begin"}
              </p>
            </div>
          </div>
          
          {contestStatus === "live" && (
            <div className="text-right">
              <div className="text-3xl font-bold text-[#1cabf2]">23:14:45</div>
              <div className="text-xs text-gray-400">Time Remaining</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contest Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#1cabf2]" />
            Contest Configuration
          </h3>

          <div className="space-y-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={contestStatus !== "idle"}
                className="w-full px-4 py-3 bg-[#0a0a1f] border border-[#1cabf2]/20 rounded-xl text-white focus:border-[#1cabf2]/60 focus:outline-none transition-all duration-300 disabled:opacity-50"
                placeholder="24"
              />
            </div>

            {/* Scheduled Start Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Scheduled Start Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={contestStatus !== "idle"}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a1f] border border-[#1cabf2]/20 rounded-xl text-white focus:border-[#1cabf2]/60 focus:outline-none transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Auto-start toggle */}
            <div className="flex items-center justify-between p-4 bg-[#0a0a1f] rounded-xl border border-[#1cabf2]/10">
              <div>
                <div className="font-semibold text-white">Auto-start</div>
                <div className="text-xs text-gray-400">Start at scheduled time</div>
              </div>
              <button className="relative w-14 h-7 bg-[#1cabf2]/20 rounded-full transition-colors duration-300">
                <div className="absolute left-1 top-1 w-5 h-5 bg-[#1cabf2] rounded-full transition-transform duration-300" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Control Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Control Actions</h3>

          <div className="space-y-4">
            {/* Start/Resume Button */}
            {(contestStatus === "idle" || contestStatus === "paused") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartContest}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00ff41] to-[#00ff41]/80 rounded-xl font-bold text-[#000000] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
              >
                <Play className="w-5 h-5" />
                {contestStatus === "paused" ? "Resume Contest" : "Start Contest"}
              </motion.button>
            )}

            {/* Pause Button */}
            {contestStatus === "live" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePauseContest}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#ff6b35] to-[#ff6b35]/80 rounded-xl font-bold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,53,0.4)]"
              >
                <Pause className="w-5 h-5" />
                Pause Contest
              </motion.button>
            )}

            {/* Reset Button */}
            {contestStatus !== "idle" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetContest}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-[#ff0055]/40 rounded-xl font-bold text-[#ff0055] transition-all duration-300 hover:bg-[#ff0055]/10"
              >
                <RotateCcw className="w-5 h-5" />
                Reset Contest
              </motion.button>
            )}

            {/* Warning Message */}
            <div className="mt-6 p-4 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-[#ff6b35] mb-1">Important</p>
                  <p>Starting the contest will notify all registered teams and activate the submission system.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Registered Teams", value: "45", color: "#1cabf2" },
          { label: "Active Submissions", value: "128", color: "#00ff41" },
          { label: "Average Score", value: "67%", color: "#00d9ff" },
          { label: "Time Elapsed", value: "0:45:32", color: "#ff6b35" }
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}