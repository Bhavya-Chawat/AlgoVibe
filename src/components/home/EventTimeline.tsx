"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Trophy,
  Rocket,
  Code2,
  CheckCircle,
} from "lucide-react";

export default function EventTimeline() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

 // Updated phases
const phases = [
  {
    title: "Phase 1: Registration & Prep",
    date: "Oct 16 - Oct 29, 2025",
    icon: Users,
    color: "cyber-blue-400",
    glowColor: "rgba(28, 171, 242, 0.3)",
    description:
      "Secure your team spot and attend the mandatory quick workshop.",
    highlights: [
      "Team Formation (2-3 members max)",
      "Visualization Workshop (30 mins prior to challenge)",
      "Review any Tech Stack (No Restrictions!)",
      "Final Event Guidelines Released",
    ],
  },
  {
    title: "Phase 2: The Visualization Challenge",
    date: "October 30, 2025 (90 Minutes + 30 min Workshop)",
    icon: Code2,
    color: "neon-blue",
    glowColor: "rgba(0, 217, 255, 0.3)",
    description:
      "The core event: Solve the DSA problem and code its creative web visualization.",
    highlights: [
      "Problem Statement Revealed (start of the 90-minute window)",
      "Focused 90-Minute Development Window",
      "In-Classroom Mentor Support",
      "Final Submission Deadline",
    ],
  },
  {
    title: "Phase 3: Judging & Results",
    date: "Post-Event Evaluation",
    icon: Trophy,
    color: "matrix-green",
    glowColor: "rgba(0, 255, 65, 0.3)",
    description:
      "Submissions are rigorously evaluated. Winners will be announced later.",
    highlights: [
      "Panel Judging Sessions (Focus on Vibe, Clarity, and Correctness)",
      "Results Announced after the event",
      "Top Teams Acknowledged",
      "Certificate Distribution",
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
            Event Timeline
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-3">
          <span className="text-gradient">Three Phases</span>
          <span className="text-white"> to Glory</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          From registration to victory - here's your journey through AlgoVibe
          2025
        </p>
      </div>

      {/* Timeline Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                <div className="hidden md:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-cyber-blue-400/50 to-transparent z-0"></div>
              )}

              {/* Phase Card */}
              <div
                className={`glass-panel-strong p-7 md:p-8 h-full transition-all duration-500 relative overflow-hidden ${
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
                <div className="absolute top-4 right-4 text-6xl font-bold opacity-10">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="relative mb-5">
                  <div
                    className={`w-16 h-16 rounded-xl bg-${phase.color}/10 border border-${phase.color}/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 text-${phase.color}`} />
                  </div>
                  {isHovered && (
                    <div
                      className={`absolute inset-0 bg-${phase.color}/20 blur-xl rounded-xl`}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-2 text-${phase.color}`}>
                  {phase.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{phase.date}</span>
                </div>

                <p className="text-gray-300 mb-5">{phase.description}</p>

                {/* Highlights */}
                <div className="space-y-2.5">
                  {phase.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-400 group/item"
                    >
                      <CheckCircle
                        className={`w-4 h-4 text-${phase.color} mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform`}
                      />
                      <span className="group-hover/item:text-gray-300 transition-colors">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div
                  className={`absolute bottom-0 right-0 w-24 h-24 bg-${phase.color}/5 blur-2xl rounded-full`}
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
              Launching Soon
            </span>{" "}
            · Mark Your Calendars
          </span>
        </div>
      </div>
    </div>
  );
}
