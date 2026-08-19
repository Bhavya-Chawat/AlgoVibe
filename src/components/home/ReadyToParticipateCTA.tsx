"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Zap, BookOpen } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import BlurText from "@/components/BlurText";

export default function ReadyToParticipateCTA() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <AnimatedContent distance={40} direction="vertical" duration={0.9}>
          <div className="glass-panel-strong p-8 sm:p-16 text-center relative overflow-hidden rounded-3xl border border-cyber-blue-400/40 shadow-2xl shadow-cyber-blue-400/20 glow-card">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

            {/* Radial Glow Orbs */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyber-blue-400/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 right-10 w-72 h-72 bg-matrix-green/15 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel mb-6 border border-cyber-blue-400/40 animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-cyber-blue-400" />
                <span className="text-xs sm:text-sm font-extrabold text-cyber-blue-400 uppercase tracking-wide">
                  August 20, 2026 · ISE Department
                </span>
              </div>

              <div className="flex justify-center mb-4">
                <BlurText
                  text="Ready to Join the Vibe?"
                  animateBy="words"
                  delay={90}
                  className="text-3xl sm:text-5xl md:text-6xl font-black text-white text-center justify-center font-heading tracking-tight"
                />
              </div>

              <p className="text-base sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                It&apos;s time to merge code with creativity. Register your team now for the AlgoVibe Hackathon Challenge!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="group w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-cyber-blue-400 via-neon-blue to-electric-cyan text-black font-extrabold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyber-blue-400/50 flex items-center justify-center gap-2.5 touch-manipulation tracking-wide text-base"
                >
                  <Zap className="w-5 h-5 fill-black" />
                  <span>Register Team Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/vibe-coding-guide"
                  aria-label="View vibe coding guide"
                  className="group w-full sm:w-auto px-8 py-4 glass-panel-strong border border-cyber-blue-400/50 text-cyber-blue-400 font-extrabold rounded-xl hover:bg-cyber-blue-400/10 hover:border-cyber-blue-400 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-center touch-manipulation text-base"
                >
                  <BookOpen className="w-5 h-5 text-cyber-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Vibe Coding Guide</span>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
