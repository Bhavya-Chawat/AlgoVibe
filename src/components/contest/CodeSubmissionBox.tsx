"use client";

import { useState, useEffect } from "react";
import { Code, Zap, Loader2, Clock } from "lucide-react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { ConcentricRings } from "@/components/effects/react-effects-lib/src/components/effects/ConcentricRings";
import { motion, AnimatePresence } from "framer-motion";
import ApiResults from "./ApiResults";
import SubmissionCard from "./SubmissionCard";
import { submitSubmission } from "@/app/actions/contest";

interface CodeSubmissionBoxProps {
  onSubmit: (submission: any) => void;
  disabled?: boolean;
}

export default function CodeSubmissionBox({
  onSubmit,
}: CodeSubmissionBoxProps) {
  const [codeText, setCodeText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [cooldownTime, setCooldownTime] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!codeText.trim()) return;

    setIsChecking(true);
    setResult(null);

    try {
      // Call server action to submit code and trigger AI evaluation
      const res = await submitSubmission({
        submission: codeText,
        submission_type: "code",
      });

      if (!res.success) {
        setResult({
          verdict: "incorrect",
          feedback: res.error || "Submission failed",
        });
        // Check if it's a cooldown error
        if (res.error && res.error.includes("Please wait")) {
          // Extract minutes from error message
          const match = res.error.match(/Please wait (\d+) minute/);
          if (match) {
            setCooldownTime(parseInt(match[1], 10) * 60); // Convert to seconds
          }
        }
        setIsChecking(false);
        return;
      }

      // Get the AI verdict and feedback from the response
      // If you store aiResult into submission, use those fields directly.
      const verdict =
        res.submission.ai_verdict ||
        (res.submission.status === "ACCEPTED" ? "correct" : "incorrect");
      const feedback = res.submission.feedback || "";

      setResult({
        verdict,
        feedback,
      });

      if (verdict === "correct") {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      // Pass the correct data structure to onSubmit
      onSubmit({
        submission: codeText,
        submission_type: "code",
      });

      // Reset cooldown time on successful submission
      setCooldownTime(null);
    } catch (error) {
      console.error("Submission error:", error);
      setResult({
        verdict: "incorrect",
        feedback: "Failed to submit and evaluate code.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownTime !== null && cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  const handleClear = () => {
    setCodeText("");
    setResult(null);
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

  // Format cooldown time
  const formatCooldownTime = (seconds: number | null) => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <SubmissionCard
      title="CODE SUBMISSION"
      icon={<Zap className="w-6 h-6" />}
      color="cyber-blue-400"
    >
      {/* Code Text Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-cyber-blue-400 mb-3">
          Paste Your Code Solution
        </label>
        <div className="relative group">
          <Code className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
          <textarea
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
            placeholder="Paste your code solution here..."
            className="w-full h-64 bg-hack-navy/50 border-cyber-blue-400/30 pl-12 pr-4 py-4 rounded-xl text-gray-200 placeholder-gray-500 focus:border-cyber-blue-400 focus:ring-2 focus:ring-cyber-blue-400/20 transition-all duration-300 font-mono text-sm resize-y"
            disabled={isChecking}
          />
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-blue-400/0 via-cyber-blue-400/5 to-cyber-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            animate={{ x: [-100, 400] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <MagneticButton
          className="flex-1"
          disabled={isChecking || !codeText.trim() || cooldownTime !== null}
        >
          <motion.div
            whileHover={{
              scale:
                !isChecking && codeText.trim() && cooldownTime === null
                  ? 1.02
                  : 1,
            }}
            whileTap={{
              scale:
                !isChecking && codeText.trim() && cooldownTime === null
                  ? 0.98
                  : 1,
            }}
            onClick={handleSubmit}
            className={`w-full relative overflow-hidden px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(28,171,242,0.4)] hover:shadow-[0_0_30px_rgba(28,171,242,0.6)] cursor-pointer ${
              cooldownTime !== null
                ? "bg-gray-600 text-gray-300"
                : "bg-gradient-to-r from-cyber-blue-400 to-neon-blue text-hack-black font-bold"
            }`}
            {...(isChecking || !codeText.trim() || cooldownTime !== null
              ? {}
              : { tabIndex: 0 })}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                !isChecking &&
                codeText.trim() &&
                cooldownTime === null
              ) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating Code...</span>
                </>
              ) : cooldownTime !== null ? (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Cooldown: {formatCooldownTime(cooldownTime)}</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Submit & Check</span>
                </>
              )}
            </div>
            {!isChecking && cooldownTime === null && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 400] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        </MagneticButton>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="px-6 py-4 glass-panel border border-alert-red/30 text-alert-red font-semibold rounded-xl hover:bg-alert-red/10 transition-all duration-300"
          disabled={cooldownTime !== null}
        >
          Clear
        </motion.button>
      </div>

      {/* Results Panel */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="api-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ApiResults result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success-animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <ConcentricRings color="#00FF41" count={5} duration={1000} />
          </motion.div>
        )}
      </AnimatePresence>
    </SubmissionCard>
  );
}
