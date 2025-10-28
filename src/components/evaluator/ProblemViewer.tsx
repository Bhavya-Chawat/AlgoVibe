"use client";

import { useState, useEffect } from "react";
import { FileText, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { getTeamProblem } from "@/app/(evaluator)/evaluator/actions";

interface ProblemStatement {
  problem_id: number;
  title: string;
  description: any; // Can be string or JSON object
}

interface ProblemViewerProps {
  selectedTeam?: string;
}

// Components to render JSON blocks similar to the main ProblemStatement component
const Heading = ({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) => {
  const headingStyle = "text-cyber-blue-400";

  switch (level) {
    case 1:
      return (
        <h1 className={`text-4xl font-bold mb-6 ${headingStyle}`}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={`text-3xl font-bold mb-5 ${headingStyle}`}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={`text-2xl font-bold mb-4 ${headingStyle}`}>
          {children}
        </h3>
      );
    default:
      return (
        <h4 className={`text-xl font-bold mb-3 ${headingStyle}`}>{children}</h4>
      );
  }
};

const Paragraph = ({ text }: { text: string }) => (
  <p className="mb-4 text-gray-300 text-lg leading-relaxed">{text}</p>
);

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => (
  <>
    {ordered ? (
      <ol className="list-decimal list-inside space-y-2 text-gray-300 text-lg ml-4">
        {items.map((item, i) => (
          <li key={i} className="pl-2 border-l-2 border-cyber-blue-400/30 py-1">
            {item}
          </li>
        ))}
      </ol>
    ) : (
      <ul className="list-disc list-inside space-y-2 text-gray-300 text-lg ml-4">
        {items.map((item, i) => (
          <li key={i} className="pl-2 border-l-2 border-neon-blue/30 py-1">
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

// Example card for input/output
const ExampleCard = ({
  title,
  content,
  type,
}: {
  title: string;
  content: string;
  type: "input" | "output";
}) => {
  const lines = content.split("\n");

  return (
    <div className="my-4">
      <div
        className={`glass-panel p-4 rounded-xl border ${
          type === "input"
            ? "border-cyber-blue-400/40"
            : "border-matrix-green/40"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4
            className={`text-lg font-bold ${
              type === "input" ? "text-cyber-blue-400" : "text-matrix-green"
            }`}
          >
            {title}
          </h4>
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              type === "input"
                ? "bg-cyber-blue-400/20 text-cyber-blue-400"
                : "bg-matrix-green/20 text-matrix-green"
            }`}
          >
            {type.toUpperCase()}
          </div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-gray-600 w-6 flex-shrink-0 select-none">
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

// Input/output example component
const InputOutputExample = ({
  input,
  output,
}: {
  input: string;
  output: string;
}) => (
  <div className="my-6 p-4 glass-panel rounded-2xl border border-glass-border">
    <h3 className="text-xl font-bold text-cyber-blue-400 mb-4">Example</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ExampleCard title="Input" content={input} type="input" />
      <ExampleCard title="Output" content={output} type="output" />
    </div>
  </div>
);

export default function ProblemViewer({ selectedTeam }: ProblemViewerProps) {
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (selectedTeam) {
        try {
          setIsLoading(true);
          setError(null);

          const teamId = parseInt(selectedTeam, 10);
          const result = await getTeamProblem(teamId);

          if (result.success) {
            // Handle the case where result.problem might be an array
            if (Array.isArray(result.problem)) {
              setProblem(result.problem[0] || null);
            } else {
              setProblem(result.problem || null);
            }
          } else {
            setError(result.error || "Failed to fetch problem");
          }
        } catch (err) {
          setError("An unexpected error occurred");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProblem(null);
      }
    };

    fetchProblem();
  }, [selectedTeam]);

  // Expose problem ID for other components
  if (typeof window !== "undefined" && problem) {
    (window as any).currentProblemId = problem.problem_id;
  }

  // If no team is selected, don't show anything
  if (!selectedTeam) {
    return null;
  }

  // Convert plain text to JSON-like structure
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

  // Parse description to JSON if it is string from Supabase or fallback to convert plain text
  const parseDescription = (description: any) => {
    try {
      if (typeof description === "string") {
        // Try to parse as JSON first
        return JSON.parse(description);
      }
      return description;
    } catch {
      // If parsing fails, convert plain text to JSON-like structure
      return convertPlainTextToJSON(description || "");
    }
  };

  // Render content blocks
  const renderContent = (content: any) => {
    if (!Array.isArray(content))
      return (
        <p className="text-red-500">
          Problem description is invalid or missing.
        </p>
      );

    return content.map((block: any, idx: number) => {
      switch (block.type) {
        case "heading":
          return (
            <Heading key={idx} level={block.level}>
              {block.text}
            </Heading>
          );
        case "paragraph":
          return <Paragraph key={idx} text={block.text} />;
        case "list":
          return (
            <div key={idx} className="mb-4">
              <List items={block.items} ordered={block.ordered} />
            </div>
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
          return <div key={idx} style={{ height: "1rem" }} />;
        default:
          if (block.text) {
            return <Paragraph key={idx} text={block.text} />;
          }
          return null;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Problem Statement Display */}
      {isLoading ? (
        <div className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/30 animate-pulse">
          <div className="h-8 bg-cyber-blue-400/20 rounded mb-4" />
          <div className="h-4 bg-cyber-blue-400/20 rounded mb-2" />
          <div className="h-4 bg-cyber-blue-400/20 rounded mb-2" />
          <div className="h-4 bg-cyber-blue-400/20 rounded w-2/3" />
        </div>
      ) : error ? (
        <div className="glass-panel-strong p-8 rounded-2xl border border-alert-red/30 text-center">
          <FileText className="w-12 h-12 text-alert-red mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-200 mb-2">
            Error Loading Problem
          </h3>
          <p className="text-alert-red">{error}</p>
        </div>
      ) : problem ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/20"
        >
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-cyber-blue-400/20">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gradient">
                {problem.title}
              </h2>
              <FileText className="w-8 h-8 text-cyber-blue-400 flex-shrink-0" />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-warning-orange" />
                <span className="font-bold text-warning-orange">
                  100 Points
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Problem Description
            </h3>
            <div className="text-gray-300 leading-relaxed">
              {renderContent(parseDescription(problem.description))}
            </div>
          </div>

          {/* Constraints */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Constraints</h3>
            <div className="text-gray-300 text-lg">
              <span>1 ≤ n ≤ 10^5, -10^4 ≤ arr[i] ≤ 10^4</span>
            </div>
          </div>

          {/* Sample Test Cases */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Sample Test Cases
            </h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold text-lg">Test Case 1:</p>
                <p className="text-gray-300">
                  <span className="font-medium">Input:</span> 5{"\n"}-2 1 -3 4
                  -1
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Output:</span> 4
                </p>
              </div>
              <div>
                <p className="font-semibold text-lg">Test Case 2:</p>
                <p className="text-gray-300">
                  <span className="font-medium">Input:</span> 1{"\n"}1
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Output:</span> 1
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="glass-panel-strong p-8 rounded-2xl border border-cyber-blue-400/20 text-center">
          <FileText className="w-12 h-12 text-cyber-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-200 mb-2">
            No Problem Assigned
          </h3>
          <p className="text-gray-400">
            This team doesn't have a problem assigned yet.
          </p>
        </div>
      )}
    </div>
  );
}
