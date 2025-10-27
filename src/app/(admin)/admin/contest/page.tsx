"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, StopCircle, RotateCcw, Clock, Users, FileCode } from "lucide-react";
import ContestControls from "@/components/admin/ContestControls";
import LiveStats from "@/components/admin/LiveStats";
import { getContestStatus, startContest, pauseContest, stopContest, resetContest } from "../actions";

// Add type for contest status
type ContestStatus = "pre" | "live" | "paused" | "ended";

export default function AdminContestPage() {
  const [contestStatus, setContestStatus] = useState<ContestStatus>("pre");
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(90);

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
      const result = await getContestStatus();
      if (result.success) {
        const contest = result.data;
        setContestStatus(contest.is_active ? "live" : "pre");
        setDurationMinutes(contest.duration_minutes || 90);
        
        if (contest.start_time) {
          setStartTime(new Date(contest.start_time));
        }
        
        if (contest.end_time) {
          setEndTime(new Date(contest.end_time));
          // Calculate remaining time
          const now = new Date();
          const end = new Date(contest.end_time);
          if (end > now) {
            const remaining = Math.floor((end.getTime() - now.getTime()) / 1000);
            setTimeRemaining(remaining);
          }
        }
      } else {
        console.error("Failed to fetch contest status:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch contest status:", error);
    }
  };

  const handleStartContest = async () => {
    try {
      const result = await startContest(durationMinutes);
      if (result.success) {
        setContestStatus("live");
        setStartTime(new Date());
        setEndTime(new Date(Date.now() + durationMinutes * 60 * 1000));
      } else {
        console.error("Failed to start contest:", result.error);
      }
    } catch (error) {
      console.error("Failed to start contest:", error);
    }
  };

  const handlePauseContest = async () => {
    try {
      const result = await pauseContest();
      if (result.success) {
        setContestStatus("paused");
      } else {
        console.error("Failed to pause contest:", result.error);
      }
    } catch (error) {
      console.error("Failed to pause contest:", error);
    }
  };

  const handleStopContest = async () => {
    try {
      const result = await stopContest();
      if (result.success) {
        setContestStatus("ended");
      } else {
        console.error("Failed to stop contest:", result.error);
      }
    } catch (error) {
      console.error("Failed to stop contest:", error);
    }
  };

  const handleResetContest = async () => {
    if (!confirm("Are you sure you want to reset the contest? This will delete all submissions.")) {
      return;
    }
    
    try {
      const result = await resetContest();
      if (result.success) {
        setContestStatus("pre");
        setTimeRemaining(durationMinutes * 60);
        setStartTime(null);
        setEndTime(null);
      } else {
        console.error("Failed to reset contest:", result.error);
      }
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