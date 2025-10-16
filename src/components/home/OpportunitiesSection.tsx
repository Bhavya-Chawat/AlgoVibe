"use client";

import {
  Brain,
  Users2,
  Award,
  Lightbulb,
  Network,
  Briefcase,
} from "lucide-react";

export default function OpportunitiesSection() {
  const opportunities = [
    {
      icon: Brain,
      title: "Skill Development",
      description:
        "Master cutting-edge algorithms, data structures, and problem-solving techniques through hands-on challenges.",
      color: "cyber-blue-400",
      gradient: "from-cyber-blue-400/20 to-transparent",
    },
    {
      icon: Users2,
      title: "Networking",
      description:
        "Connect with like-minded developers, industry experts, and potential co-founders in the tech ecosystem.",
      color: "neon-blue",
      gradient: "from-neon-blue/20 to-transparent",
    },
    {
      icon: Award,
      title: "Win Big",
      description:
        "Compete for exciting prizes, internship opportunities, and recognition from leading tech companies.",
      color: "matrix-green",
      gradient: "from-matrix-green/20 to-transparent",
    },
    {
      icon: Lightbulb,
      title: "Innovation Lab",
      description:
        "Transform your ideas into reality with access to mentors, resources, and state-of-the-art technology.",
      color: "electric-cyan",
      gradient: "from-electric-cyan/20 to-transparent",
    },
    {
      icon: Network,
      title: "Industry Exposure",
      description:
        "Get insights from tech leaders, attend workshops, and understand real-world problem-solving approaches.",
      color: "warning-orange",
      gradient: "from-warning-orange/20 to-transparent",
    },
    {
      icon: Briefcase,
      title: "Career Boost",
      description:
        "Stand out to recruiters with hackathon experience, portfolio projects, and industry connections.",
      color: "cyber-blue-600",
      gradient: "from-cyber-blue-600/20 to-transparent",
    },
  ];

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-5">
          <Lightbulb className="w-4 h-4 text-cyber-blue-400" />
          <span className="text-sm font-semibold text-cyber-blue-400">
            What You'll Gain
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-3">
          <span className="text-white">Opportunities to </span>
          <span className="text-gradient">Learn & Grow</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          AlgoVibe 2025 is more than a hackathon - it's a launchpad for your
          tech career
        </p>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {opportunities.map((opportunity, index) => {
          const Icon = opportunity.icon;

          return (
            <div
              key={index}
              className="group glass-panel p-7 md:p-8 hover:glass-panel-strong transition-all duration-500 hover:scale-105 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-5">
                  <div
                    className={`w-14 h-14 rounded-lg bg-${opportunity.color}/10 border border-${opportunity.color}/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <Icon className={`w-7 h-7 text-${opportunity.color}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-2.5 text-white group-hover:text-gradient transition-all duration-300">
                  {opportunity.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  {opportunity.description}
                </p>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyber-blue-400/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-cyber-blue-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
