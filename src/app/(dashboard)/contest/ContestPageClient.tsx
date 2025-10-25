"use client";

import { useState } from "react";
import ContestHeader from "@/components/layout/ContestHeader";
import ProblemStatement from "@/components/contest/ProblemStatement";
import CodeSubmissionBox from "@/components/contest/CodeSubmissionBox";
import GitHubSubmissionBox from "@/components/contest/GitHubSubmissionBox";
import DeploymentSubmissionBox from "@/components/contest/DeploymentSubmissionBox";
import SubmissionHistory from "@/components/contest/SubmissionHistory";
import { motion } from "framer-motion";
import { submitCode } from "@/app/actions/submissions";

interface Problem {
  problem_id: number;
  title: string;
  description: string;
}

interface Submission {
  submission_id: number;
  code?: string;
  github_link?: string;
  deployment_link?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  score?: number;
  feedback?: string;
  submitted_at: string;
}

interface ContestPageClientProps {
  problem: Problem | null;
  initialSubmissions: Submission[];
  teamId: number;
}

export default function ContestPageClient({
  problem,
  initialSubmissions,
  teamId,
}: ContestPageClientProps) {
  const [submissions, setSubmissions] =
    useState<Submission[]>(initialSubmissions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewSubmission = async (submissionData: {
    code?: string;
    github_link?: string;
    deployment_link?: string;
  }) => {
    setIsSubmitting(true);

    try {
      const result = await submitCode({
        ...submissionData,
        teamId,
      });

      if (result.success && result.submission) {
        // Add new submission to the top of the list
        setSubmissions((prev) => [result.submission, ...prev]);
      } else {
        alert(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Particle configuration
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));

  if (!problem) {
    return (
      <div className="min-h-screen bg-hack-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            No Problem Assigned
          </h2>
          <p className="text-gray-400">Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hack-black relative overflow-hidden">
      <ContestHeader />

      {/* Background Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        <div className="max-w-[1920px] mx-auto px-6 py-8">
          <div className="flex flex-col">
            {/* Full Width Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full mb-12"
            >
              <ProblemStatement problem={problem} />
            </motion.div>

            {/* Submission Boxes */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              {/* Code Submission Box */}
              <div className="mb-6">
                <CodeSubmissionBox
                  onSubmit={handleNewSubmission}
                  disabled={isSubmitting}
                />
              </div>

              {/* GitHub and Deployment boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <GitHubSubmissionBox
                  onSubmit={handleNewSubmission}
                  disabled={isSubmitting}
                />
                <DeploymentSubmissionBox
                  onSubmit={handleNewSubmission}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submission History */}
              <div className="mt-6">
                <SubmissionHistory
                  submissions={submissions.map((sub) => ({
                    id: String(sub.submission_id),
                    type: sub.code
                      ? "code"
                      : sub.github_link
                      ? "github"
                      : "deployment",
                    link: sub.github_link || sub.deployment_link || "",
                    status: sub.status.toLowerCase() as
                      | "pending"
                      | "submitted"
                      | "accepted"
                      | "rejected",
                    timestamp: new Date(sub.submitted_at),
                    score: sub.score,
                    message: sub.feedback,
                  }))}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {particles.map(({ id, left, top, duration, delay }) => (
          <motion.div
            key={id}
            className="absolute w-1 h-1 bg-cyber-blue-400/30 rounded-full"
            style={{ left, top }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
