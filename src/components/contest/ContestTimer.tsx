"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/modern-ui/src/components/ui/Card";
import { motion } from "framer-motion";

interface ContestTimerProps {
  status: "upcoming" | "live" | "ended";
  duration: number; // in minutes
}

export default function ContestTimer({ status, duration }: ContestTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set the contest start date: October 30, 2025 at 2:30 PM IST
    // IST is UTC+5:30
    const contestStartDate = new Date("2025-10-30T14:30:00+05:30");
    
    // Contest end date is start date + duration
    const contestEndDate = new Date(contestStartDate.getTime() + duration * 60 * 1000);

    const calculateTimeLeft = () => {
      const now = new Date();
      
      // If contest hasn't started yet, count down to start
      if (now < contestStartDate) {
        const difference = contestStartDate.getTime() - now.getTime();
        return {
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
      
      // If contest is live, count down to end
      if (now < contestEndDate) {
        const difference = contestEndDate.getTime() - now.getTime();
        return {
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
      
      // Contest has ended
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [status, duration]);

  // Determine urgency level
  const getUrgencyColor = () => {
    const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
    if (totalSeconds > 1800) return "text-matrix-green"; // > 30 min
    if (totalSeconds > 600) return "text-warning-orange"; // > 10 min
    return "text-alert-red"; // < 10 min
  };

  const getStatusConfig = () => {
    const now = new Date();
    const contestStartDate = new Date("2025-10-30T14:30:00+05:30");
    const contestEndDate = new Date(contestStartDate.getTime() + duration * 60 * 1000);
    
    if (now < contestStartDate) {
      return {
        label: "CONTEST STARTS IN",
        color: "text-gray-400",
        indicator: "bg-gray-500",
      };
    } else if (now < contestEndDate) {
      return {
        label: "CONTEST LIVE",
        color: "text-matrix-green",
        indicator: "bg-matrix-green animate-pulse",
      };
    } else {
      return {
        label: "CONTEST ENDED",
        color: "text-alert-red",
        indicator: "bg-alert-red",
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="sticky top-0 z-50 w-full px-6 py-4">
      <Card glow className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
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
            <CardTitle className="text-center text-2xl md:text-3xl">
              {statusConfig.label}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-6 md:space-x-12">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-hack-navy/50 backdrop-blur-md border border-cyber-blue-400/20 rounded-xl flex items-center justify-center hover:border-cyber-blue-400/50 transition-all duration-300 shadow-lg">
                  <div className={`text-3xl md:text-5xl font-bold ${getUrgencyColor()} tabular-nums`}>
                    {value.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="mt-4 text-lg md:text-xl text-gray-400 capitalize">
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}