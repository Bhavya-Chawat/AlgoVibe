"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CompactTimerProps {
    status: "upcoming" | "live" | "ended";
    duration: number; // in minutes
}

export default function CompactTimer({ status, duration }: CompactTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [initialDuration] = useState(duration * 60); // Convert minutes to seconds

    useEffect(() => {
        // For a simple countdown timer, we start from the full duration
        const calculateTimeLeft = () => {
            // Since we want a simple countdown, we'll just count down from the duration
            // This will be a fixed 2-hour timer when duration is 120 minutes
            const totalSeconds = initialDuration;
            return {
                hours: Math.floor(totalSeconds / 3600),
                minutes: Math.floor((totalSeconds % 3600) / 60),
                seconds: totalSeconds % 60
            };
        };

        // Set initial time
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds;
                if (totalSeconds <= 0) {
                    clearInterval(timer);
                    return { hours: 0, minutes: 0, seconds: 0 };
                }

                const newTotalSeconds = totalSeconds - 1;
                return {
                    hours: Math.floor(newTotalSeconds / 3600),
                    minutes: Math.floor((newTotalSeconds % 3600) / 60),
                    seconds: newTotalSeconds % 60
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [initialDuration]);

    // Determine urgency level
    const getUrgencyColor = () => {
        const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
        if (totalSeconds > 1800) return "text-matrix-green"; // > 30 min
        if (totalSeconds > 600) return "text-warning-orange"; // > 10 min
        return "text-alert-red"; // < 10 min
    };

    const getStatusConfig = () => {
        return {
            label: "TIME LEFT",
            color: "text-matrix-green",
            indicator: "bg-matrix-green animate-pulse",
        };
    };

    const statusConfig = getStatusConfig();

    // Calculate progress percentage
    const progressPercentage = (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / initialDuration * 100;

    return (
        <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/30">
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className={`w-2 h-2 rounded-full ${statusConfig.indicator}`}
                    />
                    <span className={`text-xs font-bold ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>
                </div>
                <span className={`text-xs font-bold ${getUrgencyColor()}`}>
                    {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                </span>
            </div>

            <div className="w-full bg-hack-navy/50 rounded-full h-2">
                <motion.div
                    className={`h-2 rounded-full ${getUrgencyColor().replace('text', 'bg')}`}
                    initial={{ width: "100%" }}
                    animate={{
                        width: `${progressPercentage}%`
                    }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}