"use client";

import { useState } from "react";
import { Code, Zap, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { ConcentricRings } from "@/components/effects/react-effects-lib/src/components/effects/ConcentricRings";
import { motion, AnimatePresence } from "framer-motion";
import ApiResults from "./ApiResults";
import SubmissionCard from "./SubmissionCard";

interface CodeSubmissionBoxProps {
  onSubmit: (submission: any) => void;
}

export default function CodeSubmissionBox({ onSubmit }: CodeSubmissionBoxProps) {
  const [codeText, setCodeText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds

  const handleSubmit = async () => {
    if (!codeText.trim()) return;

    setIsChecking(true);
    setResult(null);

    try {
      // Submit code text
      const submitResponse = await fetch("/api/submissions/code/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeText: codeText
        }),
      });

      const submitData = await submitResponse.json();

      // Evaluate code using OpenRouter API
      const evaluateResponse = await fetch("/api/submissions/code/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submitData.id,
          codeText: codeText
        }),
      });

      const evaluateData = await evaluateResponse.json();
      setResult(evaluateData);

      if (evaluateData.status === "correct") {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      onSubmit({
        type: "code",
        link: "Code Text Submission",
        status: evaluateData.status,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Submission error:", error);
      setResult({
        status: "error",
        message: "Failed to evaluate code. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  };

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

  return (
    <SubmissionCard
      title="CODE SUBMISSION"
      icon={<Zap className="w-6 h-6" />}
      color="cyber-blue-400"
    >
      {/* Timer */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyber-blue-400/20">
        <span className="text-sm text-gray-400">Time Remaining:</span>
        <span className={`text-2xl font-bold tabular-nums ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>

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
            animate={{
              x: [-100, 400],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
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
            className="w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-cyber-blue-400 to-neon-blue text-hack-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(28,171,242,0.4)] hover:shadow-[0_0_30px_rgba(28,171,242,0.6)] cursor-pointer"
            {...(isChecking || !codeText.trim() ? {} : { tabIndex: 0 })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isChecking && codeText.trim()) {
                  handleSubmit();
                }
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating Code...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Submit & Check</span>
                </>
              )}
            </div>
            {!isChecking && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: [-200, 400],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )
            }</motion.div>
        </MagneticButton>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="px-6 py-4 glass-panel border border-alert-red/30 text-alert-red font-semibold rounded-xl hover:bg-alert-red/10 transition-all duration-300"
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
            <ConcentricRings
              color="#00FF41"
              count={5}
              duration={1000}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SubmissionCard>
  );
}