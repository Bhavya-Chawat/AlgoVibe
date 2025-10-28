import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface ApiResult {
  verdict: "correct" | "incorrect";
  feedback: string;
}

interface ApiResultsProps {
  result: ApiResult;
}

export default function ApiResults({ result }: ApiResultsProps) {
  const isCorrect = result.verdict === "correct";

  const icon = isCorrect ? (
    <CheckCircle className="w-6 h-6 text-matrix-green" />
  ) : (
    <XCircle className="w-6 h-6 text-alert-red" />
  );

  const borderColor = isCorrect
    ? "border-matrix-green/30"
    : "border-alert-red/30";
  const textColor = isCorrect ? "text-matrix-green" : "text-alert-red";
  const title = isCorrect ? "Correct" : "Incorrect";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`
          mt-6 p-6 rounded-xl
          glass-panel
          border ${borderColor}
          relative overflow-hidden
        `}
      >
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg border ${borderColor}`}>{icon}</div>
            <div>
              <h4 className={`text-xl font-bold ${textColor}`}>{title}</h4>
            </div>
          </div>

          {/* Feedback Message */}
          {result.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-black/20 border border-white/5"
            >
              <p className="text-gray-300 leading-relaxed">{result.feedback}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
