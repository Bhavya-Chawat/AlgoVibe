"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/modern-ui/src/components/ui/Card";
import { Button } from "@/components/ui/modern-ui/src/components/ui/Button";

export default function TimerPage() {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

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
    setTime(0);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="min-h-screen bg-hack-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">Stopwatch Timer</span>
          </h1>
          <p className="text-gray-400 text-lg">
            A customizable stopwatch for timing events
          </p>
        </div>
        
        <Card glow className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl md:text-4xl">Stopwatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-8">
              <div className="text-6xl md:text-7xl font-mono font-bold text-gradient">
                {formatTime(time)}
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                onClick={toggleTimer}
                className="px-6 py-3 text-lg"
              >
                {isRunning ? "Pause" : "Start"}
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
          <p>Stopwatch timer with customizable duration controls</p>
        </div>
      </div>
    </div>
  );
}