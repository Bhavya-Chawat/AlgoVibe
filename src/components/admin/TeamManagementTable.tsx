"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Eye, Edit2, Trash2, Users, Mail, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getTeams } from "@/app/(admin)/admin/actions";

interface Team {
  team_id: number;
  team_name: string;
  members: {
    member_id: number;
    name: string;
    email: string;
    role: string;
  }[];
  status: "active" | "pending";
  created_at: string;
}

export default function TeamManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchTeams, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    // Filter teams based on search query
    const filtered = teams.filter(team => {
      const matchesSearch = team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           team.members.some(member => 
                             member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             member.email.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      return matchesSearch;
    });
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const result = await getTeams();
      if (result.success && result.data) {
        setTeams(result.data);
      } else {
        console.error("Failed to fetch teams:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    active: "bg-[#00ff41]/10 text-[#00ff41] border-[#00ff41]/30",
    pending: "bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/30"
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header with Stats - Only Total and Approved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((index) => (
            <div key={index} className="bg-gradient-to-br from-[#1cabf2]/20 to-[#1cabf2]/5 border border-[#1cabf2]/30 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Search Bar - No Filter */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 animate-pulse">
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>

        {/* Teams Table - No Actions Column */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats - Only Total and Approved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1cabf2]/20 to-[#1cabf2]/5 border border-[#1cabf2]/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Teams</div>
              <div className="text-4xl font-bold text-[#1cabf2]">{teams.length}</div>
            </div>
            <Users className="w-12 h-12 text-[#1cabf2]/40" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#00ff41]/20 to-[#00ff41]/5 border border-[#00ff41]/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Active</div>
              <div className="text-4xl font-bold text-[#00ff41]">
                {teams.filter(t => t.status === "active").length}
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-[#00ff41]/40" />
          </div>
        </motion.div>
      </div>

      {/* Search Bar - No Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, leaders, or emails..."
              className="w-full pl-12 pr-4 py-3 bg-[#0a0a1f] border border-[#1cabf2]/20 rounded-xl text-white placeholder-gray-500 focus:border-[#1cabf2]/60 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#1cabf2]/20 border border-[#1cabf2]/40 rounded-xl text-[#1cabf2] font-semibold hover:bg-[#1cabf2]/30 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Teams Table - No Actions Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Team Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Leader</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Email</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Members</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => {
                const leader = team.members.find(member => member.role === 'Leader') || team.members[0];
                return (
                  <motion.tr
                    key={team.team_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{team.team_name}</div>
                      <div className="text-xs text-gray-400">Registered {new Date(team.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{leader?.name || "N/A"}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {leader?.email || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#1cabf2]/10 border border-[#1cabf2]/30 rounded-full text-[#1cabf2] text-sm font-semibold">
                        <Users className="w-3 h-3" />
                        {team.members.length}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[team.status]}`}>
                        {team.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-300 font-semibold">
                      0
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Showing {filteredTeams.length} of {teams.length} teams
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-all duration-300">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#1cabf2]/20 border border-[#1cabf2]/40 rounded-lg text-[#1cabf2] font-semibold">
              1
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-all duration-300">
              2
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-all duration-300">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}