    "use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ReadyToParticipateCTA() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="glass-panel-strong p-12 text-center relative overflow-hidden rounded-2xl">
          {/* Background Grid */}
          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Ready to Participate?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              It&apos;s time to merge logic with design. Register now for the Algorithm Visualization Challenge
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue-400/50 flex items-center gap-2"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Direct anchor link to timeline */}
              <Link
                href="/#timeline"
                aria-label="View timeline details"
                className="px-8 py-4 border-2 border-cyber-blue-400 text-cyber-blue-400 font-bold rounded-lg hover:bg-cyber-blue-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                View Details
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyber-blue-400/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
