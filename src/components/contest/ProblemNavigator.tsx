"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Problem {
  problem_id: number;
  title: string;
  description: string;
}

interface ProblemNavigatorProps {
  currentProblemId: number | null;
  onProblemChange: (problem: Problem) => void;
}

export default function ProblemNavigator({
  currentProblemId,
  onProblemChange,
}: ProblemNavigatorProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from("problems")
          .select("problem_id, title, description")
          .order("problem_id");

        if (error) {
          throw new Error(error.message);
        }

        setProblems(data || []);
        
        // Find current problem index
        if (currentProblemId && data) {
          const index = data.findIndex(p => p.problem_id === currentProblemId);
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch problems");
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProblems();
  }, []);

  useEffect(() => {
    // Update current index when problems change or currentProblemId changes
    if (problems.length > 0 && currentProblemId) {
      const index = problems.findIndex(p => p.problem_id === currentProblemId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [problems, currentProblemId]);

  const handlePrev = () => {
    if (problems.length === 0) return;
    
    const newIndex = currentIndex > 0 ? currentIndex - 1 : problems.length - 1;
    setCurrentIndex(newIndex);
    onProblemChange(problems[newIndex]);
  };

  const handleNext = () => {
    if (problems.length === 0) return;
    
    const newIndex = currentIndex < problems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onProblemChange(problems[newIndex]);
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
    onProblemChange(problems[index]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse text-cyber-blue-400">Loading problems...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-alert-red/20 border border-alert-red/30 rounded-lg text-alert-red text-center">
        Error: {error}
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="p-4 bg-warning-orange/20 border border-warning-orange/30 rounded-lg text-warning-orange text-center">
        No problems found in database
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyber-blue-400/30 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-cyber-blue-400" />
          <span className="text-gray-300 font-medium">
            Problem {currentIndex + 1} of {problems.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={problems.length <= 1}
            className="p-2 rounded-lg bg-cyber-blue-400/10 hover:bg-cyber-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous problem"
          >
            <ChevronLeft className="w-5 h-5 text-cyber-blue-400" />
          </button>
          
          <div className="relative group">
            <select
              value={currentIndex}
              onChange={(e) => handleSelect(parseInt(e.target.value))}
              className="px-3 py-2 bg-hack-navy border border-cyber-blue-400/30 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyber-blue-400/50 appearance-none pr-8"
            >
              {problems.map((problem, index) => (
                <option 
                  key={problem.problem_id} 
                  value={index}
                  className="bg-hack-navy text-gray-200"
                >
                  {index + 1}. {problem.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>
          
          <button
            onClick={handleNext}
            disabled={problems.length <= 1}
            className="p-2 rounded-lg bg-cyber-blue-400/10 hover:bg-cyber-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next problem"
          >
            <ChevronRight className="w-5 h-5 text-cyber-blue-400" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className="text-sm text-gray-400 truncate">
          Current: {problems[currentIndex]?.title || "No problem selected"}
        </div>
      </div>
    </div>
  );
}