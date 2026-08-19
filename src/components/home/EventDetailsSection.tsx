"use client";

import {
  Users,
  Trophy,
  Code2,
  MapPin,
  Gift,
  Zap,
  CheckCircle2,
} from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import BlurText from "@/components/BlurText";

const colorVariants: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "cyber-blue-400": {
    bg: "bg-cyber-blue-400/10",
    border: "border-cyber-blue-400/30",
    text: "text-cyber-blue-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(28,171,242,0.25)]",
  },
  "electric-cyan": {
    bg: "bg-electric-cyan/10",
    border: "border-electric-cyan/30",
    text: "text-electric-cyan",
    glow: "group-hover:shadow-[0_0_30px_rgba(0,255,247,0.25)]",
  },
  "warning-orange": {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]",
  },
  "matrix-green": {
    bg: "bg-matrix-green/10",
    border: "border-matrix-green/30",
    text: "text-matrix-green",
    glow: "group-hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]",
  },
  "neon-blue": {
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/30",
    text: "text-neon-blue",
    glow: "group-hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]",
  },
};

const detailsData = [
  {
    icon: Users,
    title: "Eligibility & Teams",
    description:
      "Who can join the Hackathon and how to assemble your build crew.",
    color: "cyber-blue-400",
    highlights: [
      "Target Audience: Exclusively for ISE Students",
      "Team Size: 2 to 3 Members",
      "Individual Participation is not allowed",
    ],
  },
  {
    icon: MapPin,
    title: "Logistics & Setup",
    description:
      "Everything you need to know about the venue and hackathon setup.",
    color: "electric-cyan",
    highlights: [
      "Format: Offline Hackathon at ISE Department",
      "Requirements: Teams must bring Laptops & Chargers",
      "Check-in: Starts 15 minutes before 12:00 PM kickoff",
      "Submission: GitHub Repository & Live Deployed URL",
    ],
  },
  {
    icon: Code2,
    title: "Allowed Tech Stack",
    description:
      "You are free to use ANY tech stack or tools to build your hackathon solution.",
    color: "warning-orange",
    highlights: [
      "No Restrictions: React, Next.js, Node, Python, AI APIs, Mobile & Web",
      "Libraries, UI frameworks & open-source packages permitted",
      "Focus: High build quality, innovation & UX vibe!",
    ],
  },
  {
    icon: Trophy,
    title: "Judging Criteria",
    description:
      "How your hackathon project will be evaluated—where Code meets Innovation.",
    color: "matrix-green",
    highlights: [
      "Innovation & Build Quality (50%): Originality, design & execution",
      "Functionality & UX (30%): Live demo & seamless user experience",
      "Technical Complexity (20%): Architecture & code quality",
      "Total Score: 100 points maximum",
    ],
  },
  {
    icon: Gift,
    title: "Participation & Rewards",
    description:
      "Recognition and certificates awarded to top hackathon teams.",
    color: "neon-blue",
    highlights: [
      "Certificates: Official Certificate for ALL registered teams",
      "Department Trophies & Top Team Honors",
      "Opportunity for project showcase and faculty recognition",
    ],
  },
  {
    icon: Zap,
    title: "Hackathon Tracks",
    description:
      "What kind of challenge to expect on August 20?",
    color: "matrix-green",
    highlights: [
      "One Core Hackathon Problem Statement / Challenge Track",
      "Flow: Ideate -> Architect -> Build -> Deploy -> Present Live",
      "Reveal: Announced live at 12:00 PM kickoff",
      "Goal: Build a working functional web prototype under 4 hours!",
    ],
  },
];

export default function EventDetailsSection() {
  return (
    <div>
      <AnimatedContent distance={40} direction="vertical" duration={0.8}>
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-5 border border-matrix-green/30">
            <Zap className="w-4 h-4 text-matrix-green" />
            <span className="text-xs md:text-sm font-semibold text-matrix-green uppercase tracking-wide">
              Essential Hackathon Guidelines
            </span>
          </div>

          <div className="flex justify-center mb-3">
            <BlurText
              text="Everything You Need to Know"
              animateBy="words"
              delay={80}
              className="text-4xl md:text-6xl font-extrabold text-white text-center justify-center font-heading"
            />
          </div>

          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto">
            Prepare your team, your laptop, and your creative vision for AlgoVibe 2026 on August 20.
          </p>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {detailsData.map((item, index) => {
          const Icon = item.icon;
          const cv =
            colorVariants[item.color] || colorVariants["cyber-blue-400"];
          return (
            <AnimatedContent
              key={index}
              distance={30}
              direction="vertical"
              delay={index * 0.08}
              duration={0.7}
            >
              <div className={`glass-panel-strong p-7 md:p-8 rounded-2xl h-full transition-all duration-500 relative overflow-hidden group hover:scale-[1.03] hover:border-cyber-blue-400/50 border border-white/10 ${cv.glow}`}>
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue-400/5 blur-3xl rounded-full group-hover:bg-cyber-blue-400/15 transition-all"></div>

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${cv.bg} ${cv.border} border flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${cv.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyber-blue-400 transition-colors font-heading">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-300 mb-6 text-sm leading-relaxed font-normal">{item.description}</p>

                <div className="space-y-3">
                  {item.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-xs md:text-sm text-gray-300 group/item"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${cv.text} mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform`}
                      />
                      <span className="group-hover/item:text-white transition-colors">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedContent>
          );
        })}
      </div>
    </div>
  );
}
