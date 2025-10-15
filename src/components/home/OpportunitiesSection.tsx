'use client';

import { Brain, Users2, Award, Lightbulb, Network, Briefcase } from 'lucide-react';

export default function OpportunitiesSection() {
  const opportunities = [
    {
      icon: Brain,
      title: 'Skill Development',
      description: 'Master cutting-edge algorithms, data structures, and problem-solving techniques through hands-on challenges.',
      color: 'cyber-blue-400',
      gradient: 'from-cyber-blue-400/20 to-transparent'
    },
    {
      icon: Users2,
      title: 'Networking',
      description: 'Connect with like-minded developers, industry experts, and potential co-founders in the tech ecosystem.',
      color: 'neon-blue',
      gradient: 'from-neon-blue/20 to-transparent'
    },
    {
      icon: Award,
      title: 'Win Big',
      description: 'Compete for exciting prizes, internship opportunities, and recognition from leading tech companies.',
      color: 'matrix-green',
      gradient: 'from-matrix-green/20 to-transparent'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Lab',
      description: 'Transform your ideas into reality with access to mentors, resources, and state-of-the-art technology.',
      color: 'electric-cyan',
      gradient: 'from-electric-cyan/20 to-transparent'
    },
    {
      icon: Network,
      title: 'Industry Exposure',
      description: 'Get insights from tech leaders, attend workshops, and understand real-world problem-solving approaches.',
      color: 'warning-orange',
      gradient: 'from-warning-orange/20 to-transparent'
    },
    {
      icon: Briefcase,
      title: 'Career Boost',
      description: 'Stand out to recruiters with hackathon experience, portfolio projects, and industry connections.',
      color: 'cyber-blue-600',
      gradient: 'from-cyber-blue-600/20 to-transparent'
    }
  ];

  return (
    <div className="py-16">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-6">
          <Lightbulb className="w-4 h-4 text-cyber-blue-400" />
          <span className="text-sm font-semibold text-cyber-blue-400">What You'll Gain</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-white">Opportunities to </span>
          <span className="text-gradient">Learn & Grow</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          AlgoVibe 2025 is more than a hackathon - it's a launchpad for your tech career
        </p>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity, index) => {
          const Icon = opportunity.icon;
          
          return (
            <div
              key={index}
              className="group glass-panel p-8 hover:glass-panel-strong transition-all duration-500 hover:scale-105 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`w-14 h-14 rounded-lg bg-${opportunity.color}/10 border border-${opportunity.color}/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <Icon className={`w-7 h-7 text-${opportunity.color}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-gradient transition-all duration-300">
                  {opportunity.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  {opportunity.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyber-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore More</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyber-blue-400/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-cyber-blue-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="glass-panel-strong p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-gradient">Ready to Level Up?</span>
          </h3>
          <p className="text-gray-300 mb-6">
            Join AlgoVibe 2025 and unlock opportunities that will shape your future in tech
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-3 bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue-400/50"
            >
              Start Your Journey
            </a>
            <button className="px-8 py-3 border-2 border-cyber-blue-400 text-cyber-blue-400 font-bold rounded-lg hover:bg-cyber-blue-400 hover:text-white transition-all duration-300">
              View FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}