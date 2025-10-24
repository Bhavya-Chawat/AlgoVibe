"use client";

import { useState } from "react";
import { Save, Eye, Users, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Team {
  id: string;
  name: string;
  leader: string;
  members: number;
}

export default function ProblemEditor() {
  // Mock teams data - replace with actual API call
  const teams: Team[] = [
    { id: "1", name: "CodeNinjas", leader: "John Doe", members: 3 },
    { id: "2", name: "AlgoMasters", leader: "Jane Smith", members: 4 },
    { id: "3", name: "ByteBreakers", leader: "Mike Johnson", members: 3 },
    { id: "4", name: "DevDynamos", leader: "Sarah Williams", members: 4 },
    { id: "5", name: "CodeCrafters", leader: "Alex Brown", members: 3 }
  ];

  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handlePreview = () => {
    console.log("Preview problem statement for team:", selectedTeam);
  };

  const selectedTeamData = teams.find(t => t.id === selectedTeam);

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
                The problem has been updated for {selectedTeamData?.name}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
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
              >
                <option value="" className="bg-hack-navy text-gray-400">
                  -- Select a Team --
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id} className="bg-hack-navy text-gray-200">
                    {team.name} - Led by {team.leader} ({team.members} members)
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
                      <p className="font-semibold text-gray-200">{selectedTeamData.name}</p>
                      <p className="text-sm text-gray-400">
                        Team Leader: {selectedTeamData.leader}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                      <span className="text-xs font-semibold text-neon-blue">
                        {selectedTeamData.members} Members
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
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
                  disabled={!selectedTeam}
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
                  disabled={!selectedTeam}
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
                  {selectedTeamData ? selectedTeamData.name : "None"}
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
                  <li>Enter a clear problem title</li>
                  <li>Write detailed problem description</li>
                  <li>Include input/output format</li>
                  <li>Add constraints and examples</li>
                  <li>Click Save to assign problem</li>
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
                <span className="text-sm text-gray-400">Problems Assigned</span>
                <span className="text-matrix-green font-bold">3</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Pending</span>
                <span className="text-warning-orange font-bold">{teams.length - 3}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}