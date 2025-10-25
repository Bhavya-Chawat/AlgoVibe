"use client";

import { useState, useEffect } from "react";
import { Search, Download, Filter, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/modern-ui/src/components/ui/Input";
import TeamManagementTable from "@/components/admin/TeamManagementTable";

export default function AdminTeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/admin/teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Export teams data to CSV
    const csv = [
      ["Team Name", "Leader", "Email", "Members", "Status"].join(","),
      ...teams.map((team: any) => 
        [team.name, team.leader, team.email, team.members.length, team.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams-export.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Team Management
          </h1>
          <p className="text-gray-400">
            View and manage all registered teams
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-cyber-blue-400 to-neon-blue text-hack-black font-bold rounded-xl shadow-[0_0_20px_rgba(28,171,242,0.4)] hover:shadow-[0_0_30px_rgba(28,171,242,0.6)] transition-all duration-300 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add New Team
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Teams", value: teams.length || 48, color: "cyber-blue-400" },
          { label: "Active", value: teams.filter((t: any) => t.status === "active").length || 42, color: "matrix-green" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel-strong p-4 rounded-xl border border-cyber-blue-400/20"
          >
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-panel-strong p-6 rounded-2xl border border-cyber-blue-400/20"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams by name, leader, or email..."
              className="w-full bg-hack-navy/50 border-cyber-blue-400/30 pl-12 pr-4 py-3 rounded-xl text-gray-200 placeholder-gray-500 focus:border-cyber-blue-400 focus:ring-2 focus:ring-cyber-blue-400/20 transition-all duration-300"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-hack-navy/50 border border-cyber-blue-400/30 text-gray-200 rounded-xl focus:border-cyber-blue-400 focus:ring-2 focus:ring-cyber-blue-400/20 transition-all duration-300 appearance-none cursor-pointer pr-10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="px-6 py-3 glass-panel border border-electric-cyan/40 text-electric-cyan rounded-xl hover:border-electric-cyan/60 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </motion.button>
        </div>
      </motion.div>

      {/* Teams Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <TeamManagementTable
          {...({ teams, searchQuery, filterStatus, isLoading } as any)}
        />
      </motion.div>
    </div>
  );
}