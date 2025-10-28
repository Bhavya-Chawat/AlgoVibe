"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { Input } from "@/components/ui/modern-ui/src/components/ui/Input";
import { motion } from "framer-motion";
import SubmissionCard from "./SubmissionCard";
import { submitSubmission } from "@/app/actions/contest";

interface DeploymentSubmissionBoxProps {
  onSubmit: (submission: any) => void;
  disabled?: boolean;
}

export default function DeploymentSubmissionBox({
  onSubmit,
  disabled,
}: DeploymentSubmissionBoxProps) {
  const [deployUrl, setDeployUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!deployUrl.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const result = await submitSubmission({
        submission: deployUrl.trim(),
        submission_type: "deployment",
      });

      if (!result.success) {
        console.error(result.error);
        setSuccessMessage(`Submission failed: ${result.error}`);
        return;
      }

      onSubmit({
        type: "deployment",
        submission: deployUrl.trim(),
        status: "submitted",
        timestamp: new Date(),
      });

      setSuccessMessage("Deployment URL submitted successfully!");
      setDeployUrl("");
    } catch (error) {
      console.error("Submission error:", error);
      setSuccessMessage("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubmissionCard
      title="LIVE DEPLOYMENT"
      icon={<Globe className="w-6 h-6 text-electric-cyan" />}
      color="electric-cyan"
    >
      <div className="mb-6">
        <label className="block text-sm font-semibold text-electric-cyan mb-3">
          Live URL (Vercel, Netlify, etc.)
        </label>
        <div className="relative group">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-electric-cyan transition-colors z-10" />
          <Input
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            placeholder="https://your-project.vercel.app"
            className="w-full bg-hack-navy/50 border-electric-cyan/30 pl-12 pr-4 py-4 rounded-xl text-gray-200 placeholder-gray-500 focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all duration-300"
            disabled={isSubmitting || disabled}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <MagneticButton
          className="flex-1"
          disabled={isSubmitting || !deployUrl.trim() || disabled}
        >
          <motion.div
            whileHover={{
              scale: !isSubmitting && deployUrl.trim() && !disabled ? 1.02 : 1,
            }}
            whileTap={{
              scale: !isSubmitting && deployUrl.trim() && !disabled ? 0.98 : 1,
            }}
            onClick={handleSubmit}
            className={`w-full px-6 py-4 bg-gradient-to-r from-electric-cyan to-neon-blue text-hack-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(0,255,247,0.4)] hover:shadow-[0_0_30px_rgba(0,255,247,0.6)] cursor-pointer`}
            {...(deployUrl.trim() && !isSubmitting && !disabled
              ? { tabIndex: 0 }
              : {})}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                deployUrl.trim() &&
                !isSubmitting &&
                !disabled
              ) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              <span>
                {isSubmitting ? "Submitting..." : "Submit Deployment"}
              </span>
            </div>
          </motion.div>
        </MagneticButton>
      </div>

      {successMessage && (
        <p
          className={`text-center font-semibold mb-4 ${
            successMessage.startsWith("Submission failed")
              ? "text-red-500"
              : "text-green-400"
          }`}
        >
          {successMessage}
        </p>
      )}
    </SubmissionCard>
  );
}
