"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar } from "lucide-react";

const PreContestCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date: August 20, 2026 at 12:00 PM IST
    const targetDate = new Date("2026-08-20T12:00:00+05:30");

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel-strong p-8 md:p-12 rounded-3xl border border-cyber-blue-400/30 shadow-2xl glow-card max-w-4xl mx-auto text-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyber-blue-400/10 blur-[90px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-neon-blue/10 blur-[90px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyber-blue-400/30 mb-6">
        <Sparkles className="w-4 h-4 text-cyber-blue-400" />
        <span className="text-xs md:text-sm font-extrabold text-cyber-blue-400 uppercase tracking-wide">
          Official Event Countdown
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 font-heading">
        Hackathon Launch In
      </h2>

      {/* Countdown Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center group">
            <div className="w-full aspect-square max-w-[130px] glass-panel-strong border border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover:border-cyber-blue-400/60 group-hover:scale-105 transition-all duration-300 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-cyber-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-gradient font-mono tracking-tight">
                {value.toString().padStart(2, "0")}
              </div>
            </div>
            <span className="mt-3 text-xs sm:text-sm font-extrabold text-gray-400 uppercase tracking-widest font-heading">
              {unit}
            </span>
          </div>
        ))}
      </div>

      {/* Target Timestamp Footer */}
      <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-sm text-gray-300">
        <Calendar className="w-4 h-4 text-cyber-blue-400" />
        <span>Kickoff Date:</span>
        <span className="font-extrabold text-gradient font-mono">
          August 20, 2026 at 12:00 PM IST
        </span>
      </div>
    </div>
  );
};

export default PreContestCountdown;