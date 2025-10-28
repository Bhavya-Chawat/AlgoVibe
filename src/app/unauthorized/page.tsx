"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hack-black via-hack-navy to-hack-black">
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="p-6 bg-alert-red/10 rounded-full border-2 border-alert-red/30">
            <ShieldAlert className="w-20 h-20 text-alert-red" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-alert-red mb-4">403</h1>
        <h2 className="text-3xl font-bold text-gray-200 mb-4">Access Denied</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is an error.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-cyber-blue-500 text-white font-semibold rounded-lg hover:bg-cyber-blue-600 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
