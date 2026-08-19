"use client";

import Link from "next/link";
import Image from "next/image"; // add this
// remove: import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-hack-navy/50 border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand + Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* Replace Zap with your logo image from public/images/logo.png */}
              <Image
                src="/images/logo.png"
                alt="Algovibe logo"
                width={32}
                height={32}
                priority
                className="rounded-sm"
              />
              <span className="text-2xl font-bold">
                <span className="text-gradient">ALGO</span>
                <span className="text-white">VIBE</span>
              </span>
            </div>

            {/* Main Tagline */}
            <p className="text-gray-200 text-lg font-semibold mb-2">
              Build the Future. Code the Vibe.
            </p>
            <p className="text-gray-400 mb-6 max-w-xl">
              An exclusive hackathon competition by the ISE Department.
            </p>

            <p className="text-gray-500 text-sm max-w-md">
              AlgoVibe 2026 brings innovation, web development, and creativity together at RVCE.
            </p>
          </div>

          {/* Quick Links (clickable) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#home"
                  className="text-gray-400 hover:text-cyber-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#timeline"
                  className="text-gray-400 hover:text-cyber-blue-400 transition-colors"
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/#details"
                  className="text-gray-400 hover:text-cyber-blue-400 transition-colors"
                >
                  Event Details
                </Link>
              </li>
              <li>
                <Link
                  href="/vibe-coding-guide"
                  className="text-gray-400 hover:text-cyber-blue-400 transition-colors"
                >
                  Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/#opportunities"
                  className="text-gray-400 hover:text-cyber-blue-400 transition-colors"
                >
                  Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-cyber-blue-400 transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Location (plain text) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Location</h3>
            <ul className="space-y-2 text-gray-400">
              <li>ISE Department</li>
              <li>RVCE, Bangalore</li>
              <li>Karnataka, India</li>
              <li className="pt-2 text-white font-medium">Contact Persons</li>
              <li>Bhavya Chawat · 8951167950 · bhavyachawat@gmail.com</li>
              <li>Kruthi Krishna · +919035314084</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (no policy links) */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} AlgoVibe. All rights reserved.
            </p>
            <div className="h-0" />
          </div>
        </div>
      </div>
    </footer>
  );
}