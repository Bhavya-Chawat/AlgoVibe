'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlitchText } from '@/components/effects/react-effects-lib/src/components/effects/GlitchText';
import { GlassPanel } from '@/components/ui/modern-ui/src/components/ui/GlassPanel';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For team login, we'll use teamName as email for now
      const result = await login(`${teamName}@algovibe.com`, password);

      if (result.success) {
        router.push('/dashboard/contest');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header with glitch text */}
      <div className="text-center mb-8">
        <GlitchText 
          text="ALGOVIBE 2025" 
          className="text-7xl font-bold text-gradient"
        />
        <p className="text-xl text-gray-300 mt-4">Team Login Portal</p>
      </div>

      {/* Glass Panel Login Box with cyber glow and scan line */}
      <div className="glass-panel-strong cyber-glow-strong scan-line rounded-2xl p-8 relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyber-blue-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent transition"
              placeholder="Enter your team name"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyber-blue-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-cyber-blue-600 focus:ring-cyber-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyber-blue-600 to-blue-700 hover:from-cyber-blue-700 hover:to-blue-800 focus:ring-cyber-blue-500 focus:ring-offset-gray-900 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'LOGIN'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Not registered?{' '}
            <Link href="/register" className="font-medium text-cyber-blue-400 hover:text-cyber-blue-300 transition">
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}