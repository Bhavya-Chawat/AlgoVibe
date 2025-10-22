"use client";

import { useState, useEffect } from "react";
import ContestTimer from "@/components/contest/ContestTimer";
import ProblemStatement from "@/components/contest/ProblemStatement";
import CodeSubmissionBox from "@/components/contest/CodeSubmissionBox";
import GitHubSubmissionBox from "@/components/contest/GitHubSubmissionBox";
import DeploymentSubmissionBox from "@/components/contest/DeploymentSubmissionBox";
import SubmissionHistory from "@/components/contest/SubmissionHistory";
import Beams from "@/components/background/Beams";
import { GridOverlay } from "@/components/background/GridOverlay";
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
  const [contestStatus, setContestStatus] = useState<'upcoming' | 'live' | 'ended'>('live');

  useEffect(() => {
    fetchContestData();
  }, []);

  const fetchContestData = async () => {
    try {
      const response = await fetch("/api/contest/status");
      if (!response.ok) throw new Error('Failed to fetch contest status');
      const data = await response.json();
      setContestStatus(data.status);
    } catch (error) {
      console.error("Failed to fetch contest data:", error);
      // Set a fallback status if fetch fails
      setContestStatus('live');
    }
  };

  // Update the submission handler to include validation
  const handleNewSubmission = (submission: Omit<Submission, 'id' | 'timestamp'>) => {
    if (contestStatus !== 'live') {
      console.warn('Contest is not live. Submissions are not accepted.');
      return;
    }

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
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <Beams />
        <GridOverlay />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Sticky Contest Timer */}
        <ContestTimer 
          status={contestStatus}
          duration={90} // 90 minutes
        />

        {/* Contest Content Grid */}
        <div className="max-w-[1920px] mx-auto px-6 py-8 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Problem Statement */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-4"
            >
              <ProblemStatement />
            </motion.div>

            {/* Right Column - Submission Boxes */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-8 space-y-6"
            >
              <CodeSubmissionBox onSubmit={handleNewSubmission} />
              <GitHubSubmissionBox onSubmit={handleNewSubmission} />
              <DeploymentSubmissionBox onSubmit={handleNewSubmission} />
              <SubmissionHistory submissions={submissions} />
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