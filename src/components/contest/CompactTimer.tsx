"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CompactTimerProps {
  status: "upcoming" | "live" | "ended";
  startTimeISO?: string | null; // optional test override start time
  endTimeISO?: string | null; // optional test override end time
}

export default function CompactTimer({
  status,
  startTimeISO,
  endTimeISO,
}: CompactTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Use provided test times or fallback to hardcoded times (Oct 30, 3 PM to 4:30 PM IST in UTC)
  const effectiveStartTimeISO = startTimeISO ?? "2025-10-30T09:30:00Z";
  const effectiveEndTimeISO = endTimeISO ?? "2025-10-30T11:00:00Z";

  useEffect(() => {
    if (!effectiveStartTimeISO || !effectiveEndTimeISO) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const startTime = new Date(effectiveStartTimeISO);
    const endTime = new Date(effectiveEndTimeISO);

    const updateTimer = () => {
      const now = new Date();

      if (now < startTime) {
        const diff = startTime.getTime() - now.getTime();
        if (diff <= 0) {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        setTimeLeft({
          hours: Math.floor(diff / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else if (now >= startTime && now <= endTime) {
        const diff = endTime.getTime() - now.getTime();
        if (diff <= 0) {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        setTimeLeft({
          hours: Math.floor(diff / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [effectiveStartTimeISO, effectiveEndTimeISO]);

  const totalSeconds =
    timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const totalDurationSeconds =
    (new Date(effectiveEndTimeISO).getTime() -
      new Date(effectiveStartTimeISO).getTime()) /
    1000;

  const getUrgencyColor = () =>
    totalSeconds > 1800
      ? "text-matrix-green"
      : totalSeconds > 600
      ? "text-warning-orange"
      : "text-alert-red animate-pulse";

  const getStatusConfig = () => {
    const now = new Date();
    const startTime = new Date(effectiveStartTimeISO);
    const endTime = new Date(effectiveEndTimeISO);

    if (now < startTime) {
      return {
        label: "CONTEST STARTS IN",
        color: "text-gray-400",
        indicator: "bg-gray-500",
      };
    }
    if (now >= startTime && now <= endTime) {
      return {
        label: "CONTEST LIVE",
        color: "text-matrix-green",
        indicator: "bg-matrix-green animate-pulse",
      };
    }
    return {
      label: "CONTEST ENDED",
      color: "text-alert-red",
      indicator: "bg-alert-red",
    };
  };

  const statusConfig = getStatusConfig();

  const progressPercentage =
    totalDurationSeconds === 0
      ? 0
      : (totalSeconds / totalDurationSeconds) * 100;

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/30 w-full mx-auto">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-2 h-2 rounded-full ${statusConfig.indicator}`}
          />
          <span className={`text-xs font-bold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
        <span className={`text-xs font-bold ${getUrgencyColor()}`}>
          {timeLeft.hours.toString().padStart(2, "0")}:
          {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="w-full bg-hack-navy/50 rounded-full h-2 transition-all duration-500">
        <motion.div
          className={`h-2 rounded-full ${getUrgencyColor().replace(
            "text",
            "bg"
          )}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
