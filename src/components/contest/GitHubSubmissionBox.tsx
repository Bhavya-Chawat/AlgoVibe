"use client";

import { useState, useEffect } from "react";
import {
  Github,
  CheckCircle,
  XCircle,
  Loader2,
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
}

export default function GitHubSubmissionBox({ onSubmit }: GitHubSubmissionBoxProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);

  // Add timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add disabled state for submission
  const isSubmissionDisabled = isValidating || !repoUrl.trim() || timeRemaining <= 0;

  // Update validation function with better error handling
  const validateRepo = async () => {
    if (!repoUrl.trim()) return;
    
    try {
      setIsValidating(true);
      setValidation(null);

      const githubUrlRegex = /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
      if (!githubUrlRegex.test(repoUrl)) {
        throw new Error("Invalid GitHub repository URL format");
      }

      const response = await fetch("/api/submissions/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          action: "validate",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate repository");
      }

      const data = await response.json();
      setValidation(data);
    } catch (error) {
      setValidation({
        isValid: false,
        message: error instanceof Error ? error.message : "Failed to validate repository",
      });
    } finally {
      setIsValidating(false);
    }
  };

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

      // Show success message
      setValidation({
        isValid: true,
        message: "Repository submitted successfully!",
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const getTimerColor = () => {
    if (timeRemaining > 1800) return "text-matrix-green";
    if (timeRemaining > 600) return "text-warning-orange";
    return "text-alert-red animate-pulse";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <SubmissionCard
      title="GITHUB REPOSITORY"
      icon={<Github className="w-6 h-6 text-electric-cyan" />} // Added text color
      color="electric-cyan"
    >
      {/* Timer with warning message when time is low */}
      <div className="flex flex-col gap-2 mb-6 pb-4 border-b border-electric-cyan/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" /> {/* Changed from Timer to Clock */}
            <span className="text-sm">Time Remaining:</span>
          </div>
          <span className={`text-2xl font-bold tabular-nums ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        {timeRemaining <= 600 && (
          <div className="flex items-center gap-2 text-alert-red text-sm animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span>Less than 10 minutes remaining!</span>
          </div>
        )}
      </div>

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
            disabled={isValidating}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <MagneticButton className="flex-1">
          <motion.button
            whileHover={{ scale: isSubmissionDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isSubmissionDisabled ? 1 : 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmissionDisabled}
            className="w-full px-6 py-4 bg-gradient-to-r from-electric-cyan to-neon-blue text-hack-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(0,255,247,0.4)] hover:shadow-[0_0_30px_rgba(0,255,247,0.6)]"
          >
            <div className="flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              <span>{timeRemaining <= 0 ? "Time's Up!" : "Submit Repository"}</span>
            </div>
          </motion.button>
        </MagneticButton>

        <motion.button
          whileHover={{ scale: isSubmissionDisabled ? 1 : 1.05 }}
          whileTap={{ scale: isSubmissionDisabled ? 1 : 0.95 }}
          onClick={validateRepo}
          disabled={isSubmissionDisabled}
          className="px-6 py-4 glass-panel border border-electric-cyan/30 text-electric-cyan font-semibold rounded-xl hover:bg-electric-cyan/10 transition-all duration-300 disabled:opacity-50"
        >
          {isValidating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Validate"
          )}
        </motion.button>
      </div>

      {/* Validation Results */}
      <AnimatePresence mode="wait">
        {validation && (
          <motion.div
            key="validation-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6 rounded-xl border border-electric-cyan/20"
          >
            <div className="flex items-start gap-4">
              {validation.isValid ? (
                <CheckCircle className="w-6 h-6 text-matrix-green flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-alert-red flex-shrink-0" />
              )}
              
              <div className="flex-1 space-y-3">
                <h4 className={`font-semibold ${
                  validation.isValid ? "text-matrix-green" : "text-alert-red"
                }`}>
                  {validation.isValid ? "Validation Passed" : "Validation Failed"}
                </h4>
                
                {validation.checks && (
                  <motion.ul 
                    className="space-y-2 text-sm"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                  >
                    {validation.checks.map((check: any, index: number) => (
                      <motion.li
                        key={index}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        className="flex items-center gap-2"
                      >
                        {check.passed ? (
                          <CheckCircle className="w-4 h-4 text-matrix-green" />
                        ) : (
                          <XCircle className="w-4 h-4 text-alert-red" />
                        )}
                        <span className="text-gray-300">{check.message}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}

                {validation.message && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 text-sm"
                  >
                    {validation.message}
                  </motion.p>
                )}

                {validation.lastUpdated && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-xs"
                  >
                    Last Updated: {new Date(validation.lastUpdated).toLocaleString()}
                  </motion.p>
                )}
              </div>
            </div>

            {repoUrl && validation.isValid && (
              <motion.a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-2 glass-panel border border-electric-cyan/30 text-electric-cyan rounded-lg hover:bg-electric-cyan/10 transition-all"
              >
                <span className="text-sm font-semibold">View Repository</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SubmissionCard>
  );
}