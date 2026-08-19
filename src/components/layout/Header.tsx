"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn, LogOut, Sparkles } from "lucide-react";
import { getUser, logout } from "@/app/actions/auth";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Timeline", href: "/#timeline" },
    { name: "Event Details", href: "/#details" },
    { name: "Opportunities", href: "/#opportunities" },
    { name: "Guide", href: "/vibe-coding-guide" },
  ];

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-3">
          <div className="w-20 h-9 bg-white/10 rounded-full animate-pulse"></div>
          <div className="w-28 h-9 bg-white/10 rounded-full animate-pulse"></div>
        </div>
      );
    }

    return user ? (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold rounded-full text-xs transition-all duration-300 hover:scale-105"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Logout</span>
      </button>
    ) : (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-5 py-2 border border-cyber-blue-400/40 text-cyber-blue-400 hover:bg-cyber-blue-400/10 font-bold rounded-full text-xs transition-all duration-300 hover:scale-105"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Login</span>
        </Link>

        <Link
          href="/register"
          className="px-5 py-2 bg-gradient-to-r from-cyber-blue-400 via-neon-blue to-electric-cyan text-black font-extrabold rounded-full text-xs shadow-lg shadow-cyber-blue-400/25 hover:scale-105 transition-all duration-300 tracking-wide"
        >
          Register Now
        </Link>
      </div>
    );
  };

  const renderMobileAuthButtons = () => {
    if (loading) {
      return (
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="w-full h-10 bg-white/10 rounded-xl animate-pulse"></div>
          <div className="w-full h-10 bg-white/10 rounded-xl animate-pulse"></div>
        </div>
      );
    }

    return user ? (
      <button
        onClick={() => {
          setIsMobileMenuOpen(false);
          handleLogout();
        }}
        className="flex items-center justify-center gap-2 w-full px-6 py-2.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold rounded-xl text-center text-sm transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    ) : (
      <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
        <Link
          href="/login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 w-full px-6 py-2.5 border border-cyber-blue-400/40 text-cyber-blue-400 hover:bg-cyber-blue-400/10 font-bold rounded-xl text-center text-sm transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </Link>

        <Link
          href="/register"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block w-full px-6 py-2.5 bg-gradient-to-r from-cyber-blue-400 via-neon-blue to-electric-cyan text-black font-extrabold rounded-xl text-center text-sm transition-all shadow-md shadow-cyber-blue-400/20"
        >
          Register Now
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <nav
          className={`flex items-center justify-between px-5 sm:px-7 py-3 rounded-full transition-all duration-500 ${
            isScrolled
              ? "bg-black/75 backdrop-blur-2xl border border-cyber-blue-400/30 shadow-2xl shadow-black/80"
              : "bg-black/40 backdrop-blur-xl border border-white/10"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
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
            <span className="text-xl font-extrabold tracking-tight flex items-center gap-1.5 font-heading">
              <span className="text-gradient">ALGO</span>
              <span className="text-white">VIBE</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyber-blue-400/10 text-cyber-blue-400 border border-cyber-blue-400/30 rounded-full">
                2026
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-1.5 rounded-full transition-all duration-200 font-semibold text-xs tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center">
            {renderAuthButtons()}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
          <div className="lg:hidden py-5 px-6 glass-panel-strong mt-3 rounded-3xl border border-cyber-blue-400/30 shadow-2xl animate-pulse-subtle">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-cyber-blue-400 hover:bg-white/5 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm"
                >
                  {link.name}
                </Link>
              ))}
              {renderMobileAuthButtons()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
