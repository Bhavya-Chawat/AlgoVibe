'use client';

import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-hack-navy/50 border-t border-white/10">
      {/* Ready to Participate CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="glass-panel-strong p-12 text-center relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Ready to Participate?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of innovators in the ultimate algorithmic challenge. 
              Register now and hack the matrix.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 bg-cyber-blue-400 hover:bg-cyber-blue-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue-400/50 flex items-center gap-2"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-cyber-blue-400 text-cyber-blue-400 font-bold rounded-lg hover:bg-cyber-blue-400 hover:text-white transition-all duration-300 hover:scale-105">
                View Details
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyber-blue-400/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8 text-cyber-blue-400" />
              <span className="text-2xl font-bold">
                <span className="text-gradient">ALGO</span>
                <span className="text-white">VIBE</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              AlgoVibe 2025 - Where algorithms meet innovation. 
              Join us for an unforgettable hackathon experience at RVCE.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-cyber-blue-400/20 border border-white/10 hover:border-cyber-blue-400/50 flex items-center justify-center transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-cyber-blue-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-cyber-blue-400/20 border border-white/10 hover:border-cyber-blue-400/50 flex items-center justify-center transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-cyber-blue-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-cyber-blue-400/20 border border-white/10 hover:border-cyber-blue-400/50 flex items-center justify-center transition-all duration-300 group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-cyber-blue-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-cyber-blue-400/20 border border-white/10 hover:border-cyber-blue-400/50 flex items-center justify-center transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-cyber-blue-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#home" className="text-gray-400 hover:text-cyber-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#timeline" className="text-gray-400 hover:text-cyber-blue-400 transition-colors">
                  Timeline
                </Link>
              </li>
              <li>
                <Link href="/#opportunities" className="text-gray-400 hover:text-cyber-blue-400 transition-colors">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-cyber-blue-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>RVCE, Bangalore</li>
              <li>Karnataka, India</li>
              <li className="pt-2">
                <a href="mailto:algovibe@rvce.edu.in" className="hover:text-cyber-blue-400 transition-colors">
                  algovibe@rvce.edu.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2025 AlgoVibe. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-cyber-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-cyber-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-cyber-blue-400 transition-colors">
                Code of Conduct
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}