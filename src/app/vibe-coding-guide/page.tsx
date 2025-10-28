"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image"; // add this

// --- COMPONENTS (Inlined for self-contained functionality) ---

const Header: React.FC = () => {
  return (
    <header className="bg-hack-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="text-white hover:text-cyber-blue-400 transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg glass-panel border border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Algovibe logo"
                width={48}
                height={48}
                priority
                className="rounded-sm"
              />
              <div className="absolute inset-0 bg-cyber-blue-400/20 blur-xl"></div>
            </div>
            <span className="text-3xl font-bold">
              <span className="text-gradient">ALGO</span>
              <span className="text-white">VIBE</span>
              <span className="text-cyber-blue-400 ml-2 text-xl">2025</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return <footer className="h-20 mt-12 border-t border-white/10" />;
};

const Beams: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 bg-hack-black" />
  );
};

const CodeBlock: React.FC<{ children: React.ReactNode; label?: string }> = ({
  children,
  label,
}) => {
  // Set the initial button text to the label passed in props
  const [buttonText, setButtonText] = useState(label);

  // This effect ensures that if the label prop changes, the button text resets.
  useEffect(() => {
    setButtonText(label);
  }, [label]);

  const handleCopy = () => {
    // We only expect string children for code blocks
    if (typeof children === "string") {
      navigator.clipboard
        .writeText(children)
        .then(() => {
          // On successful copy, give user feedback
          setButtonText("Copied!");
          // Revert the button text back to the original label after 2 seconds
          setTimeout(() => setButtonText(label), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          // Optionally handle copy failure
          setButtonText("Error");
          setTimeout(() => setButtonText(label), 2000);
        });
    }
  };

  return (
    <div className="relative bg-hack-navy border border-white/10 rounded-lg p-5 my-2 overflow-x-auto">
      {/* Only render the button if a label was provided */}
      {label && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-3 bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded transition-all duration-200 hover:bg-green-600/80"
          // Disable the button temporarily after a click to prevent spamming
          disabled={buttonText !== label}
        >
          {buttonText}
        </button>
      )}
      <pre className="text-sm text-cyan-300 whitespace-pre-wrap pt-4">
        <code>{children}</code>
      </pre>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const navItems = [
  { name: "AI Tool Comparison", id: "ai-tools" },
  { name: "Effective Prompting Techniques", id: "prompting" },
  { name: "Visualization Libraries Guide", id: "visualization" },
  { name: "Git Commands You'll Actually Use", id: "git" },
  { name: "Deployment Troubleshooting", id: "deployment" },
  { name: "Advanced Tips", id: "advanced-tips" },
  { name: "Essential Resources", id: "resources" },
  { name: "Pre-Submission Checklist", id: "checklist" },
];

const VibeCodingGuide: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-hack-black text-white">
      <Beams />
      <div className="relative z-10">
        <div className="mt-4">
          <Header />
        </div>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="glass-panel-strong p-8 mb-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                DSA Vibe Coding - Technical Reference
              </h1>
              <p className="text-xl text-gray-300">
                Actually useful stuff you'll need during the hackathon
              </p>
              <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent"></div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center py-6">
              <h3 className="w-full text-center text-lg font-semibold text-gray-300 mb-4">
                Quick Navigation
              </h3>
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-4 py-2 glass-panel border border-white/10 rounded-lg cursor-pointer hover:bg-cyber-blue-400/10 transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            <section id="ai-tools" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                AI Tool Comparison - Choose Wisely
              </h2>
              <div className="glass-panel p-6 mb-8 border border-alert-red/30 bg-alert-red/5">
                <h4 className="text-xl font-bold text-alert-red mb-3">
                  Reality Check
                </h4>
                <p className="text-gray-300">
                  No AI tool will give you perfect code on the first try. You'll
                  iterate 5-10 times minimum. Budget your time accordingly!
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-cyber-blue-400 font-bold">
                        Tool
                      </th>
                      <th className="text-left p-4 text-cyber-blue-400 font-bold">
                        Speed
                      </th>
                      <th className="text-left p-4 text-cyber-blue-400 font-bold">
                        Code Quality
                      </th>
                      <th className="text-left p-4 text-cyber-blue-400 font-bold">
                        Learning Curve
                      </th>
                      <th className="text-left p-4 text-cyber-blue-400 font-bold">
                        Best Use Case
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-4 font-semibold">Bolt.new</td>
                      <td className="p-4">Instant</td>
                      <td className="p-4">Good (80%)</td>
                      <td className="p-4">Easy</td>
                      <td className="p-4">Quick prototypes, full demos</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-4 font-semibold">Cursor AI</td>
                      <td className="p-4">Fast</td>
                      <td className="p-4">Excellent (90%)</td>
                      <td className="p-4">Medium</td>
                      <td className="p-4">Refining code, debugging</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-4 font-semibold">v0 by Vercel</td>
                      <td className="p-4">Instant</td>
                      <td className="p-4">Good (85%)</td>
                      <td className="p-4">Easy</td>
                      <td className="p-4">Beautiful UIs, components</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-all">
                      <td className="p-4 font-semibold">ChatGPT/Claude</td>
                      <td className="p-4">Fast</td>
                      <td className="p-4">Variable (60-80%)</td>
                      <td className="p-4">Easy</td>
                      <td className="p-4">Understanding concepts, snippets</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-200">
                  Recommended Workflow
                </h3>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    For Beginners (Never coded before)
                  </h4>
                  <p className="mb-2">
                    <strong>Start:</strong> Bolt.new → Get working demo in 5
                    minutes
                  </p>
                  <p className="mb-2">
                    <strong>Then:</strong> Use ChatGPT/Claude to understand what
                    the code does
                  </p>
                  <p>
                    <strong>Finally:</strong> Make small tweaks by asking Bolt
                    to modify specific parts
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    For Intermediate (Know HTML/CSS/JS basics)
                  </h4>
                  <p className="mb-2">
                    <strong>Start:</strong> v0 by Vercel → Get nice UI structure
                  </p>
                  <p className="mb-2">
                    <strong>Then:</strong> Export code and open in Cursor AI
                  </p>
                  <p>
                    <strong>Finally:</strong> Use Cursor's autocomplete to add
                    algorithm logic
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    For Advanced (Comfortable with coding)
                  </h4>
                  <p className="mb-2">
                    <strong>Start:</strong> Cursor AI → Write code with AI
                    assistance
                  </p>
                  <p className="mb-2">
                    <strong>Use:</strong> Cursor's Cmd+K (Mac) or Ctrl+K
                    (Windows) to ask for specific changes
                  </p>
                  <p>
                    <strong>Debug:</strong> Cursor's inline error fixing is
                    unmatched
                  </p>
                </div>
              </div>
            </section>

            <section id="prompting" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                How to Write Prompts That Actually Work
              </h2>
              <div className="glass-panel p-6 mb-8 border border-yellow-400/30 bg-yellow-400/5">
                <h4 className="text-xl font-bold text-yellow-400 mb-3">
                  The Golden Rule
                </h4>
                <p className="text-gray-300">
                  Be specific about WHAT you want to see, not HOW to code it.
                  Describe the user experience, not the implementation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 border border-alert-red/30 bg-alert-red/5">
                  <h4 className="text-xl font-bold text-alert-red mb-3">
                    Bad Prompts
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>"Make a sorting visualizer"</li>
                    <li>"Create a graph algorithm"</li>
                    <li>"Build something cool"</li>
                    <li>"Use D3.js for this"</li>
                  </ul>
                </div>
                <div className="glass-panel p-6 border border-green-500/30 bg-green-500/5">
                  <h4 className="text-xl font-bold text-green-500 mb-3">
                    Good Prompts
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>
                      "Show bubble sort with bars that swap positions. Highlight
                      compared bars in yellow, swapped bars flash green"
                    </li>
                    <li>
                      "Display BFS on a graph where visited nodes turn blue and
                      current node pulses with a glow effect"
                    </li>
                    <li>
                      "Animated maze solver where the path-finding trail is a
                      moving particle"
                    </li>
                    <li>"Let me describe what I want visually..."</li>
                  </ul>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                Prompt Templates That Work
              </h3>
              <div className="space-y-4">
                <div className="glass-panel p-6">
                  <h4 className="text-lg font-bold text-cyber-blue-400 mb-2">
                    Template 1: Visualization Base
                  </h4>
                  <CodeBlock>{`Create an interactive visualization of [ALGORITHM_NAME].

Visual Requirements:
- Show [DATA_STRUCTURE] as [VISUAL_METAPHOR]
- Highlight current step with [COLOR/ANIMATION]
- Use [SPEED] animation speed

Controls Needed:
- Play/Pause button
- Speed slider (0.5x to 2x)
- Reset button
- Input field for custom data

Make it look modern with smooth animations.`}</CodeBlock>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-lg font-bold text-cyber-blue-400 mb-2">
                    Template 2: Fixing Issues
                  </h4>
                  <CodeBlock>{`The [SPECIFIC_FEATURE] isn't working correctly.

Current behavior: [WHAT HAPPENS NOW]
Expected behavior: [WHAT SHOULD HAPPEN]

Error message (if any): [PASTE ERROR]

Fix this specific issue without changing other parts.`}</CodeBlock>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-lg font-bold text-cyber-blue-400 mb-2">
                    Template 3: Adding Features
                  </h4>
                  <CodeBlock>{`Add a new feature to the existing code:

Feature: [DESCRIBE FEATURE]
Location: [WHERE IT SHOULD APPEAR]
Behavior: [WHAT IT SHOULD DO]

Keep the existing functionality unchanged.`}</CodeBlock>
                </div>
              </div>
            </section>

            <section id="visualization" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                Visualization Libraries - What to Actually Use
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-2">
                    p5.js
                  </h4>
                  <div className="text-yellow-400 mb-2">Beginner: 5/5</div>
                  <p className="text-sm">
                    Easiest to learn, perfect for animations, great for
                    sorting/array visualizations
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-2">
                    D3.js
                  </h4>
                  <div className="text-yellow-400 mb-2">
                    Beginner: 2/5 | Power: 5/5
                  </div>
                  <p className="text-sm">
                    Industry standard, works for ANY visualization, highly
                    customizable
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-2">
                    Canvas API (Pure JS)
                  </h4>
                  <div className="text-yellow-400 mb-2">
                    Beginner: 3/5 | Control: 5/5
                  </div>
                  <p className="text-sm">
                    Maximum control, fast performance, no dependencies
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-2">
                    Three.js
                  </h4>
                  <div className="text-yellow-400 mb-2">
                    Beginner: 1/5 | Wow Factor: 5/5
                  </div>
                  <p className="text-sm">3D visualizations, impressive demos</p>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                Ready-to-Use Code Snippets
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    p5.js - Array Visualization Starter
                  </h4>
                  <CodeBlock label="COPY-PASTE READY">{`let arr = [64, 34, 25, 12, 22, 11, 90];
let currentIdx = -1;

function setup() {
  createCanvas(800, 400);
  frameRate(2); // Control animation speed
}

function draw() {
  background(240);
  let barWidth = width / arr.length;
  for (let i = 0; i < arr.length; i++) {
    if (i === currentIdx) {
      fill(255, 0, 0); // Red for current
    } else {
      fill(100, 100, 255); // Blue for others
    }
    let barHeight = map(arr[i], 0, 100, 0, height-50);
    rect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    fill(0);
    textAlign(CENTER);
    text(arr[i], i * barWidth + barWidth/2, height - barHeight - 10);
  }
  currentIdx = (currentIdx + 1) % arr.length;
}`}</CodeBlock>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    D3.js - Graph Visualization Starter
                  </h4>
                  <CodeBlock label="COPY-PASTE READY">{`const nodes = [{id: 1, label: "A"},{id: 2, label: "B"},{id: 3, label: "C"}];
const links = [{source: 1, target: 2},{source: 2, target: 3}];
const svg = d3.select("body").append("svg").attr("width", 800).attr("height", 600);
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(400, 300));
const link = svg.selectAll(".link").data(links).enter().append("line").attr("stroke", "#999");
const node = svg.selectAll(".node").data(nodes).enter().append("circle").attr("r", 20).attr("fill", "#667eea");
simulation.on("tick", () => {
  link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
  node.attr("cx", d => d.x).attr("cy", d => d.y);
});`}</CodeBlock>
                </div>
              </div>
            </section>

            <section id="git" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                Git Commands You'll Actually Use
              </h2>
              <div className="glass-panel p-6 mb-8 border border-alert-red/30 bg-alert-red/5">
                <h4 className="text-xl font-bold text-alert-red mb-3">
                  SAVE THIS - You'll need it when things break
                </h4>
                <p className="text-gray-300">
                  Git errors happen to everyone. These commands will save you.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Starting a Project
                  </h3>
                  <CodeBlock>{`# If you're creating a NEW project
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# If you're joining an EXISTING project
git clone https://github.com/username/repo.git`}</CodeBlock>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Daily Workflow (Use These 100 Times)
                  </h3>
                  <CodeBlock>{`# Check what changed
git status

# Save your work (do this every 30 mins!)
git add .
git commit -m "describe what you did"
git push

# Get latest changes before you start working
git pull`}</CodeBlock>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    When Things Go Wrong
                  </h3>
                  <div className="space-y-4">
                    <div className="glass-panel p-4">
                      <p className="font-semibold text-gray-300">
                        Problem: "I messed up, undo my last commit"
                      </p>
                      <CodeBlock>{`# Keep your changes, just undo commit
git reset --soft HEAD~1

# Completely undo everything (dangerous!)
git reset --hard HEAD~1`}</CodeBlock>
                    </div>
                    <div className="glass-panel p-4">
                      <p className="font-semibold text-gray-300">
                        Problem: "Merge conflict - what do I do??"
                      </p>
                      <CodeBlock>{`# Step 1: See which files have conflicts
git status
# Step 2: Open conflicted files, edit them to keep the code you want.
# Step 3: Mark as resolved
git add <filename>
git commit -m "resolved merge conflict"
git push`}</CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="deployment" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                Deployment - Get Your Project Online
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                    GitHub Pages (Easiest - 2 Minutes)
                  </h3>
                  <CodeBlock>{`1. Push your code to GitHub
2. Go to your repo → Settings → Pages
3. Under "Source", select "main" branch
4. Select "/ (root)" folder
5. Click Save
6. Wait 2-3 minutes
7. Your site is live at: https://username.github.io/repo-name/`}</CodeBlock>
                  <div className="glass-panel p-6 mt-4 border border-yellow-400/30 bg-yellow-400/5">
                    <h4 className="text-xl font-bold text-yellow-400 mb-3">
                      Common GitHub Pages Issues
                    </h4>
                    <p className="mb-2">
                      <strong>Problem:</strong> Page shows 404 →{" "}
                      <strong>Fix:</strong> Make sure your main HTML file is
                      named{" "}
                      <code className="text-sm text-cyber-blue-400 font-mono">
                        index.html
                      </code>
                    </p>
                    <p>
                      <strong>Problem:</strong> CSS/JS not loading →{" "}
                      <strong>Fix:</strong> Use relative paths like{" "}
                      <code className="text-sm text-cyber-blue-400 font-mono">
                        ./style.css
                      </code>{" "}
                      not{" "}
                      <code className="text-sm text-cyber-blue-400 font-mono">
                        /style.css
                      </code>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                    Netlify (Better Performance - 3 Minutes)
                  </h3>
                  <CodeBlock>{`1. Go to app.netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose "Deploy with GitHub" and select your repository
5. Leave build settings empty (unless using React/Vue)
6. Click "Deploy site"`}</CodeBlock>
                </div>
              </div>
            </section>

            <section id="advanced-tips" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                Advanced Tips (If You Have Time)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    Add Sound Effects
                  </h4>
                  <CodeBlock>{`// Simple beep on compare
const audioContext = new AudioContext();

function beep(frequency) {
  const oscillator = audioContext
    .createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Use in algorithm
function compare(a, b) {
  beep(200 + a * 10); // Pitch varies
  return a > b;
}`}</CodeBlock>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    Make It Mobile-Friendly
                  </h4>
                  <CodeBlock>{`/* Add to your CSS */
@media (max-width: 768px) {
  .visualization-container {
    height: 300px;
    padding: 10px;
  }
  
  .controls {
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    width: 100%;
    padding: 15px;
    font-size: 16px;
  }
}`}</CodeBlock>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    Dark Mode Toggle
                  </h4>
                  <CodeBlock>{`// HTML
<button id="themeToggle">Toggle Theme</button>

// CSS
:root {
  --bg: white;
  --text: black;
}

[data-theme="dark"] {
  --bg: #1a202c;
  --text: white;
}

body {
  background: var(--bg);
  color: var(--text);
}`}</CodeBlock>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-xl font-bold text-cyber-blue-400 mb-3">
                    Save/Load Custom Input
                  </h4>
                  <CodeBlock>{`// Save to localStorage
function saveData(key, data) {
  localStorage.setItem(key, 
    JSON.stringify(data));
}

// Load from localStorage
function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Example usage
document.getElementById('save')
  .addEventListener('click', () => {
  saveData('myArray', currentArray);
  alert('Saved!');
});`}</CodeBlock>
                </div>
              </div>
            </section>

            <section id="resources" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                Essential Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-cyber-blue-400 mb-4">
                    Learning Resources
                  </h3>
                  <div className="space-y-4">
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        Learn Git Branching
                      </h4>
                      <a
                        href="https://learngitbranching.js.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        learngitbranching.js.org
                      </a>
                      <p className="text-sm text-gray-300">
                        Interactive Git tutorial - actually fun!
                      </p>
                    </div>
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        VisuAlgo
                      </h4>
                      <a
                        href="https://visualgo.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        visualgo.net
                      </a>
                      <p className="text-sm text-gray-300">
                        See how algorithms should look
                      </p>
                    </div>
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        p5.js Examples
                      </h4>
                      <a
                        href="https://p5js.org/examples"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        p5js.org/examples
                      </a>
                      <p className="text-sm text-gray-300">
                        Copy-paste ready code samples
                      </p>
                    </div>
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        D3.js Gallery
                      </h4>
                      <a
                        href="https://observablehq.com/@d3/gallery"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        observablehq.com/@d3/gallery
                      </a>
                      <p className="text-sm text-gray-300">
                        See what's possible with D3
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyber-blue-400 mb-4">
                    Quick Reference
                  </h3>
                  <div className="space-y-4">
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        Color Palettes
                      </h4>
                      <a
                        href="https://coolors.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        coolors.co
                      </a>
                      <p className="text-sm text-gray-300">
                        Generate beautiful color schemes
                      </p>
                    </div>
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        CDN Links
                      </h4>
                      <a
                        href="https://cdnjs.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        cdnjs.com
                      </a>
                      <p className="text-sm text-gray-300">
                        Get library CDN links instantly
                      </p>
                    </div>
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        Google Fonts
                      </h4>
                      <a
                        href="https://fonts.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        fonts.google.com
                      </a>
                      <p className="text-sm text-gray-300">
                        Free fonts for better typography
                      </p>
                    </div>
                    <div className="glass-panel p-4">
                      <h4 className="text-lg font-bold text-gray-200 mb-1">
                        Freesound
                      </h4>
                      <a
                        href="https://freesound.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-cyber-blue-400 mb-1 font-mono hover:underline break-all"
                      >
                        freesound.org
                      </a>
                      <p className="text-sm text-gray-300">
                        Free sound effects
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="checklist" className="glass-panel-strong p-8">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-cyber-blue-400/30 inline-block">
                Pre-Submission Checklist
              </h2>
              <div className="glass-panel p-6 border border-alert-red/30 bg-alert-red/5 mb-6">
                <h4 className="text-xl font-bold text-alert-red mb-3">
                  Before You Submit - Check Everything!
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="text-lg font-bold text-alert-red mb-3">
                      Functionality
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Algorithm visualizes correctly</li>
                      <li>Play/Pause works</li>
                      <li>Speed control works</li>
                      <li>Reset button works</li>
                      <li>Works with custom input</li>
                      <li>No console errors (press F12)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-alert-red mb-3">
                      Polish
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Looks good visually</li>
                      <li>Smooth animations</li>
                      <li>Mobile responsive</li>
                      <li>Clear labels/instructions</li>
                      <li>README file explaining it</li>
                      <li>Site is actually deployed and live</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 border border-green-500/30 bg-green-500/5">
                <h4 className="text-xl font-bold text-green-500 mb-3">
                  Bonus Points Ideas
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Compare multiple algorithms side-by-side</li>
                  <li>Show complexity analysis (Big O)</li>
                  <li>Add sound effects that respond to values</li>
                  <li>Create a beautiful landing page with algorithm info</li>
                  <li>Add fun easter eggs or themes</li>
                  <li>Make it tell the story from the problem lore</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="glass-panel-strong p-8 mt-16 text-center">
            <p className="text-2xl font-bold mb-3">Good Luck!</p>
            <p className="text-gray-300 mb-3">
              Remember: It's about creativity + functionality, not perfect code
            </p>
            <p className="text-gray-500 text-sm">
              Pro tip: Ctrl+F to search this document for what you need
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default VibeCodingGuide;
