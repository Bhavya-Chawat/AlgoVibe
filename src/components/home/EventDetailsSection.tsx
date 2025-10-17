// EventDetailsSection.tsx

"use client";

import {
  Users,
  Trophy,
  Code2,
  MapPin,
  DollarSign,
  Zap,
  CheckCircle,
} from "lucide-react";

// Helper for Tailwind classes (Assuming these variables are defined in your environment)
const colorVariants = {
  "cyber-blue-400": {
    bg: "bg-cyber-blue-400/10",
    border: "border-cyber-blue-400/30",
    text: "text-cyber-blue-400",
  },
  "electric-cyan": {
    bg: "bg-electric-cyan/10",
    border: "border-electric-cyan/30",
    text: "text-electric-cyan",
  },
  "warning-orange": {
    bg: "bg-warning-orange/10",
    border: "border-warning-orange/30",
    text: "text-warning-orange",
  },
  "matrix-green": {
    bg: "bg-matrix-green/10",
    border: "border-matrix-green/30",
    text: "text-matrix-green",
  },
  "neon-blue": {
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/30",
    text: "text-neon-blue",
  },
};

// UPDATED Data for the 'Detailed Event Info' Section
const detailsData = [
  {
    icon: Users,
    title: "Eligibility & Teams",
    description:
      "Who can join the Vibe and how to form your visualization crew.",
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
      "Everything you need to know about the location and resources.",
    color: "electric-cyan",
    highlights: [
      "Format: Offline Event",
      "Requirements: Teams must bring their own Laptops and Chargers",
      "Check-in: Starts 15 minutes before the challenge begins",
      "Submission: Teams must provide both the GitHub Repository Link and a Deployed URL.",
    ],
  },
  {
    icon: Code2,
    title: "Allowed Technology",
    description:
      "You are free to use ANY tech stack to bring your DSA solution to life.", // UPDATED
    color: "warning-orange",
    highlights: [
      "No Restrictions: Any Programming Language or Framework is allowed", // UPDATED
      "Examples: Python (with libraries like Plotly/Matplotlib), React, Unity, etc.", // SUGGESTION
      "Submission: Single-page visualization (Web-based preferred, but other formats accepted if easily runnable)",
      "Goal: Focus is on visualization quality, not language choice.",
    ],
  },
  {
    icon: Trophy,
    title: "Judging Criteria",
    description:
      "How your team will be evaluated—where the Logic meets the Vibe.",
    color: "matrix-green",
    highlights: [
      "Visualization & Creativity (60%): Aesthetics, originality, and dynamic engagement.",
      "Clarity & Explanation (20%): How easily the visual explains the DSA concept and process.",
      "Technical Correctness (20%): Correct implementation and efficiency of the underlying algorithm.",
      "Total Score: 100 points, focused on visualization excellence.",
    ],
  },
  {
    icon: DollarSign,
    title: "Participation & Acknowledgment",
    description:
      "The intrinsic value of participation and how your efforts will be recognized.",
    color: "neon-blue",
    highlights: [
      "Cost to Compete: FREE (Exclusive to ISE Students)",
      "Certificates: Participation Certificate for ALL teams",
      "Bragging Rights and Top Team Recognition",
    ],
  },
  {
    icon: Zap,
    title: "Problem Statement",
    description:
      "What kind of problem can your team expect on the day of the event?",
    color: "matrix-green",
    highlights: [
      "Focus: A single, non-trivial DSA problem",
      "Categories: Likely to involve Sorting, Graph Traversal, or Recursion concepts",
      "Revealed: Only at the start of the 2-hour challenge window", // UPDATED duration
      "Goal: The problem is the canvas for your visualization!",
    ],
  },
];

export default function EventDetailsSection() {
  return (
    <div>
      <div className="text-center mb-12 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-5">
          <Zap className="w-4 h-4 text-matrix-green" />
          <span className="text-sm font-semibold text-matrix-green">
            Essential Details
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-3">
          <span className="text-white">Everything You Need </span>
          <span className="text-gradient">to Know</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          Prepare your team, your code, and your creativity for Algovibe 2025.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {detailsData.map((item, index) => {
          const Icon = item.icon;
          // Get color variants based on assumed global Tailwind classes
          const cv =
            colorVariants[item.color as keyof typeof colorVariants] ??
            colorVariants["cyber-blue-400"];
          return (
            <div
              key={index}
              className="glass-panel p-7 md:p-8 h-full transition-all duration-300 relative overflow-hidden group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${cv.bg} ${cv.border} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${cv.text}`} />
                </div>
                <h3
                  className={`text-xl font-bold text-white group-hover:${cv.text.replace(
                    "text-",
                    ""
                  )}`}
                >
                  {item.title}
                </h3>
              </div>

              <p className="text-gray-400 mb-5 text-sm">{item.description}</p>

              <div className="space-y-2">
                {item.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${cv.text} mt-0.5 flex-shrink-0`}
                    />
                    <span dangerouslySetInnerHTML={{ __html: hl }} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
