"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, BookOpen, Menu, X } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { motion } from "framer-motion";

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-hack-navy/80 backdrop-blur-2xl border-b border-cyber-blue-400/30"
          : "bg-hack-navy/50 backdrop-blur-xl border-b border-cyber-blue-400/20"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/contest" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Algovibe logo"
                width={32}
                height={32}
                priority
                className="rounded-sm"
              />
              <div className="absolute inset-0 bg-cyber-blue-400/20 blur-xl group-hover:bg-neon-blue/30 transition-colors"></div>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gradient">ALGO</span>
              <span className="text-white">VIBE</span>
              <span className="text-cyber-blue-400 ml-2 text-lg">CONTEST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Guide Link */}
            <Link
              href="/vibe-coding-guide"
              className="flex items-center gap-2 text-gray-300 hover:text-cyber-blue-400 transition-colors duration-300 font-medium"
            >
              <BookOpen className="w-5 h-5" />
              <span>Guide</span>
            </Link>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-alert-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-alert-red/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-cyber-blue-400 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 glass-panel-strong mt-2 rounded-2xl border border-cyber-blue-400/30"
          >
            <div className="flex flex-col space-y-4 px-4">
              {/* Guide Link */}
              <Link
                href="/vibe-coding-guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-cyber-blue-400 transition-colors duration-300 font-medium py-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Guide</span>
              </Link>

              {/* Logout Button */}
              <div className="pt-4 border-t border-cyber-blue-400/20">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-gradient-to-r from-alert-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Animated border bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue-400/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </header>
  );
}
