"use client";

import { useState, useEffect } from "react";
import { Users, Mail, CheckCircle } from "lucide-react";
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
  submissionCount: number;
}

interface TeamManagementTableProps {
  searchQuery: string;
  filterStatus: string;
  isLoading: boolean;
}

export default function TeamManagementTable({
  searchQuery,
  filterStatus,
  isLoading,
}: TeamManagementTableProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(10);

  useEffect(() => {
    fetchTeams();
    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchTeams, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    // Filter teams based on search query and status filter
    const filtered = teams.filter((team) => {
      // Search filter
      const matchesSearch =
        team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members.some(
          (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        filterStatus === "all" || team.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
    setFilteredTeams(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filterStatus, teams]);

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

  // Get current teams for pagination
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const statusStyles = {
    active: "bg-[#00ff41]/10 text-[#00ff41] border-[#00ff41]/30",
    pending: "bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/30",
  };

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header with Stats - Only Total and Approved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#1cabf2]/20 to-[#1cabf2]/5 border border-[#1cabf2]/30 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
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
              <div className="text-4xl font-bold text-[#1cabf2]">
                {teams.length}
              </div>
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
                {teams.filter((t) => t.status === "active").length}
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-[#00ff41]/40" />
          </div>
        </motion.div>
      </div>

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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">
                  Team Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">
                  Leader
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">
                  Email
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">
                  Members
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">
                  Submissions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team, index) => {
                const leader =
                  team.members.find((member) => member.role === "Leader") ||
                  team.members[0];
                return (
                  <motion.tr
                    key={team.team_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">
                        {team.team_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        Registered{" "}
                        {new Date(team.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {leader?.name || "N/A"}
                    </td>
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
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                          statusStyles[team.status]
                        }`}
                      >
                        {team.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-300 font-semibold">
                      {team.submissionCount}
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
            Showing {indexOfFirstTeam + 1}-
            {Math.min(indexOfLastTeam, filteredTeams.length)} of{" "}
            {filteredTeams.length} teams
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 1
                  ? "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to display
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, startPage + 4);

              if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
              }

              const pageNum = startPage + i;
              if (pageNum > endPage) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === pageNum
                      ? "bg-[#1cabf2]/20 border border-[#1cabf2]/40 text-[#1cabf2]"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
