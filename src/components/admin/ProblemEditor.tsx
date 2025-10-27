"use client";

import { useState, useEffect } from "react";
import { Save, Eye, Users, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Team {
  team_id: number;
  team_name: string;
  members: any[];
}

interface Problem {
  problem_id: number;
  title: string;
  description: string;
}

interface ProblemEditorProps {
  teams?: Team[];
  problems?: Problem[];
  isLoading?: boolean;
  onCreateProblem?: (title: string, description: string) => Promise<any>;
  onUpdateProblem?: (problemId: number, title: string, description: string) => Promise<any>;
  onAssignProblem?: (teamId: number, problemId: number) => Promise<any>;
  showSidebarPanels?: boolean;
}

export default function ProblemEditor({ 
  teams = [], 
  problems = [], 
  isLoading = false,
  onCreateProblem,
  onUpdateProblem,
  onAssignProblem,
  showSidebarPanels = true 
}: ProblemEditorProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedProblem, setSelectedProblem] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [assignedProblem, setAssignedProblem] = useState<Problem | null>(null);

  // Update form when a problem is selected
  const handleProblemSelect = (problemId: string) => {
    setSelectedProblem(problemId);
    const problem = problems.find(p => p.problem_id === parseInt(problemId));
    if (problem) {
      setTitle(problem.title);
      setDescription(problem.description);
    }
  };

  // Fetch assigned problem when team is selected
  useEffect(() => {
    if (selectedTeam && teams.length > 0) {
      // In a real implementation, we would fetch the assigned problem from the database
      // For now, we'll just reset the assigned problem
      setAssignedProblem(null);
    }
  }, [selectedTeam, teams]);

  const handleSave = async () => {
    if (!selectedTeam) return;
    
    setIsSaving(true);
    
    try {
      let problemId = parseInt(selectedProblem);
      
      if (problemId) {
        // Update existing problem
        if (onUpdateProblem) {
          const result = await onUpdateProblem(problemId, title, description);
          if (!result.success) {
            console.error("Failed to update problem:", result.error);
          }
        }
      } else {
        // Create new problem
        if (onCreateProblem) {
          const result = await onCreateProblem(title, description);
          if (result.success) {
            problemId = result.data.problem_id;
            // Add the new problem to the problems list
            // In a real app, you'd refetch the problems list
          } else {
            console.error("Failed to create problem:", result.error);
          }
        }
      }
      
      // Assign problem to team if both are selected
      if (selectedTeam && problemId && onAssignProblem) {
        const result = await onAssignProblem(parseInt(selectedTeam), problemId);
        if (!result.success) {
          console.error("Failed to assign problem to team:", result.error);
        }
      }
      
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save problem:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!selectedTeam) return;
    
    // Create a preview window with the problem statement
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Problem Preview - ${title || "Untitled Problem"}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .problem-header {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            .problem-title {
              font-size: 24px;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
            }
            .problem-content {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              white-space: pre-wrap;
              font-family: 'Courier New', monospace;
            }
            .team-info {
              background: #e3f2fd;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #2196f3;
            }
          </style>
        </head>
        <body>
          <div class="team-info">
            <h2>Problem Preview for Team</h2>
            <p><strong>Team:</strong> ${teams.find(t => t.team_id === parseInt(selectedTeam))?.team_name || "Unknown Team"}</p>
          </div>
          
          <div class="problem-header">
            <div class="problem-title">${title || "Untitled Problem"}</div>
          </div>
          
          <div class="problem-content">
            ${description || "No problem description provided."}
          </div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const selectedTeamData = teams.find(t => t.team_id === parseInt(selectedTeam));
  const selectedProblemData = problems.find(p => p.problem_id === parseInt(selectedProblem));

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gradient">Problem Statement Editor</h2>
          <p className="text-sm text-gray-400 mt-1">
            Select a team and customize their problem statement
          </p>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreview}
            disabled={!selectedTeam}
            className="px-6 py-3 glass-panel border border-cyber-blue-400/30 rounded-xl text-cyber-blue-400 font-semibold hover:border-cyber-blue-400 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-5 h-5" />
            Preview
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={!selectedTeam || !title || !description || isSaving}
            className="px-6 py-3 bg-gradient-to-r from-cyber-blue-400 to-neon-blue rounded-xl text-hack-black font-bold hover:shadow-[0_0_30px_rgba(28,171,242,0.4)] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Save className="w-5 h-5" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Problem
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-panel-strong p-4 rounded-xl border border-matrix-green/40 bg-matrix-green/10"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-matrix-green" />
            <div>
              <p className="font-semibold text-matrix-green">Problem Statement Saved!</p>
              <p className="text-sm text-gray-400">
                The problem has been updated for {selectedTeamData?.team_name}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className={`grid gap-6 ${showSidebarPanels ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Main Editor */}
        <div className={`${showSidebarPanels ? 'lg:col-span-2' : ''} space-y-6`}>
          {/* Team Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
          >
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyber-blue-400" />
              Select Team
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Choose a team to assign problem statement
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-4 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 appearance-none cursor-pointer bg-transparent"
                disabled={isLoading}
              >
                <option value="" className="bg-hack-navy text-gray-400">
                  -- Select a Team --
                </option>
                {teams.map((team) => (
                  <option key={team.team_id} value={team.team_id} className="bg-hack-navy text-gray-200">
                    {team.team_name} ({team.members.length} members)
                  </option>
                ))}
              </select>

              {selectedTeamData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 glass-panel rounded-lg border border-neon-blue/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-200">{selectedTeamData.team_name}</p>
                      <p className="text-sm text-gray-400">
                        Team Leader: {selectedTeamData.members.find((m: any) => m.role === 'Leader')?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                      <span className="text-xs font-semibold text-neon-blue">
                        {selectedTeamData.members.length} Members
                      </span>
                    </div>
                  </div>
                  
                  {/* Display assigned problem if exists */}
                  {assignedProblem && (
                    <div className="mt-3 p-3 bg-matrix-green/10 border border-matrix-green/30 rounded-lg">
                      <p className="text-sm text-matrix-green font-semibold">
                        Currently Assigned: {assignedProblem.title}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Problem Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
          >
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyber-blue-400" />
              Select or Create Problem
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Choose an existing problem or create a new one
              </label>
              <select
                value={selectedProblem}
                onChange={(e) => handleProblemSelect(e.target.value)}
                className="w-full px-4 py-4 glass-panel border border-cyber-blue-400/30 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 appearance-none cursor-pointer bg-transparent"
                disabled={isLoading}
              >
                <option value="" className="bg-hack-navy text-gray-400">
                  -- Create New Problem --
                </option>
                {problems.map((problem) => (
                  <option key={problem.problem_id} value={problem.problem_id} className="bg-hack-navy text-gray-200">
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Problem Statement Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
          >
            <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyber-blue-400" />
              Problem Statement
            </h3>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Problem Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!selectedTeam || isLoading}
                  className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/20 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter problem title (e.g., Find Maximum Sum Subarray)"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Problem Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!selectedTeam || isLoading}
                  rows={16}
                  className="w-full px-4 py-3 glass-panel border border-cyber-blue-400/20 rounded-xl text-gray-200 focus:border-cyber-blue-400 focus:outline-none transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm leading-relaxed"
                  placeholder={`Enter the complete problem description including:

• Problem statement
• Input format
• Output format
• Constraints
• Sample test cases with explanations
• Time and space complexity requirements

Example:
Given an array of integers, find the contiguous subarray with the largest sum.

Input:
- First line: n (size of array)
- Second line: n space-separated integers

Output:
- Single integer: maximum sum

Constraints:
- 1 ≤ n ≤ 10^5
- -10^9 ≤ arr[i] ≤ 10^9

Sample Input:
5
-2 1 -3 4 -1

Sample Output:
4`}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - Info Panel */}
        {showSidebarPanels && (
          <div className="space-y-6">
            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
            >
              <h3 className="text-lg font-bold text-gray-200 mb-4">Current Status</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Selected Team</span>
                  <span className="text-cyber-blue-400 font-semibold text-sm">
                    {selectedTeamData ? selectedTeamData.team_name : "None"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Selected Problem</span>
                  <span className="text-cyber-blue-400 font-semibold text-sm">
                    {selectedProblemData ? selectedProblemData.title : "New Problem"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Title Status</span>
                  <span className={`text-sm font-semibold ${title ? "text-matrix-green" : "text-gray-500"}`}>
                    {title ? "Ready" : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Description</span>
                  <span className={`text-sm font-semibold ${description ? "text-matrix-green" : "text-gray-500"}`}>
                    {description ? "Ready" : "Pending"}
                  </span>
                </div>

                <div className="pt-3 border-t border-cyber-blue-400/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Ready to Save</span>
                    <div className="flex items-center gap-2">
                      {selectedTeam && title && description ? (
                        <CheckCircle className="w-5 h-5 text-matrix-green" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-warning-orange" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-5 rounded-2xl border border-warning-orange/30 bg-warning-orange/5"
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-warning-orange flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 space-y-2">
                  <p className="font-semibold text-warning-orange">Instructions</p>
                  <ul className="space-y-1 list-disc list-inside text-xs">
                    <li>Select a team from the dropdown</li>
                    <li>Select an existing problem or create new</li>
                    <li>Enter a clear problem title</li>
                    <li>Write detailed problem description</li>
                    <li>Include input/output format</li>
                    <li>Add constraints and examples</li>
                    <li>Click Save to assign problem</li>
                    <li>Use Preview to see how teams will view it</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
            >
              <h3 className="text-lg font-bold text-gray-200 mb-4">Team Stats</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Teams</span>
                  <span className="text-cyber-blue-400 font-bold">{teams.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Problems Created</span>
                  <span className="text-matrix-green font-bold">{problems.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Pending Assignments</span>
                  <span className="text-warning-orange font-bold">
                    {teams.length - problems.length > 0 ? teams.length - problems.length : 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}