"use client";

import { useState } from "react";
import { Globe, CheckCircle, XCircle, Loader2, ExternalLink, Eye } from "lucide-react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { Input } from "@/components/ui/modern-ui/src/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import SubmissionCard from "./SubmissionCard";

interface DeploymentSubmissionBoxProps {
  onSubmit: (submission: any) => void;
}

export default function DeploymentSubmissionBox({ onSubmit }: DeploymentSubmissionBoxProps) {
  const [deployUrl, setDeployUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);

  const checkAccessibility = async () => {
    if (!deployUrl.trim()) return;

    setIsChecking(true);
    setStatus(null);

    try {
      const response = await fetch("/api/submissions/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deployUrl,
          action: "check",
        }),
      });

      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Accessibility check error:", error);
      setStatus({
        accessible: false,
        message: "Failed to check deployment accessibility",
      });
    } finally {
      setIsChecking(false);
    }
  };

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

      setStatus({
        accessible: true,
        message: "Deployment submitted successfully!",
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
      title="LIVE DEPLOYMENT"
      icon={<Globe className="w-6 h-6" />}
      color="neon-blue"
    >
      {/* Timer */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neon-blue/20">
        <span className="text-sm text-gray-400">Time Remaining:</span>
        <span className={`text-2xl font-bold tabular-nums ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>

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
            disabled={isChecking}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <MagneticButton className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isChecking || !deployUrl.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-neon-blue to-electric-cyan text-hack-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)]"
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Submit Deployment</span>
            </div>
          </motion.button>
        </MagneticButton>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(!showPreview)}
          disabled={!deployUrl.trim()}
          className="px-6 py-4 glass-panel border border-neon-blue/30 text-neon-blue font-semibold rounded-xl hover:bg-neon-blue/10 transition-all duration-300 disabled:opacity-50"
        >
          <Eye className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={checkAccessibility}
          disabled={isChecking || !deployUrl.trim()}
          className="px-6 py-4 glass-panel border border-neon-blue/30 text-neon-blue font-semibold rounded-xl hover:bg-neon-blue/10 transition-all duration-300 disabled:opacity-50"
        >
          {isChecking ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Check"
          )}
        </motion.button>
      </div>

      {/* Status Display */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 rounded-xl border border-neon-blue/20 mb-6 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              {status.accessible ? (
                <CheckCircle className="w-6 h-6 text-matrix-green flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-alert-red flex-shrink-0 mt-1" />
              )}
              
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${status.accessible ? "text-matrix-green" : "text-alert-red"}`}>
                  Status: {status.accessible ? "Accessible" : "Not Accessible"}
                </h4>
                
                {status.message && (
                  <p className="text-gray-400 text-sm mb-3">{status.message}</p>
                )}

                {status.responseTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Response Time:</span>
                    <span className="text-neon-blue font-semibold">{status.responseTime}ms</span>
                  </div>
                )}
              </div>
            </div>

            {deployUrl && status.accessible && (
              <motion.a
                href={deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-2 glass-panel border border-neon-blue/30 text-neon-blue rounded-lg hover:bg-neon-blue/10 transition-all"
              >
                <span className="text-sm font-semibold">Visit Live Site</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview iframe */}
      <AnimatePresence>
        {showPreview && deployUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-neon-blue/30"
          >
            <div className="glass-panel-strong p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-neon-blue">Live Preview</h4>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="relative bg-hack-black rounded-lg overflow-hidden" style={{ height: "400px" }}>
                <iframe
                  src={deployUrl}
                  className="w-full h-full"
                  title="Deployment Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
                <div className="absolute inset-0 pointer-events-none border border-neon-blue/20 rounded-lg" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SubmissionCard>
  );
}