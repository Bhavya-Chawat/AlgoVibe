"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PreContestCountdown from "@/components/dashboard/PreContestCountdown";
import TeamDetailsCard from "@/components/dashboard/TeamDetailsCard";
import ContestInfoSection from "@/components/dashboard/ContestInfoSection";

export default function Page() {
    // Sample team data - in a real app this would come from props or API
    const teamData = {
        teamName: "Algorithm Avengers",
        teamMembers: [
            {
                id: "1",
                name: "Alex Johnson",
                role: "Leader" as const,
                email: "alex.johnson@rvce.edu.in",
                phone: "9876543210",
                section: "A",
                github: "https://github.com/alexjohnson",
                linkedin: "https://linkedin.com/in/alexjohnson"
            },
            {
                id: "2",
                name: "Taylor Smith",
                role: "Member" as const,
                email: "taylor.smith@rvce.edu.in",
                phone: "8765432109",
                section: "A",
                github: "https://github.com/taysmith",
                linkedin: "https://linkedin.com/in/taysmith"
            },
            {
                id: "3",
                name: "Jordan Williams",
                role: "Member" as const,
                email: "jordan.williams@rvce.edu.in",
                phone: "7654321098",
                section: "B",
                github: "https://github.com/jorwilliams",
                linkedin: "https://linkedin.com/in/jorwilliams"
            }
        ]
    };

    const [glitchText, setGlitchText] = useState("ALGOVIBE 2025");

    // Implement glitch effect similar to login page
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            const chars = "!@#$%^&*(){}[]<>?/~`";
            const original = "ALGOVIBE 2025";
            const glitched = original
                .split("")
                .map((char) => {
                    if (Math.random() > 0.90 && char !== " ") {
                        return chars[Math.floor(Math.random() * chars.length)];
                    }
                    return char;
                })
                .join("");

            setGlitchText(glitched);
            setTimeout(() => setGlitchText(original), 30);
        }, 1500);

        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <div className="relative min-h-screen bg-hack-black">
            {/* Background Grid Overlay - More visible implementation */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    opacity: 0.2,
                    backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px'
                }}
            ></div>

            {/* Content */}
            <div className="relative z-10">
                <Header />

                <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
                    <div className="w-full max-w-6xl">
                        {/* Title Section */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue-400 to-teal-400 glitch-text">
                                {glitchText}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400">
                                Get ready for the ultimate algorithmic visualization challenge
                            </p>
                            <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent"></div>
                        </div>

                        {/* Countdown Component - Made bigger */}
                        <div className="mb-12">
                            <PreContestCountdown />
                        </div>

                        {/* Team Details Card - Made smaller */}
                        <div className="max-w-4xl mx-auto mb-12">
                            <TeamDetailsCard
                                teamName={teamData.teamName}
                                teamMembers={teamData.teamMembers}
                            />
                        </div>

                        {/* Contest Information Section */}
                        <div className="max-w-6xl mx-auto">
                            <ContestInfoSection />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}