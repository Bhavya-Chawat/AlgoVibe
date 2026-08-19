"use client";

import {
  Brain,
  Users2,
  Lightbulb,
  Sparkles,
  Palette,
  Zap,
} from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import BlurText from "@/components/BlurText";

export default function OpportunitiesSection() {
  const opportunities = [
    {
      icon: Sparkles,
      title: "Vibe Coding",
      description:
        "Go beyond plain coding assignments. Develop your unique engineering style by building real-world web applications and dynamic interactive solutions.",
      color: "matrix-green",
      gradient: "from-matrix-green/20 via-matrix-green/5 to-transparent",
    },
    {
      icon: Brain,
      title: "Rapid Prototyping",
      description:
        "Sharpen your full-stack software development under real hackathon pressure. Design, build, and deploy a complete project in a focused sprint.",
      color: "cyber-blue-400",
      gradient: "from-cyber-blue-400/20 via-cyber-blue-400/5 to-transparent",
    },
    {
      icon: Palette,
      title: "Creative Web Dev",
      description:
        "Flex your engineering & UI skills (React, Next.js, Node, APIs, Tailwind) by crafting an aesthetic, fluid, and functional web prototype.",
      color: "warning-orange",
      gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    },
    {
      icon: Users2,
      title: "Peer Collaboration",
      description:
        "Strengthen teamwork and communication skills. Partner with your ISE batchmates in a high-energy, friendly competitive atmosphere.",
      color: "neon-blue",
      gradient: "from-neon-blue/20 via-neon-blue/5 to-transparent",
    },
    {
      icon: Zap,
      title: "Department Glory",
      description:
        "Compete to be recognized as the top hackathon team in the ISE department. Win trophies and supreme bragging rights.",
      color: "electric-cyan",
      gradient: "from-electric-cyan/20 via-electric-cyan/5 to-transparent",
    },
    {
      icon: Lightbulb,
      title: "Faculty Feedback",
      description:
        "Get direct, actionable feedback on your project architecture and build quality from faculty members and senior mentors.",
      color: "cyber-blue-400",
      gradient: "from-cyber-blue-400/20 via-cyber-blue-400/5 to-transparent",
    },
  ];

  return (
    <div>
      {/* Section Header */}
      <AnimatedContent distance={40} direction="vertical" duration={0.8}>
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-5 border border-cyber-blue-400/30">
            <Lightbulb className="w-4 h-4 text-cyber-blue-400" />
            <span className="text-xs md:text-sm font-semibold text-cyber-blue-400 uppercase tracking-wide">
              What You'll Gain
            </span>
          </div>

          <div className="flex justify-center mb-3">
            <BlurText
              text="Why Join AlgoVibe?"
              animateBy="words"
              delay={80}
              className="text-4xl md:text-6xl font-extrabold text-white text-center justify-center font-heading"
            />
          </div>

          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto">
            This is your chance to merge your analytical logic with creative engineering right here in the ISE branch.
          </p>
        </div>
      </AnimatedContent>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity, index) => {
          const Icon = opportunity.icon;

          return (
            <AnimatedContent
              key={index}
              distance={30}
              direction="vertical"
              delay={index * 0.08}
              duration={0.7}
            >
              <div className="group glass-panel-strong p-7 md:p-8 rounded-2xl hover:border-cyber-blue-400/60 transition-all duration-500 hover:scale-105 relative overflow-hidden h-full border border-white/10 glow-card">
                {/* Background Gradient Mesh */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-5">
                    <div
                      className="w-14 h-14 rounded-xl bg-cyber-blue-400/10 border border-cyber-blue-400/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md shadow-cyber-blue-400/10"
                    >
                      <Icon className="w-7 h-7 text-cyber-blue-400" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold mb-3 text-white group-hover:text-cyber-blue-400 transition-all duration-300 font-heading">
                    {opportunity.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed text-sm">
                    {opportunity.description}
                  </p>
                </div>
              </div>
            </AnimatedContent>
          );
        })}
      </div>
    </div>
  );
}
