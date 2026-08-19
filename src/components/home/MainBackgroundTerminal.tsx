"use client";

import FaultyTerminal from "@/components/FaultyTerminal";

export default function MainBackgroundTerminal() {
  return (
    <div className="fixed inset-0 z-0 opacity-25 pointer-events-none overflow-hidden select-none">
      <FaultyTerminal
        scale={1.5}
        gridMul={[3, 1.5]}
        digitSize={1.4}
        timeScale={0.2}
        scanlineIntensity={0.22}
        glitchAmount={0.75}
        flickerAmount={0.7}
        noiseAmp={0.8}
        curvature={0.12}
        tint="#00f0ff"
        mouseReact={false}
        brightness={0.85}
        pageLoadAnimation={true}
      />
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>
    </div>
  );
}
