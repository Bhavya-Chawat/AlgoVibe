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
      {/* Background Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
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