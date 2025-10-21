"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/modern-ui/src/components/ui/Card";

const PreContestCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set the target date: October 30, 2025 at 2:30 PM IST
        // IST is UTC+5:30
        const targetDate = new Date("2025-10-30T14:30:00+05:30");

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds };
        };

        // Calculate initial time
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Card glow className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Contest Countdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center space-x-4 md:space-x-8">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-hack-navy/50 backdrop-blur-md border border-cyber-blue-400/20 rounded-xl flex items-center justify-center hover:border-cyber-blue-400/50 transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-cyber-blue-400">
                                    {value.toString().padStart(2, '0')}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-400 capitalize">
                                {unit}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <p className="text-cyber-blue-400 font-semibold text-lg">October 30, 2025 at 2:30 PM IST</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PreContestCountdown;