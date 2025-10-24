"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/effects/react-effects-lib/src/components/effects/MagneticButton";
import { Users, Lock, Zap, AlertCircle, X, Eye, EyeOff } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [glitchText, setGlitchText] = useState("ALGOVIBE 2025");

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*(){}[]<>?/~`";
      const original = "ALGOVIBE 2025";
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

    const result = await login(teamName, password);

    // Only handle errors - redirect happens automatically on success
    if (result && !result.success) {
      setError(result.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header with glitch text */}
      <div className="text-center mb-8">
        <h1 className="text-7xl font-bold mb-2 text-gradient">{glitchText}</h1>
        <p className="text-xl text-gray-300 mt-4">Team Login Portal</p>
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
      <div className="glass-panel-strong scan-line rounded-2xl p-8 relative transition-all duration-300 group">
        {/* Directional glow effects */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, rgba(28, 171, 242, 0.4) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        ></div>

        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 delay-100 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(0, 217, 255, 0.2) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        ></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Team Name Input */}
          <div>
            <label htmlFor="team-name" className="sr-only">
              Team Name
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
              <input
                id="team-name"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
                className="input-cyber pl-11 w-full"
                required
                disabled={isLoading}
                autoComplete="username"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-cyber-blue-500 rounded"
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
              className="btn-cyber w-full flex items-center justify-center gap-2"
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
                  Logging in...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Access Contest Portal
                </>
              )}
            </MagneticButton>
          </div>
        </form>

        {/* Registration Link */}
        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-gray-400">
            Not registered?{" "}
            <Link
              href="/register"
              className="font-medium text-cyber-blue-400 hover:text-cyber-blue-300 transition-colors underline-offset-4 hover:underline"
            >
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
