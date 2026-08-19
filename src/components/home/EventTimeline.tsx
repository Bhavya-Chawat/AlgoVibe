"use client";

import { useState } from "react";
import {
  Calendar,
  Trophy,
  Rocket,
  Code2,
  Utensils,
  CheckCircle,
  Clock,
} from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import BlurText from "@/components/BlurText";

const colorMap: Record<
  string,
  { text: string; bg: string; border: string; glow: string }
> = {
  "cyber-blue-400": {
    text: "text-cyber-blue-400",
    bg: "bg-cyber-blue-400/10",
    border: "border-cyber-blue-400/30",
    glow: "rgba(28, 171, 242, 0.35)",
  },
  "neon-blue": {
    text: "text-neon-blue",
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/30",
    glow: "rgba(0, 217, 255, 0.35)",
  },
  "matrix-green": {
    text: "text-matrix-green",
    bg: "bg-matrix-green/10",
    border: "border-matrix-green/30",
    glow: "rgba(0, 255, 65, 0.35)",
  },
};

export default function EventTimeline() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  const phases = [
    {
      title: "Hackathon Kickoff",
      date: "12:00 PM - 1:00 PM",
      icon: Rocket,
      colorKey: "cyber-blue-400",
      description: "Problem statement & hackathon tracks revealed. Team alignment setup.",
      highlights: [
        "Hackathon Problem Statement Revealed",
        "Team Alignment & Setup",
        "Track Briefing & Guidelines",
      ],
    },
    {
      title: "Lunch Break",
      date: "1:00 PM - 1:30 PM",
      icon: Utensils,
      colorKey: "neon-blue",
      description: "Break for lunch and networking with peers & mentors.",
      highlights: [
        "Lunch & Refreshments Provided",
        "Informal Discussions",
        "Architecture Brainstorming",
      ],
    },
    {
      title: "Building Sprint",
      date: "1:30 PM - 3:30 PM",
      icon: Code2,
      colorKey: "neon-blue",
      description: "Core hackathon development phase for coding & full-stack building.",
      highlights: [
        "Focused 2-Hour Building Sprint",
        "In-Classroom Mentor Support",
        "Deploy & Submit Web Project",
      ],
    },
    {
      title: "Judging & Demos",
      date: "3:30 PM - 4:00 PM",
      icon: Trophy,
      colorKey: "matrix-green",
      description: "Live hackathon project evaluation, demos, and winner announcements.",
      highlights: [
        "Interactive Live Demos",
        "Winner & Prize Announcements",
        "Closing & Certification",
      ],
    },
  ];

  return (
    <div>
      {/* Section Header */}
      <AnimatedContent distance={40} direction="vertical" duration={0.8}>
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-5 border border-cyber-blue-400/30">
            <Calendar className="w-4 h-4 text-cyber-blue-400" />
            <span className="text-xs md:text-sm font-semibold text-cyber-blue-400">
              Event Schedule · August 20, 2026
            </span>
          </div>

          <div className="flex justify-center mb-3">
            <BlurText
              text="August 20 Schedule"
              animateBy="words"
              delay={80}
              className="text-4xl md:text-6xl font-extrabold text-white text-center justify-center font-heading"
            />
          </div>

          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
            Your step-by-step agenda for AlgoVibe 2026 Hackathon at the ISE Department
          </p>
        </div>
      </AnimatedContent>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isHovered = hoveredPhase === index;
          const styles = colorMap[phase.colorKey] || colorMap["cyber-blue-400"];

          return (
            <AnimatedContent
              key={index}
              distance={30}
              direction="vertical"
              delay={index * 0.12}
              duration={0.8}
            >
              <div
                onMouseEnter={() => setHoveredPhase(index)}
                onMouseLeave={() => setHoveredPhase(null)}
                className="relative group h-full"
              >
                {/* Connection Line (Desktop) */}
                {index < phases.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-6 h-0.5 bg-gradient-to-r from-cyber-blue-400/50 to-transparent z-0"></div>
                )}

                {/* Phase Card */}
                <div
                  className={`glass-panel-strong p-6 md:p-7 rounded-2xl h-full transition-all duration-500 relative overflow-hidden border border-white/10 ${
                    isHovered ? "scale-105 border-cyber-blue-400/60" : ""
                  }`}
                  style={{
                    boxShadow: isHovered
                      ? `0 0 35px ${styles.glow}, 0 0 70px ${styles.glow}`
                      : "none",
                  }}
                >
                  {/* Scan Line Effect */}
                  {isHovered && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent animate-scan"></div>
                  )}

                  {/* Phase Number */}
                  <div className="absolute top-4 right-4 text-5xl font-black font-mono opacity-15 text-white">
                    0{index + 1}
                  </div>

                  {/* Icon */}
                  <div className="relative mb-5">
                    <div
                      className={`w-14 h-14 rounded-xl ${styles.bg} ${styles.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${styles.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className={`text-xl font-extrabold mb-2 ${styles.text} font-heading`}>
                    {phase.title}
                  </h3>

                  <div className="flex items-center gap-2 text-cyber-blue-400 mb-3 font-mono font-semibold text-xs md:text-sm">
                    <Clock className="w-3.5 h-3.5 text-cyber-blue-400" />
                    <span>{phase.date}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">{phase.description}</p>

                  {/* Highlights */}
                  <div className="space-y-2.5">
                    {phase.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-gray-300 group/item"
                      >
                        <CheckCircle
                          className={`w-3.5 h-3.5 ${styles.text} mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform`}
                        />
                        <span className="group-hover/item:text-white transition-colors">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedContent>
          );
        })}
      </div>

      {/* Launch Indicator */}
      <AnimatedContent distance={30} direction="vertical" delay={0.5} duration={0.8}>
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-3 glass-panel px-6 py-3.5 rounded-full border border-cyber-blue-400/40">
            <Rocket className="w-5 h-5 text-cyber-blue-400 animate-bounce" />
            <span className="text-sm font-medium text-gray-200">
              <span className="font-bold text-cyber-blue-400">
                August 20, 2026
              </span>{" "}
              · 12:00 PM Kickoff at ISE Department
            </span>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
