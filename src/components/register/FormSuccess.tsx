"use client";

import React, { useEffect, useState } from "react";
import { GlassPanel } from "../ui/modern-ui/src/components/ui/GlassPanel";
import { CheckCircle, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FormSuccessProps {
  teamLeaderName: string;
  onClose: () => void;
}

export default function FormSuccess({
  teamLeaderName,
  onClose,
}: FormSuccessProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hack-black/80 backdrop-blur-lg">
      <GlassPanel
        className={`max-w-2xl w-full mx-4 transform transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        blur="heavy"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-strong p-8 md:p-12 flex flex-col items-center justify-center space-y-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border-2 border-green-500/20"
            />
          </motion.div>

          {/* Success Message */}
          <div className="text-center space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white"
            >
              Registration Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400"
            >
              Your team has been successfully registered for AlgoVibe 2025.
              Check your email for confirmation and further details.
            </motion.p>
          </div>

          {/* Next Steps Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full glass-panel p-6 border border-white/10"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Next Steps:</h3>
              <ul className="space-y-3">
                {[
                  "Check your email for confirmation details",
                  "Start practicing with your team",
                ].map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <ArrowRight className="w-4 h-4 text-green-500" />
                    {step}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyber-blue-400 hover:bg-cyber-blue-500 
                       text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 
                       hover:shadow-xl hover:shadow-cyber-blue-400/50"
            >
              Back to Home
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </GlassPanel>
    </div>
  );
}
