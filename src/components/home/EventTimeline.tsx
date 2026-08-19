"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Trophy,
  Rocket,
  Code2,
  Utensils,
  CheckCircle,
} from "lucide-react";

export default function EventTimeline() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  // Updated timeline phases for August 20
  const phases = [
    {
      title: "Hackathon Kickoff",
      date: "12:00 PM - 1:00 PM",
      icon: Rocket,
      color: "cyber-blue-400",
      glowColor: "rgba(28, 171, 242, 0.3)",
      description:
        "Problem statement revealed and team formation.",
      highlights: [
        "Problem Statement Revealed",
        "Team Alignment & Setup",
        "Event Briefing",
      ],
    },
    {
      title: "Lunch Break",
      date: "1:00 PM - 1:30 PM",
      icon: Utensils,
      color: "neon-blue",
      glowColor: "rgba(0, 217, 255, 0.3)",
      description:
        "Break for lunch and networking with peers.",
      highlights: [
        "Lunch & Refreshments",
        "Informal Discussions",
      ],
    },
    {
      title: "Building Continues",
      date: "1:30 PM - 3:30 PM",
      icon: Code2,
      color: "neon-blue",
      glowColor: "rgba(0, 217, 255, 0.3)",
      description:
        "Core development phase for coding and visualization.",
      highlights: [
        "Focused 2-Hour Coding Session",
        "In-Classroom Mentor Support",
        "Finalizing Submissions",
      ],
    },
    {
      title: "Judging & Closing",
      date: "3:30 PM - 4:00 PM",
      icon: Trophy,
      color: "matrix-green",
      glowColor: "rgba(0, 255, 65, 0.3)",
      description:
        "Presentation judging and closing ceremony.",
      highlights: [
        "Project Demos & Evaluation",
        "Winner Announcements",
        "Closing Ceremony",
      ],
    },
  ];

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-5">
          <Calendar className="w-4 h-4 text-cyber-blue-400" />
          <span className="text-sm font-semibold text-cyber-blue-400">
            Event Schedule · August 20
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-3">
          <span className="text-gradient">August 20</span>
          <span className="text-white"> Schedule</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Here is your step-by-step agenda for AlgoVibe on August 20
        </p>
      </div>

      {/* Timeline Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isHovered = hoveredPhase === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredPhase(index)}
              onMouseLeave={() => setHoveredPhase(null)}
              className="relative group"
            >
              {/* Connection Line (Desktop) */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-6 h-0.5 bg-gradient-to-r from-cyber-blue-400/50 to-transparent z-0"></div>
              )}

              {/* Phase Card */}
              <div
                className={`glass-panel-strong p-6 md:p-7 h-full transition-all duration-500 relative overflow-hidden ${
                  isHovered ? "scale-105" : ""
                }`}
                style={{
                  boxShadow: isHovered
                    ? `0 0 40px ${phase.glowColor}, 0 0 80px ${phase.glowColor}`
                    : "none",
                }}
              >
                {/* Scan Line Effect */}
                {isHovered && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent animate-scan"></div>
                )}

                {/* Phase Number */}
                <div className="absolute top-4 right-4 text-5xl font-bold opacity-10">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="relative mb-5">
                  <div
                    className={`w-14 h-14 rounded-xl bg-${phase.color}/10 border border-${phase.color}/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 text-${phase.color}`} />
                  </div>
                  {isHovered && (
                    <div
                      className={`absolute inset-0 bg-${phase.color}/20 blur-xl rounded-xl`}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-2 text-${phase.color}`}>
                  {phase.title}
                </h3>

                <div className="flex items-center gap-2 text-cyber-blue-400 mb-3 font-semibold text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{phase.date}</span>
                </div>

                <p className="text-gray-300 text-sm mb-5">{phase.description}</p>

                {/* Highlights */}
                <div className="space-y-2">
                  {phase.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-gray-400 group/item"
                    >
                      <CheckCircle
                        className={`w-3.5 h-3.5 text-${phase.color} mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform`}
                      />
                      <span className="group-hover/item:text-gray-300 transition-colors">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div
                  className={`absolute bottom-0 right-0 w-20 h-20 bg-${phase.color}/5 blur-2xl rounded-full`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Indicator */}
      <div className="mt-12 md:mt-14 text-center">
        <div className="inline-flex items-center gap-3 glass-panel px-6 py-4">
          <Rocket className="w-5 h-5 text-cyber-blue-400 animate-bounce" />
          <span className="text-gray-300">
            <span className="font-bold text-cyber-blue-400">
              August 20, 2025
            </span>{" "}
            · 12:00 PM Kickoff
          </span>
        </div>
      </div>
    </div>
  );
}
