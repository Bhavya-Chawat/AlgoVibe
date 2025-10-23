"use client";

import { useState, useEffect } from "react";
import ProblemStatement from "@/components/contest/ProblemStatement";
import CodeSubmissionBox from "@/components/contest/CodeSubmissionBox";
import GitHubSubmissionBox from "@/components/contest/GitHubSubmissionBox";
import DeploymentSubmissionBox from "@/components/contest/DeploymentSubmissionBox";
import SubmissionHistory from "@/components/contest/SubmissionHistory";
import { motion } from "framer-motion";

// Add types for submissions and contest status
interface Submission {
  id: string;
  type: 'code' | 'github' | 'deployment';
  link: string;
  status: 'pending' | 'submitted' | 'accepted' | 'rejected';
  timestamp: Date;
  score?: number;
}

export default function ContestPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Update the submission handler to include validation
  const handleNewSubmission = (submission: Omit<Submission, 'id' | 'timestamp'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setSubmissions(prev => [newSubmission, ...prev]);
  };

  // Particle configuration
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));

  // Add submission loading from localStorage
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('contest-submissions');
    if (savedSubmissions) {
      try {
        const parsed = JSON.parse(savedSubmissions);
        setSubmissions(parsed.map((sub: any) => ({
          ...sub,
          timestamp: new Date(sub.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load saved submissions:', error);
      }
    }
  }, []);

  // Save submissions to localStorage when updated
  useEffect(() => {
    localStorage.setItem('contest-submissions', JSON.stringify(submissions));
  }, [submissions]);

  return (
    <div className="min-h-screen bg-hack-black relative overflow-hidden">
      {/* Background Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Contest Content - Full Width Problem Statement */}
        <div className="max-w-[1920px] mx-auto px-6 py-8">
          <div className="flex flex-col">
            {/* Full Width Problem Statement - Much Bigger */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full mb-12"
            >
              <ProblemStatement />
            </motion.div>

            {/* Submission Boxes - Below Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <GitHubSubmissionBox onSubmit={handleNewSubmission} />
                <DeploymentSubmissionBox onSubmit={handleNewSubmission} />
              </div>
              <div className="mb-6">
                <CodeSubmissionBox onSubmit={handleNewSubmission} />
              </div>
              <div className="mt-6">
                <SubmissionHistory submissions={submissions} />
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