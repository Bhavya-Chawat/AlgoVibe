'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MagneticButton } from '@/components/effects/react-effects-lib/src/components/effects/MagneticButton';
import { Users, Lock, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const [teamName, setTeamName] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [glitchText, setGlitchText] = useState("ALGOVIBE 2025");

    const router = useRouter();
    const { login } = useAuth();

    // Implement glitch effect similar to home page
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            const chars = "!@#$%^&*(){}[]<>?/~`";
            const original = "ALGOVIBE 2025";
            const glitched = original
                .split("")
                .map((char) => {
                    if (Math.random() > 0.90 && char !== " ") {
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
                <h1 className="text-7xl font-bold mb-2 text-gradient">
                    {glitchText}
                </h1>
                <p className="text-xl text-gray-300 mt-4">Team Login Portal</p>
            </div>

            {/* Glass Panel Login Box with directional hover glow and scan line */}
            <div className="glass-panel-strong scan-line rounded-2xl p-8 relative transition-all duration-300 group">
                {/* Directional glow effect - appears from bottom right on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at bottom right, rgba(28, 171, 242, 0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                ></div>

                {/* Alternative directional glow - from top left */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 delay-100 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at top left, rgba(0, 217, 255, 0.2) 0%, transparent 70%)',
                        filter: 'blur(15px)'
                    }}
                ></div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
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

                <div className="mt-6 text-center relative z-10">
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