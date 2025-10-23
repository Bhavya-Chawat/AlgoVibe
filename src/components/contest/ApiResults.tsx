import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

interface ApiResult {
  status: 'correct' | 'error' | 'warning';
  message: string;      
}

interface ApiResultsProps {
  result: ApiResult;
}

export default function ApiResults({ result }: ApiResultsProps) {
  const getStatusConfig = () => {
    switch (result.status) {
      case "correct":
        return {
          icon: <CheckCircle className="w-6 h-6 text-matrix-green" />,
          borderColor: "border-matrix-green/30",
          textColor: "text-matrix-green"
        };
      case "error":
        return {
          icon: <XCircle className="w-6 h-6 text-alert-red" />,
          borderColor: "border-alert-red/30",
          textColor: "text-alert-red"
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-warning-orange" />,
          borderColor: "border-warning-orange/30",
          textColor: "text-warning-orange"
        };
    }
  };

  const { icon, borderColor, textColor } = getStatusConfig();

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
          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`
              p-3 rounded-lg 
              border ${borderColor}
            `}>
              {icon}
            </div>
            <div>
              <h4 className={`text-xl font-bold ${textColor}`}>
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </h4>
            </div>
          </div>

          {/* Message */}
          {result.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-black/20 border border-white/5"
            >
              <p className="text-gray-300 leading-relaxed">
                {result.message}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}