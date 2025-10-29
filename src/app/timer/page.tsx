"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/modern-ui/src/components/ui/Card";
import { Button } from "@/components/ui/modern-ui/src/components/ui/Button";
import Beams from "@/components/background/Beams";

export default function TimerPage() {
  const [time, setTime] = useState(90 * 60); // Time in seconds (90 minutes default)
  const [isRunning, setIsRunning] = useState(false);
  const [glitchText, setGlitchText] = useState("ALGOVIBE");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*(){}[]<>?/~`"
      const original = "ALGOVIBE"
      const glitched = original
        .split("")
        .map((char) => {
          if (Math.random() > 0.9 && char !== " ") {
            return chars[Math.floor(Math.random() * chars.length)]
          }
          return char
        })
        .join("")

      setGlitchText(glitched)
      setTimeout(() => setGlitchText(original), 30)
    }, 1500)

    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addMinutes = (minutes: number) => {
    setTime(prevTime => prevTime + minutes * 60);
  };

  const removeMinutes = (minutes: number) => {
    setTime(prevTime => Math.max(0, prevTime - minutes * 60));
  };

  const resetTimer = () => {
    setTime(90 * 60); // Reset to 90 minutes
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  return (
    <div className="relative min-h-screen bg-hack-black flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <Beams />
      
      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.15,
          backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      {/* Animated Scan Line */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
      </div>
      
      {/* Glowing Orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="fixed bottom-1/3 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse z-0"></div>
      
      <div className="w-full max-w-4xl relative z-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient text-7xl">{glitchText}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Time Left
          </p>
        </div>
        
        <Card glow className="w-full max-w-2xl mx-auto relative overflow-hidden">
          {/* Card Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 z-0"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl z-0"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-center text-3xl md:text-4xl">TIME LEFT</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className={`text-6xl md:text-7xl font-mono font-bold ${time === 0 ? 'text-red-500' : 'text-gradient'}`}>
                {formatTime(time)}
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                onClick={toggleTimer}
                className="px-6 py-3 text-lg relative overflow-hidden"
                disabled={time === 0}
              >
                <span className="relative z-10">{isRunning ? "Pause" : time === 0 ? "Finished" : "Start"}</span>
                {isRunning && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse z-0"></div>
                )}
              </Button>
              <Button 
                onClick={resetTimer}
                variant="secondary"
                className="px-6 py-3 text-lg relative overflow-hidden"
              >
                <span className="relative z-10">Reset</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-700/20 z-0"></div>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={() => addMinutes(1)} className="relative overflow-hidden">
                <span className="relative z-10">+1 min</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 z-0"></div>
              </Button>
              <Button onClick={() => addMinutes(5)} className="relative overflow-hidden">
                <span className="relative z-10">+5 min</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 z-0"></div>
              </Button>
              <Button 
                onClick={() => removeMinutes(1)}
                variant="secondary"
                disabled={time < 60}
                className="relative overflow-hidden"
              >
                <span className="relative z-10">-1 min</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 z-0"></div>
              </Button>
              <Button 
                onClick={() => removeMinutes(5)}
                variant="secondary"
                disabled={time < 300}
                className="relative overflow-hidden"
              >
                <span className="relative z-10">-5 min</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 z-0"></div>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Countdown timer that counts down to zero</p>
        </div>
      </div>
    </div>
  );
}