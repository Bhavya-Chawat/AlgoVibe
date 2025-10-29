"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, Clock, Square } from "lucide-react";
import { motion } from "framer-motion";

interface ContestControlsProps {
  status: "pre" | "live" | "ended";
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;  // Add onStop prop
  onReset: () => Promise<void>;
  timeRemaining: number;
  onTimeUpdate: (timeRemaining: number) => void;
}

export default function ContestControls({
  status,
  onStart,
  onStop,  // Add onStop prop
  onReset,
  timeRemaining: parentTimeRemaining,
  onTimeUpdate
}: ContestControlsProps) {
  const [contestStatus, setContestStatus] = useState(status);
  const [timeRemaining, setTimeRemaining] = useState(parentTimeRemaining);
  const [totalDuration, setTotalDuration] = useState(90 * 60); // Default 90 minutes

  useEffect(() => {
    setContestStatus(status);
  }, [status]);

  useEffect(() => {
    setTimeRemaining(parentTimeRemaining);
  }, [parentTimeRemaining]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (contestStatus === "live" && timeRemaining > 0) {
      interval = setInterval(() => {
        const newTime = timeRemaining - 1;
        setTimeRemaining(newTime);
        onTimeUpdate(newTime);
        
        if (newTime <= 0) {
          setContestStatus("ended");
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [contestStatus, timeRemaining, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStartContest = () => {
    setTotalDuration(90 * 60); // Default to 90 minutes
    setTimeRemaining(90 * 60);
    setContestStatus("live");
    onStart();
  };

  const handleStopContest = async () => {
    setContestStatus("ended");
    setTimeRemaining(0);
    await onStop();  // Call the stop function from props
  };

  const handleResetContest = () => {
    setContestStatus("pre");
    const seconds = 90 * 60;
    setTimeRemaining(seconds);
    setTotalDuration(seconds);
    onReset();
  };

  const getTimeElapsed = (): string => {
    const elapsed = totalDuration - timeRemaining;
    return formatTime(elapsed);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-400">
              Contest Status
            </h3>
            <Clock className="w-5 h-5 text-[#1cabf2]" />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`
              w-3 h-3 rounded-full
              ${
                contestStatus === "live"
                  ? "bg-[#00ff41] animate-pulse"
                  : "bg-gray-500"
              }
            `}
            />
            <span className="text-lg font-bold text-white">
              {contestStatus === "live"
                ? "Live"
                : contestStatus === "ended"
                ? "Ended"
                : "Not Started"}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-400">
              Time Remaining
            </h3>
            <Clock className="w-5 h-5 text-[#1cabf2]" />
          </div>
          <div
            className={`text-3xl font-bold ${
              contestStatus === "pre" ? "text-gray-500" : "text-[#1cabf2]"
            }`}
          >
            {contestStatus === "pre" ? "--:--:--" : formatTime(timeRemaining)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-400">
              Total Duration
            </h3>
            <Clock className="w-5 h-5 text-[#1cabf2]" />
          </div>
          <div className="text-3xl font-bold text-[#1cabf2]">90:00</div>
          <div className="text-xs text-gray-400 mt-1">minutes</div>
        </motion.div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative overflow-hidden rounded-2xl p-6 border-2
          ${
            contestStatus === "live"
              ? "bg-gradient-to-r from-[#00ff41]/10 to-[#00ff41]/5 border-[#00ff41]/40"
              : "bg-gradient-to-r from-[#1cabf2]/10 to-[#1cabf2]/5 border-[#1cabf2]/40"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`
              w-4 h-4 rounded-full
              ${
                contestStatus === "live"
                  ? "bg-[#00ff41] animate-pulse"
                  : "bg-gray-500"
              }
            `}
            />
            <div>
              <h3 className="text-2xl font-bold text-white">
                {contestStatus === "live"
                  ? "Contest is LIVE"
                  : contestStatus === "ended"
                  ? "Contest ENDED"
                  : "Contest Not Started"}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {contestStatus === "live"
                  ? "All teams can submit solutions"
                  : contestStatus === "ended"
                  ? "Contest has concluded"
                  : "Ready to begin"}
              </p>
            </div>
          </div>
          
          {contestStatus !== "pre" && (
            <div className="text-right">
              <div className="text-3xl font-bold text-[#1cabf2]">
                {getTimeElapsed()}
              </div>
              <div className="text-xs text-gray-400">Time Elapsed</div>
            </div>
          )}
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
          {/* Start Button */}
          {contestStatus === "pre" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartContest}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00ff41] to-[#00ff41]/80 rounded-xl font-bold text-[#000000] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
            >
              <Play className="w-5 h-5" />
              Start Contest
            </motion.button>
          )}

          {/* Stop Button */}
          {contestStatus === "live" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStopContest}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#ff0055] to-[#ff0055]/80 rounded-xl font-bold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,85,0.4)]"
            >
              <Square className="w-5 h-5" />
              Stop Contest
            </motion.button>
          )}

          {/* Reset Button */}
          {contestStatus !== "pre" && (
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
        </div>
      </motion.div>
    </div>
  );
}