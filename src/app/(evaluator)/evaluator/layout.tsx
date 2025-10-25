"use client";

import { ReactNode } from "react";

export default function EvaluatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hack-black via-hack-navy to-hack-black">
      {/* Main Content */}
      <div className="ml-0">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-hack-navy/80 border-b border-cyber-blue-400/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-gradient">AlgoVibe Evaluator</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-200">Evaluator</p>
                <p className="text-xs text-gray-400">evaluator@algovibe.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue-400 to-neon-blue rounded-full flex items-center justify-center">
                <span className="text-hack-black font-bold text-sm">EV</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(28,171,242,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(28,171,242,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,171,242,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    </div>
  );
}