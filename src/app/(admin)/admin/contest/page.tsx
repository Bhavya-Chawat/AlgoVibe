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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContestStatus();
  }, []);

  const fetchContestStatus = async () => {
    try {
      setLoading(true);
      const result = await getContestStatus();
      if (result.success) {
        const contest = result.data;
        setContestStatus(contest.is_active ? "live" : (contest.start_time && !contest.end_time ? "paused" : "pre"));
        setDurationMinutes(contest.duration_minutes || 90);
        
        if (contest.start_time) {
          setStartTime(new Date(contest.start_time));
        }
        
        if (contest.end_time) {
          setEndTime(new Date(contest.end_time));
          // Calculate remaining time
          const now = new Date();
          const end = new Date(contest.end_time);
          if (end > now && contest.is_active) {
            const remaining = Math.floor((end.getTime() - now.getTime()) / 1000);
            setTimeRemaining(remaining);
          } else {
            // Contest has ended or is not active
            if (!contest.is_active && contest.start_time && !contest.end_time) {
              setContestStatus("paused");
            } else {
              setContestStatus("ended");
            }
            setTimeRemaining(0);
          }
        } else {
          // Contest is active but no end time set, use duration
          if (contest.is_active && contest.start_time) {
            const start = new Date(contest.start_time);
            const end = new Date(start.getTime() + (contest.duration_minutes || 90) * 60 * 1000);
            const now = new Date();
            if (end > now) {
              const remaining = Math.floor((end.getTime() - now.getTime()) / 1000);
              setTimeRemaining(remaining);
            } else {
              setContestStatus("ended");
              setTimeRemaining(0);
            }
          }
        }
      } else {
        console.error("Failed to fetch contest status:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch contest status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartContest = async (duration: number) => {
    try {
      const result = await startContest(duration);
      if (result.success) {
        setContestStatus("live");
        setDurationMinutes(duration);
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
        setStartTime(startTime);
        setEndTime(endTime);
        setTimeRemaining(duration * 60);
        // Refresh the status to ensure sync with database
        setTimeout(fetchContestStatus, 500);
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
        // Refresh the status to ensure sync with database
        setTimeout(fetchContestStatus, 500);
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
        setTimeRemaining(0);
        setEndTime(new Date());
        // Refresh the status to ensure sync with database
        setTimeout(fetchContestStatus, 500);
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
        // Refresh the status to ensure sync with database
        setTimeout(fetchContestStatus, 500);
      } else {
        console.error("Failed to reset contest:", result.error);
      }
    } catch (error) {
      console.error("Failed to reset contest:", error);
    }
  };

  const handleTimeUpdate = (newTimeRemaining: number) => {
    setTimeRemaining(newTimeRemaining);
    
    // If time is up, update contest status
    if (newTimeRemaining <= 0) {
      setContestStatus("ended");
      // Refresh the status to ensure sync with database
      setTimeout(fetchContestStatus, 500);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Contest Controls
          </h1>
          <p className="text-gray-400">
            Loading contest status...
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-matrix-green"></div>
        </div>
      </div>
    );
  }

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
        durationMinutes={durationMinutes}
        timeRemaining={timeRemaining}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Live Stats Component */}
      <LiveStats status={contestStatus} />
    </div>
  );
}