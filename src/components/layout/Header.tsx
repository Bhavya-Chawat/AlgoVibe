'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Opportunities', href: '/#opportunities' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-hack-navy/80 backdrop-blur-2xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Zap className="w-8 h-8 text-cyber-blue-400 group-hover:text-neon-blue transition-colors" />
              <div className="absolute inset-0 bg-cyber-blue-400/20 blur-xl group-hover:bg-neon-blue/30 transition-colors"></div>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gradient">ALGO</span>
              <span className="text-white">VIBE</span>
              <span className="text-cyber-blue-400 ml-2 text-lg">2025</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-cyber-blue-400 transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/register"
                className="px-6 py-2.5 bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue-400/50"
              >
                Register
              </Link>
              <button className="px-6 py-2.5 border-2 border-cyber-blue-400 text-cyber-blue-400 font-semibold rounded-lg hover:bg-cyber-blue-400 hover:text-white transition-all duration-300">
                Login
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-cyber-blue-400 transition-colors"
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
          <div className="md:hidden py-4 glass-panel-strong mt-2 rounded-2xl">
            <div className="flex flex-col space-y-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-cyber-blue-400 transition-colors duration-300 font-medium py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-6 py-2.5 bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white font-semibold rounded-lg text-center transition-all duration-300"
                >
                  Register
                </Link>
                <button className="w-full px-6 py-2.5 border-2 border-cyber-blue-400 text-cyber-blue-400 font-semibold rounded-lg hover:bg-cyber-blue-400 hover:text-white transition-all duration-300">
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}