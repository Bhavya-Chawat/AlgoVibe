"use client";

import { useState, useEffect } from "react";
import { Code2, Trophy, Clock, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import CompactTimer from "@/components/contest/CompactTimer";
import React from "react";
import { getContestStatus } from "@/app/actions/contest";

interface Problem {
  problem_id: number;
  title: string;
  description: any; // JSON parsed object, structured content or string (to parse)
}

interface ProblemStatementProps {
  problem: Problem;
}

// Timer wrapper to fetch real contest times and feed to CompactTimer
function ContestTimerWrapper() {
  const [contest, setContest] = useState<{
    start_time: string;
    end_time: string;
    is_active: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchContest() {
      const res = await getContestStatus();
      if (res.success && res.contest) {
        setContest(res.contest);
      }
    }
    fetchContest();
  }, []);

  if (!contest) return null;

  // Calculate timer status
  const now = new Date();
  const start = new Date(contest.start_time);
  const end = new Date(contest.end_time);

  let status: "upcoming" | "live" | "ended" = "upcoming";
  if (now >= start && now <= end) status = "live";
  else if (now > end) status = "ended";

  return (
    <div className="mb-8">
      <CompactTimer status={status} startTimeISO={contest.start_time} endTimeISO={contest.end_time} />
    </div>
  );
}

// Components to render JSON blocks (Heading, Paragraph, List, CodeBlock) - unchanged
const Heading = ({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) => {
  switch (level) {
    case 1:
      return <h1 className="text-5xl font-bold mb-6">{children}</h1>;
    case 2:
      return <h2 className="text-4xl font-bold mb-5">{children}</h2>;
    case 3:
      return <h3 className="text-3xl font-bold mb-4">{children}</h3>;
    default:
      return <h4 className="text-2xl font-bold mb-3">{children}</h4>;
  }
};

const Paragraph = ({ text }: { text: string }) => (
  <p className="mb-4 text-gray-300 text-xl leading-relaxed">{text}</p>
);

const List = ({
  items,
  ordered,
  heading,
}: {
  items: string[];
  ordered?: boolean;
  heading?: string;
}) => (
  <>
    {heading && (
      <h3 className="text-2xl font-bold text-cyber-blue-400 mb-3 flex items-center gap-4">
        {heading}
      </h3>
    )}
    {ordered ? (
      <ol className="list-decimal list-inside space-y-2 text-gray-300 text-xl">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    ) : (
      <ul className="list-disc list-inside space-y-2 text-gray-300 text-xl">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
  </>
);

const CodeBlock = ({ text }: { text: string }) => (
  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-green-400 text-lg whitespace-pre-wrap mb-6">
    {text}
  </pre>
);

export default function ProblemStatement({ problem }: ProblemStatementProps) {
  // Parse description to JSON if it is string from Supabase
  let parsedDescription;
  try {
    parsedDescription =
      typeof problem.description === "string"
        ? JSON.parse(problem.description)
        : problem.description;
  } catch {
    parsedDescription = null;
  }

  const renderContent = (content: any) => {
    if (!Array.isArray(content))
      return (
        <p className="text-red-500">
          Problem description is invalid or missing.
        </p>
      );

    return content.map((block, idx) => {
      switch (block.type) {
        case "heading":
          return (
            <Heading key={idx} level={block.level}>
              {block.text}
              <div className="my-6 border-b border-gray-700" /> {/* separator */}
            </Heading>
          );
        case "paragraph":
          return <Paragraph key={idx} text={block.text} />;
        case "list":
          return (
            <>
              <List
                key={idx}
                items={block.items}
                ordered={block.ordered}
                heading={block.heading}
              />
              <div className="my-6" /> {/* spacer */}
            </>
          );
        case "code":
          return <CodeBlock key={idx} text={block.text} />;
        case "spacer":
          return <div key={idx} style={{ height: "2rem" }} />; // empty vertical space
        default:
          return null;
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel-strong p-12 rounded-3xl border-2 border-cyber-blue-400/40 relative overflow-hidden"
      style={{
        boxShadow: "0 0 60px rgba(28, 171, 242, 0.5)",
      }}
    >
      {/* Use contest timer with real data */}
      <ContestTimerWrapper />

      {/* Header with glowing title */}
      <div className="mb-10 pb-10 border-b border-cyber-blue-400/30">
        <div className="flex items-start justify-between gap-8 mb-8">
          <h1 className="text-5xl font-bold text-gradient flex-1">{problem.title}</h1>
          <Code2 className="w-12 h-12 text-cyber-blue-400 flex-shrink-0" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 text-lg text-gray-300">
            <Trophy className="w-8 h-8 text-warning-orange" />
            <span className="font-bold text-warning-orange text-2xl">100 Points</span>
          </div>

          <div className="flex items-center gap-4 text-lg text-gray-400">
            <Clock className="w-8 h-8" />
            <span className="text-2xl">90 minutes</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10">
        <h3 className="text-3xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
          <div className="w-3 h-12 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
          Problem Description
        </h3>
        <div className="text-gray-300 text-xl leading-relaxed">{renderContent(parsedDescription)}</div>
      </div>

      {/* Requirements */}
      <div className="mb-10 glass-panel p-8 rounded-2xl border-2 border-cyber-blue-400/20">
        <h3 className="text-2xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8" />
          Submission Requirements
        </h3>
        <ul className="space-y-4 text-gray-300 text-xl">
          <li className="flex items-start gap-4">
            <Check className="w-8 h-8 text-matrix-green mt-1 flex-shrink-0" />
            <span>Code submission with your solution</span>
          </li>
          <li className="flex items-start gap-4">
            <Check className="w-8 h-8 text-matrix-green mt-1 flex-shrink-0" />
            <span>GitHub repository with clean, documented code</span>
          </li>
          <li className="flex items-start gap-4">
            <Check className="w-8 h-8 text-matrix-green mt-1 flex-shrink-0" />
            <span>Live deployment URL (Vercel, Netlify, GitHub Pages, etc.)</span>
          </li>
        </ul>
      </div>

      {/* Evaluation Criteria */}
      <div className="mb-10 glass-panel p-8 rounded-2xl border-2 border-warning-orange/20">
        <h3 className="text-2xl font-bold text-warning-orange mb-6 flex items-center gap-4">
          <Trophy className="w-8 h-8" />
          Evaluation Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Code Quality</span>
              <span className="text-cyber-blue-400 font-mono">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Functionality</span>
              <span className="text-cyber-blue-400 font-mono">30%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Documentation</span>
              <span className="text-cyber-blue-400 font-mono">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-lg">Deployment</span>
              <span className="text-cyber-blue-400 font-mono">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="glass-panel p-8 rounded-2xl border-2 border-alert-red/20 bg-alert-red/5">
        <h3 className="text-2xl font-bold text-alert-red mb-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8" />
          Important Notes
        </h3>
        <ul className="space-y-4 text-gray-300 text-lg">
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>You can submit multiple times. Only your latest submission will be evaluated.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>Ensure your deployment is publicly accessible for evaluation.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>Include a README.md with setup instructions in your GitHub repository.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>All submissions must be made before the timer expires.</span>
          </li>
        </ul>
      </div>

      {/* Animated glow pulse effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-3xl pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(28, 171, 242, 0.2), transparent 70%)",
        }}
      />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyber-blue-400/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-neon-blue/20 to-transparent rounded-tr-full pointer-events-none" />
    </motion.div>
  );
}
