"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getRecentActivity } from "@/app/(admin)/admin/actions";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  team: string;
  action: string;
  time: string;
  status: "success" | "error" | "pending";
}

export default function AdminActivityPage() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchActivity();
    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchActivity, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const result = await getRecentActivity();
      if (result.success && result.data) {
        // Ensure status values are properly typed
        const typedActivity = result.data.map((item: any) => ({
          team: item.team,
          action: item.action,
          time: item.time,
          status: item.status as "success" | "error" | "pending",
        }));
        setActivity(typedActivity);
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add headers
      csvContent += "Team Name,Action,Status,Time\n";

      // Add activity data
      activity.forEach((activityItem) => {
        csvContent += `"${activityItem.team}","${activityItem.action}","${activityItem.status}","${activityItem.time}"\n`;
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `activity_feed_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Activity data exported successfully");
    } catch (error) {
      console.error("Failed to export activity data:", error);
    }
  };

  const statusColors = {
    success: {
      bg: "bg-[#00ff41]/10",
      text: "text-[#00ff41]",
      dot: "bg-[#00ff41]",
    },
    error: {
      bg: "bg-[#ff0055]/10",
      text: "text-[#ff0055]",
      dot: "bg-[#ff0055]",
    },
    pending: {
      bg: "bg-[#ff6b35]/10",
      text: "text-[#ff6b35]",
      dot: "bg-[#ff6b35]",
    },
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activity.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activity.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Activity Feed
            </h1>
            <p className="text-gray-400">
              Complete history of team submissions and activities
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="p-4 bg-hack-navy/30 border border-cyber-blue-400/20 rounded-xl animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/admin"
              className="p-2 hover:bg-hack-navy/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyber-blue-400" />
            </Link>
            <h1 className="text-4xl font-bold text-gradient">Activity Feed</h1>
          </div>
          <p className="text-gray-400 ml-10">
            Complete history of team submissions and activities
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-blue-400 to-neon-blue hover:from-cyber-blue-500 hover:to-neon-blue text-hack-black font-semibold rounded-lg transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Activity List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-hack-navy/30 border border-cyber-blue-400/20 rounded-2xl p-6"
      >
        {currentItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No activity found
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.map((activityItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-hack-black/30 border border-cyber-blue-400/10 rounded-xl hover:border-cyber-blue-400/30 transition-all duration-300"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    statusColors[activityItem.status].dot
                  } animate-pulse`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-200">
                      {activityItem.team}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        statusColors[activityItem.status].bg
                      } ${statusColors[activityItem.status].text}`}
                    >
                      {activityItem.status}
                    </span>
                  </div>
                  <div className="text-gray-300 mb-1">
                    {activityItem.action}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activityItem.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-cyber-blue-400/20">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, activity.length)} of {activity.length}{" "}
              activities
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === 1
                    ? "bg-hack-navy/50 text-gray-600 cursor-not-allowed"
                    : "bg-hack-navy/50 text-cyber-blue-400 hover:bg-cyber-blue-400/20"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? "bg-cyber-blue-400/20 text-cyber-blue-400 border border-cyber-blue-400/40"
                        : "bg-hack-navy/50 text-gray-400 hover:bg-cyber-blue-400/20"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "bg-hack-navy/50 text-gray-600 cursor-not-allowed"
                    : "bg-hack-navy/50 text-cyber-blue-400 hover:bg-cyber-blue-400/20"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
