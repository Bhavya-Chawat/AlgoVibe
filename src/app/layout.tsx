import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Fira_Code } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'AlgoVibe 2026 | Hackathon Competition · Vibe the Code',
  description: 'Join the ultimate Hackathon Competition for ISE Students at RVCE. Turn innovative ideas into cutting-edge web applications and compete for top honors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("scroll-smooth", inter.variable, jakarta.variable, firaCode.variable)}>
      <body className={`${inter.className} bg-hack-black text-white antialiased overflow-x-hidden font-sans selection:bg-cyber-blue-400/30 selection:text-electric-cyan`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}