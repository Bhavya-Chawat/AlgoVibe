"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ReadyToParticipateCTA() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        <div className="glass-panel-strong p-6 sm:p-12 text-center relative overflow-hidden rounded-2xl">
          {/* Background Grid */}
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Ready to Participate?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              It&apos;s time to merge logic with design. Register now for the
              Algorithm Visualization Challenge
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 w-full sm:w-auto">
              <Link
                href="/register"
                className="group w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-4 bg-cyber-blue-400 hover:bg-cyber-blue-500 active:bg-cyber-blue-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue-400/50 flex items-center justify-center gap-2 touch-manipulation"
              >
                <span className="relative z-20">Register Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-20" />
              </Link>

              {/* Direct anchor link to timeline */}
              <Link
                href="/vibe-coding-guide"
                aria-label="View timeline details"
                className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-4 border-2 border-cyber-blue-400 text-cyber-blue-400 font-bold rounded-lg hover:bg-cyber-blue-400 hover:text-white active:bg-cyber-blue-600 active:border-cyber-blue-600 transition-all duration-300 hover:scale-105 text-center touch-manipulation relative z-20"
              >
                <span className="relative z-20">View Details</span>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyber-blue-400/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
