import React from 'react';
import Beams from '@/components/background/Beams';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-black">
      <Beams />
      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}