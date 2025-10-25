"use client";

import { useState, useEffect } from "react";
import { Globe, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { Input } from "@/components/ui/modern-ui/src/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import SubmissionCard from "./SubmissionCard";

interface DeploymentSubmissionBoxProps {
  onSubmit: (submission: any) => void;
  disabled?: boolean;
}

export default function DeploymentSubmissionBox({
  onSubmit,
}: DeploymentSubmissionBoxProps) {
  const [deployUrl, setDeployUrl] = useState("");

  const handleSubmit = async () => {
    if (!deployUrl.trim()) return;

    try {
      const response = await fetch("/api/submissions/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deployUrl,
          action: "submit",
        }),
      });

      const data = await response.json();

      onSubmit({
        type: "deployment",
        link: deployUrl,
        status: "live",
        timestamp: new Date(),
      });

      console.log("Deployment submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <SubmissionCard
      title="LIVE DEPLOYMENT"
      icon={<Globe className="w-6 h-6" />}
      color="neon-blue"
    >
      {/* Input Field */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neon-blue mb-3">
          Live URL (Vercel, Netlify, etc.)
        </label>
        <div className="relative group">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-blue transition-colors z-10" />
          <Input
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            placeholder="https://your-project.vercel.app"
            className="w-full bg-hack-navy/50 border-neon-blue/30 pl-12 pr-4 py-4 rounded-xl text-gray-200 placeholder-gray-500 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <MagneticButton className="flex-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-neon-blue to-electric-cyan text-hack-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] cursor-pointer"
            {...(!deployUrl.trim() ? {} : { tabIndex: 0 })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (deployUrl.trim()) {
                  handleSubmit();
                }
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Submit Deployment</span>
            </div>
          </motion.div>
        </MagneticButton>
      </div>
    </SubmissionCard>
  );
}
