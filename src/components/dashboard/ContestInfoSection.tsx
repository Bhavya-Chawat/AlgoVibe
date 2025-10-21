"use client";

import { Clock, Target, Code } from "lucide-react";

export default function ContestInfoSection() {
  const contestInfo = [
    {
      icon: Clock,
      title: "Duration",
      description: "1.5 Hours",
      color: "cyber-blue-400",
      gradient: "from-cyber-blue-400/20 to-transparent",
    },
    {
      icon: Target,
      title: "Problem Tracks",
      description: "1",
      color: "matrix-green",
      gradient: "from-matrix-green/20 to-transparent",
    },
    {
      icon: Code,
      title: "Submission Requirements",
      description: "Github Repo, Deployed link, problem statement solution in code",
      color: "neon-blue",
      gradient: "from-neon-blue/20 to-transparent",
    },
  ];

  return (
    <div className="glass-panel-strong p-6 md:p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
          <span className="text-white">Contest </span>
          <span className="text-gradient">Information</span>
        </h2>
      </div>

      {/* Contest Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contestInfo.map((info, index) => {
          const Icon = info.icon;

          return (
            <div
              key={index}
              className="group glass-panel p-6 hover:glass-panel-strong transition-all duration-500 hover:scale-105 relative overflow-hidden rounded-xl"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${info.color}/10 border border-${info.color}/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300`}
                  >
                    <Icon className={`w-6 h-6 text-${info.color}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gradient transition-all duration-300">
                  {info.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed">
                  {info.description}
                </p>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyber-blue-400/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-cyber-blue-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}