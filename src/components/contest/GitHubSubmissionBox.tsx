"use client";

import { useState, useEffect } from "react";
import {
  Github,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock, // Changed from Timer to Clock
  AlertCircle,
} from "lucide-react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { Input } from "@/components/ui/modern-ui/src/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import SubmissionCard from "./SubmissionCard";

interface GitHubSubmissionBoxProps {
  onSubmit: (submission: any) => void;
  disabled?: boolean;
}

interface GitHubSubmissionBoxProps {
  onSubmit: (submission: any) => void;
}

export default function GitHubSubmissionBox({
  onSubmit,
}: GitHubSubmissionBoxProps) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = async () => {
    if (!repoUrl.trim()) return;

    try {
      const response = await fetch("/api/submissions/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          action: "submit",
        }),
      });

      const data = await response.json();

      onSubmit({
        type: "github",
        link: repoUrl,
        status: "submitted",
        timestamp: new Date(),
      });

      // Show success message in console
      console.log("Repository submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <SubmissionCard
      title="GITHUB REPOSITORY"
      icon={<Github className="w-6 h-6 text-electric-cyan" />}
      color="electric-cyan"
    >
      {/* Input Field */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-electric-cyan mb-3">
          Repository URL
        </label>
        <div className="relative group">
          <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-electric-cyan transition-colors z-10" />
          <Input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="w-full bg-hack-navy/50 border-electric-cyan/30 pl-12 pr-4 py-4 rounded-xl text-gray-200 placeholder-gray-500 focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <MagneticButton className="flex-1">
          <motion.div
            whileHover={{ scale: !repoUrl.trim() ? 1 : 1.02 }}
            whileTap={{ scale: !repoUrl.trim() ? 1 : 0.98 }}
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-electric-cyan to-neon-blue text-hack-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(0,255,247,0.4)] hover:shadow-[0_0_30px_rgba(0,255,247,0.6)] cursor-pointer"
            {...(!repoUrl.trim() ? {} : { tabIndex: 0 })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (repoUrl.trim()) {
                  handleSubmit();
                }
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              <span>Submit Repository</span>
            </div>
          </motion.div>
        </MagneticButton>
      </div>
    </SubmissionCard>
  );
}
