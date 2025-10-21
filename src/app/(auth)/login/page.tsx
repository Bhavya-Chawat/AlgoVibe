'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlitchText } from '@/components/effects/react-effects-lib/src/components/effects/GlitchText';
import { MagneticButton } from '@/components/effects/react-effects-lib/src/components/effects/MagneticButton';
import { Users, Lock, Zap } from 'lucide-react';
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
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
                className="input-cyber pl-11 w-full"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="input-cyber pl-11 w-full"
                required
              />
            </div>
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
            <MagneticButton
              type="submit"
              disabled={isLoading}
              className="btn-cyber w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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