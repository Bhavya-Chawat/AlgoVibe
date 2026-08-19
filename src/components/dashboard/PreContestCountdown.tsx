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
        // Set the target date: August 20, 2025 at 12:00 PM IST
        // IST is UTC+5:30
        const targetDate = new Date("2025-08-20T12:00:00+05:30");

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
        <Card glow className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-3xl md:text-4xl">Contest Countdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center space-x-6 md:space-x-12">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-hack-navy/50 backdrop-blur-md border border-cyber-blue-400/20 rounded-xl flex items-center justify-center hover:border-cyber-blue-400/50 transition-all duration-300 shadow-lg">
                                <div className="text-3xl md:text-5xl font-bold text-gradient">
                                    {value.toString().padStart(2, '0')}
                                </div>
                            </div>
                            <div className="mt-4 text-lg md:text-xl text-gray-400 capitalize">
                                {unit}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <p className="font-semibold text-xl md:text-2xl">
                        <span className="text-gradient">August 20, 2025 at 12:00 PM IST</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PreContestCountdown;