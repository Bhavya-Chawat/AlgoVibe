"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, BookOpen, Menu, X, Sparkles } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function ContestHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <nav
          className={`flex items-center justify-between px-5 sm:px-7 py-3 rounded-full transition-all duration-500 ${
            isScrolled
              ? "bg-black/80 backdrop-blur-2xl border border-cyber-blue-400/40 shadow-2xl shadow-black/90"
              : "bg-black/50 backdrop-blur-xl border border-white/15"
          }`}
        >
          {/* Logo */}
          <Link href="/contest" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="AlgoVibe logo"
                width={30}
                height={30}
                priority
                className="rounded-md transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-cyber-blue-400/30 blur-md group-hover:bg-neon-blue/50 transition-colors rounded-full"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tight flex items-center gap-2 font-heading">
              <span className="text-gradient">ALGO</span>
              <span className="text-white">VIBE</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyber-blue-400/10 text-cyber-blue-400 border border-cyber-blue-400/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                CONTEST
              </span>
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/vibe-coding-guide"
              className="flex items-center gap-1.5 px-5 py-2 border border-cyber-blue-400/40 text-cyber-blue-400 hover:bg-cyber-blue-400/10 font-bold rounded-full text-xs transition-all duration-300 hover:scale-105"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-5 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold rounded-full text-xs transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-cyber-blue-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-5 px-6 glass-panel-strong mt-3 rounded-3xl border border-cyber-blue-400/30 shadow-2xl">
            <div className="flex flex-col space-y-3">
              <Link
                href="/vibe-coding-guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-200 hover:text-cyber-blue-400 hover:bg-white/5 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm"
              >
                <BookOpen className="w-4 h-4 text-cyber-blue-400" />
                <span>Guide</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold rounded-xl text-center text-sm transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
