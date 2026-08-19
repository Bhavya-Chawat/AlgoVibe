"use client";

import { Clock, Target, Code2 } from "lucide-react";

export default function ContestInfoSection() {
  const contestInfo = [
    {
      icon: Clock,
      title: "Sprint Duration",
      description: "4 Hours (12:00 PM - 4:00 PM IST)",
      color: "cyber-blue-400",
      gradient: "from-cyber-blue-400/20 via-cyber-blue-400/5 to-transparent",
    },
    {
      icon: Target,
      title: "Hackathon Track",
      description: "1 Core Challenge Problem Statement",
      color: "matrix-green",
      gradient: "from-matrix-green/20 via-matrix-green/5 to-transparent",
    },
    {
      icon: Code2,
      title: "Submission Deliverables",
      description: "GitHub Repo + Live Deployed URL + Code Submission",
      color: "neon-blue",
      gradient: "from-neon-blue/20 via-neon-blue/5 to-transparent",
    },
  ];

  return (
    <div className="glass-panel-strong p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold font-heading">
          <span className="text-white">Contest </span>
          <span className="text-gradient">Information</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Everything you need for event day execution
        </p>
      </div>

      {/* Contest Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contestInfo.map((info, index) => {
          const Icon = info.icon;

          return (
            <div
              key={index}
              className="group glass-panel p-6 hover:glass-panel-strong transition-all duration-500 hover:scale-[1.03] relative overflow-hidden rounded-2xl border border-white/10 hover:border-cyber-blue-400/50 glow-card"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4">
                  <div
                    className="w-12 h-12 rounded-xl bg-cyber-blue-400/10 border border-cyber-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-cyber-blue-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyber-blue-400 transition-all duration-300 font-heading">
                  {info.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed text-sm">
                  {info.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}