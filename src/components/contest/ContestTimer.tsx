"use client";

import { useState, useEffect } from "react";
import { Clock, Activity, CheckCircle2 } from "lucide-react";
import { ScrambledText } from "@/components/effects/react-effects-lib/src/components/effects/ScrambledText";
import { motion, AnimatePresence } from "framer-motion";

interface ContestTimerProps {
  status: "upcoming" | "live" | "ended";
  duration: number;
  startTime?: string;
}

export default function ContestTimer({ status, duration, startTime }: ContestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert minutes to seconds
  const [submissions, setSubmissions] = useState(0);
  const [lastSubmit, setLastSubmit] = useState("--");

  useEffect(() => {
    if (status !== "live") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, duration]);

  // Calculate time components
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  // Determine urgency level
  const getUrgencyColor = () => {
    if (timeRemaining > 1800) return "text-matrix-green"; // > 30 min
    if (timeRemaining > 600) return "text-warning-orange"; // > 10 min
    return "text-alert-red"; // < 10 min
  };

  const getGlowColor = () => {
    if (timeRemaining > 1800) return "shadow-[0_0_30px_rgba(0,255,65,0.4)]";
    if (timeRemaining > 600) return "shadow-[0_0_30px_rgba(255,107,53,0.4)]";
    return "shadow-[0_0_40px_rgba(255,0,85,0.6)] animate-pulse";
  };

  const getStatusConfig = () => {
    switch (status) {
      case "upcoming":
        return {
          label: "CONTEST STARTS IN",
          color: "text-gray-400",
          indicator: "bg-gray-500",
        };
      case "live":
        return {
          label: "CONTEST LIVE",
          color: "text-matrix-green",
          indicator: "bg-matrix-green animate-pulse",
        };
      case "ended":
        return {
          label: "CONTEST ENDED",
          color: "text-alert-red",
          indicator: "bg-alert-red",
        };
      default:
        return {
          label: "LOADING",
          color: "text-gray-400",
          indicator: "bg-gray-500",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-2xl bg-hack-navy/80 border-b border-cyber-blue-400/20"
    >
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Status Indicator */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-3 h-3 rounded-full ${statusConfig.indicator}`}
            />
            <span className={`font-bold text-sm tracking-wider ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Main Timer Display */}
          <div className="flex-1 flex items-center justify-center gap-4">
            <Clock className={`w-6 h-6 ${getUrgencyColor()}`} />
            
            <div className={`flex items-center gap-2 ${getGlowColor()}`}>
              <div className="glass-panel-strong px-6 py-3 rounded-lg border border-cyber-blue-400/30">
                <motion.div
                  key={hours}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-5xl font-bold ${getUrgencyColor()} tabular-nums`}
                >
                  {String(hours).padStart(2, "0")}
                </motion.div>
              </div>
              
              <span className={`text-4xl font-bold ${getUrgencyColor()}`}>:</span>
              
              <div className="glass-panel-strong px-6 py-3 rounded-lg border border-cyber-blue-400/30">
                <motion.div
                  key={minutes}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-5xl font-bold ${getUrgencyColor()} tabular-nums`}
                >
                  {String(minutes).padStart(2, "0")}
                </motion.div>
              </div>
              
              <span className={`text-4xl font-bold ${getUrgencyColor()}`}>:</span>
              
              <div className="glass-panel-strong px-6 py-3 rounded-lg border border-cyber-blue-400/30">
                <motion.div
                  key={seconds}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-5xl font-bold ${getUrgencyColor()} tabular-nums`}
                >
                  {String(seconds).padStart(2, "0")}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 text-sm min-w-[180px] justify-end">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-blue-400" />
              <span className="text-gray-400">Submissions:</span>
              <span className="text-cyber-blue-400 font-bold">{submissions}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-matrix-green" />
              <span className="text-gray-400">Last:</span>
              <span className="text-matrix-green font-bold">{lastSubmit}</span>
            </div>
          </div>
        </div>

        {/* Warning Banner (shown when < 10 min) */}
        <AnimatePresence>
          {status === "live" && timeRemaining < 600 && timeRemaining > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="glass-panel-strong border-alert-red/50 bg-alert-red/10 px-4 py-2 rounded-lg">
                <p className="text-center text-alert-red font-semibold text-sm tracking-wide">
                  ⚠️ FINAL MINUTES - SUBMIT YOUR SOLUTIONS NOW!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}