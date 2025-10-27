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
      <CompactTimer
        status={status}
        startTimeISO={contest.start_time}
        endTimeISO={contest.end_time}
      />
    </div>
  );
}

// Components to render JSON blocks (Heading, Paragraph, List, CodeBlock) with updated display logic

const Heading = ({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) => {
  // Special styling for specific headings
  const getHeadingStyle = () => {
    if (typeof children === "string") {
      if (children.includes("Constraints")) {
        return "text-alert-red";
      } else if (children.includes("Output Format")) {
        return "text-matrix-green";
      } else if (children.includes("Requirements")) {
        return "text-neon-blue";
      } else if (
        children.includes("Grand Vision") ||
        children.includes("Technical Challenge")
      ) {
        return "text-warning-orange";
      }
    }
    return "text-cyber-blue-400";
  };

  const headingStyle = getHeadingStyle();
  const isMainTitle =
    level === 2 &&
    typeof children === "string" &&
    children.includes("Lanterns");

  switch (level) {
    case 1:
      return (
        <h1
          className={`text-5xl font-bold mb-6 ${headingStyle} ${
            isMainTitle ? "text-gradient" : ""
          }`}
        >
          {isMainTitle ? <GlitchText text={children as string} /> : children}
        </h1>
      );
    case 2:
      return (
        <h2
          className={`text-4xl font-bold mb-5 ${headingStyle} ${
            isMainTitle ? "text-gradient" : ""
          }`}
        >
          {isMainTitle ? <GlitchText text={children as string} /> : children}
        </h2>
      );
    case 3:
      return (
        <h3 className={`text-3xl font-bold mb-4 ${headingStyle}`}>
          {children}
        </h3>
      );
    default:
      return (
        <h4 className={`text-2xl font-bold mb-3 ${headingStyle}`}>
          {children}
        </h4>
      );
  }
};

// Glitch text component for the main title
const GlitchText = ({ text }: { text: string }) => (
  <div className="relative inline-block">
    <span className="relative z-10">{text}</span>
    <span
      className="absolute top-0 left-0 text-alert-red opacity-70 animate-pulse"
      style={{
        transform: "translate(-2px, -1px) skew(-5deg)",
        animation: "glitch-1 2s infinite",
      }}
    >
      {text}
    </span>
    <span
      className="absolute top-0 left-0 text-neon-blue opacity-70 animate-pulse"
      style={{
        transform: "translate(2px, 1px) skew(5deg)",
        animation: "glitch-2 3s infinite",
      }}
    >
      {text}
    </span>
    <style jsx>{`
      @keyframes glitch-1 {
        0%,
        100% {
          transform: translate(0);
        }
        10% {
          transform: translate(-3px, -1px) skew(-5deg);
        }
        20% {
          transform: translate(2px, 1px) skew(3deg);
        }
        30% {
          transform: translate(-1px, -2px) skew(2deg);
        }
        40% {
          transform: translate(1px, 2px) skew(-1deg);
        }
        50% {
          transform: translate(-2px, 1px) skew(4deg);
        }
        60% {
          transform: translate(3px, -1px) skew(-3deg);
        }
        70% {
          transform: translate(-1px, 2px) skew(2deg);
        }
        80% {
          transform: translate(2px, -2px) skew(-4deg);
        }
        90% {
          transform: translate(-3px, 1px) skew(3deg);
        }
      }

      @keyframes glitch-2 {
        0%,
        100% {
          transform: translate(0);
        }
        5% {
          transform: translate(1px, -1px) skew(2deg);
        }
        15% {
          transform: translate(-2px, 2px) skew(-3deg);
        }
        25% {
          transform: translate(3px, 1px) skew(1deg);
        }
        35% {
          transform: translate(-1px, -2px) skew(4deg);
        }
        45% {
          transform: translate(2px, 2px) skew(-2deg);
        }
        55% {
          transform: translate(-3px, -1px) skew(3deg);
        }
        65% {
          transform: translate(1px, 1px) skew(-4deg);
        }
        75% {
          transform: translate(-2px, -2px) skew(2deg);
        }
        85% {
          transform: translate(3px, 1px) skew(-1deg);
        }
        95% {
          transform: translate(-1px, 2px) skew(3deg);
        }
      }
    `}</style>
  </div>
);

const Paragraph = ({ text }: { text: string }) => (
  <p className="mb-4 text-gray-300 text-xl leading-relaxed hover:text-gray-200 transition-colors duration-200">
    {text}
  </p>
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
      <ol className="list-decimal list-inside space-y-2 text-gray-300 text-xl ml-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="pl-2 border-l-2 border-cyber-blue-400/30 hover:border-cyber-blue-400/70 transition-colors duration-200 py-1"
          >
            {item}
          </li>
        ))}
      </ol>
    ) : (
      <ul className="list-disc list-inside space-y-2 text-gray-300 text-xl ml-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="pl-2 border-l-2 border-neon-blue/30 hover:border-neon-blue/70 transition-colors duration-200 py-1"
          >
            {item}
          </li>
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

// Enhanced Card component for input/output examples
const ExampleCard = ({
  title,
  content,
  type,
}: {
  title: string;
  content: string;
  type: "input" | "output";
}) => {
  // Split content into lines for better formatting
  const lines = content.split("\n");

  return (
    <div className="my-6">
      <div
        className={`glass-panel p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform-gpu
        ${
          type === "input"
            ? "border-cyber-blue-400/40 hover:border-cyber-blue-400/70 hover:shadow-cyber-blue-400/30"
            : "border-matrix-green/40 hover:border-matrix-green/70 hover:shadow-matrix-green/30"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h4
            className={`text-xl font-bold ${
              type === "input" ? "text-cyber-blue-400" : "text-matrix-green"
            }`}
          >
            {title}
          </h4>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              type === "input"
                ? "bg-cyber-blue-400/20 text-cyber-blue-400"
                : "bg-matrix-green/20 text-matrix-green"
            }`}
          >
            {type.toUpperCase()}
          </div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-gray-300 text-lg font-mono">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-gray-600 w-8 flex-shrink-0 select-none">
                  {index + 1}.
                </span>
                <span>{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

// New component for separating input/output examples
const InputOutputExample = ({
  input,
  output,
}: {
  input: string;
  output: string;
}) => (
  <div className="my-8 p-6 glass-panel rounded-2xl border-2 border-glass-border">
    <h3 className="text-2xl font-bold text-cyber-blue-400 mb-6 flex items-center gap-3">
      <div className="w-3 h-8 bg-gradient-to-b from-cyber-blue-400 to-neon-blue rounded-full" />
      Example
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ExampleCard title="Input" content={input} type="input" />
      <ExampleCard title="Output" content={output} type="output" />
    </div>
  </div>
);

export default function ProblemStatement({ problem }: ProblemStatementProps) {
  // Parse description to JSON if it is string from Supabase or fallback to convert plain text
  const convertPlainTextToJSON = (text: string) => {
    const lines = text.split("\n");
    const blocks = [];
    let currentParagraph = "";

    for (const line of lines) {
      if (line.trim() === "") {
        if (currentParagraph) {
          blocks.push({ type: "paragraph", text: currentParagraph.trim() });
          currentParagraph = "";
        }
        blocks.push({ type: "spacer" });
        continue;
      }

      if (line.startsWith("#")) {
        if (currentParagraph) {
          blocks.push({ type: "paragraph", text: currentParagraph.trim() });
          currentParagraph = "";
        }
        const level = (line.match(/^#+/) || [""])[0].length;
        const text = line.replace(/^#+\s*/, "");
        blocks.push({ type: "heading", level, text });
        continue;
      }

      if (line.match(/^(\s*[-*]|\s*\d+\.)\s/)) {
        if (currentParagraph) {
          blocks.push({ type: "paragraph", text: currentParagraph.trim() });
          currentParagraph = "";
        }
        // Treat as paragraph for now, list parsing can be improved later
        blocks.push({ type: "paragraph", text: line });
        continue;
      }

      if (currentParagraph) {
        currentParagraph += " " + line;
      } else {
        currentParagraph = line;
      }
    }

    if (currentParagraph) {
      blocks.push({ type: "paragraph", text: currentParagraph.trim() });
    }

    return blocks;
  };

  let parsedDescription;
  try {
    parsedDescription =
      typeof problem.description === "string"
        ? JSON.parse(problem.description)
        : problem.description;
  } catch {
    parsedDescription = convertPlainTextToJSON(problem.description || "");
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
              <div className="my-6 border-b border-gray-700" />{" "}
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
              <div className="my-6" />
            </>
          );
        case "code":
          if (block.isExample && block.input && block.output) {
            return (
              <InputOutputExample
                key={idx}
                input={block.input}
                output={block.output}
              />
            );
          }
          return <CodeBlock key={idx} text={block.text} />;
        case "spacer":
          return <div key={idx} style={{ height: "2rem" }} />;
        default:
          if (block.text) {
            return <Paragraph key={idx} text={block.text} />;
          }
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
          <h1 className="text-5xl font-bold text-gradient flex-1">
            {problem.title}
          </h1>
          <Code2 className="w-12 h-12 text-cyber-blue-400 flex-shrink-0" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 text-lg text-gray-300">
            <Trophy className="w-8 h-8 text-warning-orange" />
            <span className="font-bold text-warning-orange text-2xl">
              100 Points
            </span>
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
        <div className="text-gray-300 text-xl leading-relaxed">
          {renderContent(parsedDescription)}
        </div>
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
            <span>
              Live deployment URL (Vercel, Netlify, GitHub Pages, etc.)
            </span>
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
            <span>
              You can submit multiple times. Only your latest submission will be
              evaluated.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>
              Ensure your deployment is publicly accessible for evaluation.
            </span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-alert-red text-2xl flex-shrink-0">•</span>
            <span>
              Include a README.md with setup instructions in your GitHub
              repository.
            </span>
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
