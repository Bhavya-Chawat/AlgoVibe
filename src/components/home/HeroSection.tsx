"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Zap } from "lucide-react";

export default function HeroSection() {
  const [glitchText, setGlitchText] = useState("ALGOVIBE 2025");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Glitch effect for title
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*(){}[]<>?/~`";
      const original = "ALGOVIBE 2025";
      const glitched = original
        .split("")
        .map((char) => {
          if (Math.random() > 0.95 && char !== " ") {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        })
        .join("");

      setGlitchText(glitched);
      setTimeout(() => setGlitchText(original), 50);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const scrollToTimeline = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="
        relative flex items-center justify-center overflow-hidden
        pt-20 md:pt-24
        min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)]
      "
    >
      {/* Grid Overlay (doesn't affect layout flow) */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-6 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-cyber-blue-400" />
            <span className="text-sm font-semibold text-cyber-blue-400">
              Registration Open
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-5 tracking-tight">
            <span className="block text-gradient glitch-text">{glitchText}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-3xl text-gray-300 mb-3 max-w-4xl mx-auto">
            <span className="text-neon-blue font-semibold">Hack the Matrix</span>{" "}
            ·<span className="text-electric-cyan"> Decode the Future</span>
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Join the ultimate algorithmic hackathon at RVCE. Build groundbreaking
            solutions, compete with the best, and win amazing prizes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/register"
              className="group px-8 py-4 bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyber-blue-400/50 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <Zap className="w-5 h-5" />
              Register Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={scrollToTimeline}
              className="group px-8 py-4 glass-panel-strong hover:bg-white/20 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 min-w-[200px] justify-center"
            >
              <Code className="w-5 h-5 text-cyber-blue-400" />
              Learn More
            </button>
          </div>
        </div>

        {/* Floating Elements (decorative) */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-2 h-2 bg-neon-blue rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-300">
          <div className="w-3 h-3 bg-electric-cyan rounded-full blur-sm"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse delay-700">
          <div className="w-2 h-2 bg-matrix-green rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Gradient Overlay (decorative) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-hack-black to-transparent pointer-events-none"></div>
    </div>
  );
}
