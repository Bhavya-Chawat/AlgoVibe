'use client';

import React from 'react';
import Beams from '@/components/background/Beams';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <Beams />
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Beams Test</h1>
        <p className="text-white">If you can see the beams animation behind this box, it's working!</p>
      </div>
    </div>
  );
}