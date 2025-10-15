'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Code, Zap } from 'lucide-react';
import BeamsBackground from '@/components/background/Beams';

export default function HeroSection() {
  const [glitchText, setGlitchText] = useState('ALGOVIBE 2025');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Glitch effect for title
    const glitchInterval = setInterval(() => {
      const chars = '!@#$%^&*(){}[]<>?/~`';
      const original = 'ALGOVIBE 2025';
      const glitched = original
        .split('')
        .map((char, i) => {
          if (Math.random() > 0.95 && char !== ' ') {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        })
        .join('');
      
      setGlitchText(glitched);
      
      setTimeout(() => setGlitchText(original), 50);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const scrollToTimeline = () => {
    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Beams Background */}
      <div className="absolute inset-0">
        <BeamsBackground />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-cyber-blue-400" />
            <span className="text-sm font-semibold text-cyber-blue-400">
              Registration Open
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">
            <span className="block text-gradient glitch-text">
              {glitchText}
            </span>
          </h1>

          {/* Subtitle with Typing Effect */}
          <p className="text-xl md:text-3xl text-gray-300 mb-4 max-w-4xl mx-auto">
            <span className="text-neon-blue font-semibold">Hack the Matrix</span> · 
            <span className="text-electric-cyan"> Decode the Future</span>
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Join the ultimate algorithmic hackathon at RVCE. 
            Build groundbreaking solutions, compete with the best, and win amazing prizes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Participants', value: '500+', icon: '👥' },
              { label: 'Prize Pool', value: '₹1L+', icon: '🏆' },
              { label: 'Hours', value: '24', icon: '⏰' },
              { label: 'Tracks', value: '5+', icon: '🎯' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glass-panel p-6 hover:glass-panel-strong transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
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

      {/* Gradient Overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hack-black to-transparent"></div>
    </div>
  );
}