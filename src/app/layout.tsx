import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AlgoVibe 2025 | Hack The Matrix',
  description: 'Join the ultimate algorithmic hackathon experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-hack-black text-white antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}