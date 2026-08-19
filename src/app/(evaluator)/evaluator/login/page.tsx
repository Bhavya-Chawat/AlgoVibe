"use client";

import { useState, FormEvent, useEffect } from "react";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { ClipboardCheck, Lock, Zap, AlertCircle, X, Eye, EyeOff } from "lucide-react";
import { loginStaff } from "@/app/actions/auth";

export default function EvaluatorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [glitchText, setGlitchText] = useState("EVALUATOR ACCESS");

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*(){}[]<>?/~`";
      const original = "EVALUATOR ACCESS";
      const glitched = original
        .split("")
        .map((char) => {
          if (Math.random() > 0.9 && char !== " ") {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        })
        .join("");

      setGlitchText(glitched);
      setTimeout(() => setGlitchText(original), 30);
    }, 1500);

    return () => clearInterval(glitchInterval);
  }, []);

  // Auto-hide error after 6 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginStaff(email, password);

    // Only handle errors - redirect happens automatically on success
    if (result && !result.success) {
      setError(result.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hack-black via-hack-navy to-hack-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,75,47,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,75,47,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,75,47,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Header with glitch text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-4 bg-warning-orange/10 rounded-2xl border-2 border-warning-orange/30">
              <ClipboardCheck className="w-12 h-12 text-warning-orange" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2 text-gradient-orange">{glitchText}</h1>
          <p className="text-xl text-gray-300 mt-4">AlgoVibe 2026 - Judge Portal</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-500/50 rounded-lg backdrop-blur-sm relative overflow-hidden animate-shake">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-scan"></div>

            <div className="flex items-start gap-3 relative z-10">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="glass-panel-strong scan-line rounded-2xl p-8 relative transition-all duration-300 group border-2 border-warning-orange/20">
          {/* Directional glow effects - Orange theme */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at bottom right, rgba(168, 75, 47, 0.4) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          ></div>

          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 delay-100 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top left, rgba(230, 129, 97, 0.2) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          ></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Evaluator Email
              </label>
              <div className="relative">
                <ClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Evaluator Email"
                  className="input-cyber pl-11 w-full"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="input-cyber pl-11 pr-11 w-full"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-warning-orange rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <MagneticButton
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-warning-orange to-orange-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(168,75,47,0.5)] hover:shadow-[0_0_50px_rgba(168,75,47,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Access Evaluation Panel
                  </>
                )}
              </MagneticButton>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-xs text-gray-500">
              🔒 Authorized Evaluators Only
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
