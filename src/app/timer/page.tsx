"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/modern-ui/src/components/ui/Card";
import { Button } from "@/components/ui/modern-ui/src/components/ui/Button";

export default function TimerPage() {
  const [time, setTime] = useState(30 * 60); // Time in seconds (30 minutes default)
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
    setTime(30 * 60); // Reset to 30 minutes
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  return (
    <div className="min-h-screen bg-hack-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient text-7xl">{glitchText}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Time Left
          </p>
        </div>
        
        <Card glow className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl md:text-4xl">TIME LEFT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-8">
              <div className={`text-6xl md:text-7xl font-mono font-bold ${time === 0 ? 'text-red-500' : 'text-gradient'}`}>
                {formatTime(time)}
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                onClick={toggleTimer}
                className="px-6 py-3 text-lg"
                disabled={time === 0}
              >
                {isRunning ? "Pause" : time === 0 ? "Finished" : "Start"}
              </Button>
              <Button 
                onClick={resetTimer}
                variant="secondary"
                className="px-6 py-3 text-lg"
              >
                Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={() => addMinutes(1)}>+1 min</Button>
              <Button onClick={() => addMinutes(5)}>+5 min</Button>
              <Button 
                onClick={() => removeMinutes(1)}
                variant="secondary"
                disabled={time < 60}
              >
                -1 min
              </Button>
              <Button 
                onClick={() => removeMinutes(5)}
                variant="secondary"
                disabled={time < 300}
              >
                -5 min
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