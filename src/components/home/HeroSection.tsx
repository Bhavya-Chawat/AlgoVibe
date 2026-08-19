"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Code, Zap, Users, Trophy, Clock } from "lucide-react";
import BlurText from "@/components/BlurText";
import AnimatedContent from "@/components/AnimatedContent";

export default function HeroSection() {
  const scrollToTimeline = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  const quickStats = [
    { icon: Trophy, label: "Core Challenge", value: "Hackathon Track" },
    { icon: Users, label: "Team Formation", value: "2 - 3 Members" },
    { icon: Clock, label: "Event Window", value: "Aug 20 · 12 - 4 PM" },
  ];

  return (
    <div
      className="
        relative flex flex-col items-center justify-center overflow-hidden
        pt-28 md:pt-36 pb-16
        min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)]
      "
    >
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyber-blue-400/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center w-full flex flex-col items-center">
        {/* Badge */}
        <AnimatedContent distance={30} direction="vertical" duration={0.8}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel border border-cyber-blue-400/40 mb-6 animate-pulse-glow hover:border-cyber-blue-400 transition-all shadow-lg shadow-cyber-blue-400/10">
            <span className="w-2 h-2 rounded-full bg-matrix-green animate-ping"></span>
            <Sparkles className="w-4 h-4 text-cyber-blue-400" />
            <span className="text-xs md:text-sm font-extrabold tracking-wider text-cyber-blue-400 uppercase">
              August 20, 2026 · Registration Live
            </span>
          </div>
        </AnimatedContent>

        {/* Main Title */}
        <AnimatedContent distance={40} direction="vertical" delay={0.15} duration={0.9}>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-gradient font-heading block my-4 drop-shadow-2xl">
            ALGOVIBE 2026
          </h1>
        </AnimatedContent>

        {/* Subtitle using BlurText */}
        <div className="flex justify-center mb-6 w-full">
          <BlurText
            text="Build the Future · Vibe the Code"
            animateBy="words"
            delay={80}
            className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-bold max-w-4xl mx-auto justify-center text-center font-heading tracking-wide"
          />
        </div>

        {/* Description Paragraph */}
        <AnimatedContent distance={40} direction="vertical" delay={0.25} duration={0.8}>
          <p className="text-base md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
            Join the ultimate Hackathon Competition for the ISE department.
            Turn innovative ideas into cutting-edge, interactive web applications.
            Compete with your peers and prove your hackathon build skills!
          </p>
        </AnimatedContent>

        {/* CTA Buttons */}
        <AnimatedContent distance={40} direction="vertical" delay={0.35} duration={0.9}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-14">
            <Link
              href="/register"
              className="group px-8 py-4 bg-gradient-to-r from-cyber-blue-400 via-neon-blue to-electric-cyan text-black font-extrabold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyber-blue-400/50 flex items-center gap-2.5 min-w-[220px] justify-center tracking-wide"
            >
              <Zap className="w-5 h-5 fill-black" />
              Register Team Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={scrollToTimeline}
              className="group px-8 py-4 glass-panel-strong hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2.5 min-w-[200px] justify-center border border-white/15 hover:border-cyber-blue-400/50"
            >
              <Code className="w-5 h-5 text-cyber-blue-400" />
              Event Schedule
            </button>
          </div>
        </AnimatedContent>

        {/* Quick Stats Grid */}
        <AnimatedContent distance={40} direction="vertical" delay={0.45} duration={0.9}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto w-full">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel-strong p-5 rounded-2xl border border-white/10 hover:border-cyber-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center text-center group hover:scale-105 shadow-xl"
                >
                  <Icon className="w-6 h-6 text-cyber-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-base font-extrabold text-white tracking-tight">{stat.value}</span>
                  <span className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
