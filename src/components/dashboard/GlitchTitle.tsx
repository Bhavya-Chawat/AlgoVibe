"use client";

import { useState, useEffect } from "react";

export default function GlitchTitle({ text }: { text: string }) {
  const [glitchText, setGlitchText] = useState(text);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*(){}[]<>?/~`";
      const glitched = text
        .split("")
        .map((char) => {
          if (Math.random() > 0.9 && char !== " ") {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        })
        .join("");

      setGlitchText(glitched);
      setTimeout(() => setGlitchText(text), 30);
    }, 1500);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return (
    <h1 className="text-5xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue-400 to-teal-400 glitch-text">
      {glitchText}
    </h1>
  );
}
