"use client";
import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Code,
  Clock,
  CheckCircle,
  Download,
  Share2,
  Award,
  Star,
  Medal,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  team: string;
  score: number;
  submissions: number;
  badge: string;
}

export default function PostContestPage() {
  // Static team data
  const teamData = {
    teamName: "Code Warriors",
    rank: 12,
    totalTeams: 48,
    score: 850,
    submissions: {
      code: true,
      github: true,
      deployment: true,
    },
    completionTime: "1h 23m",
  };

  // Static contest statistics
  const contestStats = {
    totalSubmissions: 156,
    totalParticipants: 48,
    contestDuration: "90 minutes",
    problemsSolved: 42,
  };

  // Top 3 winners
  const topWinners = [
    { rank: 1, team: "AlgoMasters", score: 1000, initials: "AM" },
    { rank: 2, team: "CodeNinjas", score: 950, initials: "CN" },
    { rank: 3, team: "ByteForce", score: 920, initials: "BF" },
  ];

  // Dummy leaderboard data
  const dummyLeaderboardData: LeaderboardEntry[] = [
    { rank: 1, team: "AlgoMasters", score: 1000, submissions: 3, badge: "🥇" },
    { rank: 2, team: "CodeNinjas", score: 950, submissions: 3, badge: "🥈" },
    { rank: 3, team: "ByteForce", score: 920, submissions: 3, badge: "🥉" },
    { rank: 4, team: "DataDynamos", score: 890, submissions: 3, badge: "" },
    { rank: 5, team: "LogicLegends", score: 875, submissions: 3, badge: "" },
    { rank: 6, team: "SyntaxSorcerers", score: 860, submissions: 3, badge: "" },
    { rank: 7, team: "BitBusters", score: 840, submissions: 3, badge: "" },
    { rank: 8, team: "CodeCrafters", score: 825, submissions: 3, badge: "" },
    { rank: 9, team: "AlgorithmAces", score: 810, submissions: 3, badge: "" },
    { rank: 10, team: "DebugDynasty", score: 795, submissions: 3, badge: "" },
    { rank: 11, team: "FunctionFusion", score: 780, submissions: 3, badge: "" },
    { rank: 12, team: "Code Warriors", score: 765, submissions: 3, badge: "" },
    { rank: 13, team: "PixelPioneers", score: 750, submissions: 3, badge: "" },
    { rank: 14, team: "BinaryBrains", score: 740, submissions: 3, badge: "" },
    { rank: 15, team: "QuantumQuokkas", score: 725, submissions: 3, badge: "" },
  ];

  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardEntry[]>(dummyLeaderboardData);
  const [loading, setLoading] = useState(false);

  const handleDownloadCertificate = () => {
    alert("Certificate download will be available soon!");
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "AlgoVibe 2026 - Contest Results",
        text: `I just completed AlgoVibe 2026! Ranked #${teamData.rank} out of ${teamData.totalTeams} teams with a score of ${teamData.score}!`,
        url: window.location.href,
      });
    } else {
      alert("Share feature not supported on this browser");
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600 text-black";
    if (rank === 2) return "from-gray-300 to-gray-500 text-black";
    if (rank === 3) return "from-orange-400 to-orange-600 text-black";
    return "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-400/30";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
          linear-gradient(rgba(28, 171, 242, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(28, 171, 242, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              boxShadow: "0 0 40px rgba(28, 171, 242, 0.5)",
            }}
          >
            <Trophy className="w-10 h-10 text-black" />
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contest Completed
          </h1>

          <p className="text-xl text-gray-300 mb-3">
            Thank you for participating in
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">AlgoVibe 2026</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your submissions have been recorded. Results are now available
            below.
          </p>
        </div>

        {/* Team Performance Card */}
        <div
          className="backdrop-blur-xl rounded-2xl p-8 md:p-10 mb-10"
          style={{
            background: "rgba(10, 10, 31, 0.6)",
            border: "1px solid rgba(28, 171, 242, 0.3)",
            boxShadow: "0 8px 32px rgba(28, 171, 242, 0.2)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {teamData.teamName}
              </h3>
              <p className="text-gray-400">Your Performance Summary</p>
            </div>

            <div className="text-left md:text-right">
              <div
                className="text-5xl font-bold mb-1"
                style={{
                  background:
                    "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                #{teamData.rank}
              </div>
              <p className="text-sm text-gray-400">
                out of {teamData.totalTeams} teams
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div
              className="backdrop-blur-lg p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm text-gray-400">Score</span>
              </div>
              <p className="text-3xl font-bold text-[#ff6b35]">
                {teamData.score}
              </p>
            </div>

            <div
              className="backdrop-blur-lg p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#00d9ff]" />
                <span className="text-sm text-gray-400">Time</span>
              </div>
              <p className="text-2xl font-bold text-[#00d9ff]">
                {teamData.completionTime}
              </p>
            </div>

            <div
              className="backdrop-blur-lg p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#00fff7]" />
                <span className="text-sm text-gray-400">Rank</span>
              </div>
              <p className="text-3xl font-bold text-[#00fff7]">
                #{teamData.rank}
              </p>
            </div>

            <div
              className="backdrop-blur-lg p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(28, 171, 242, 0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-[#00ff41]" />
                <span className="text-sm text-gray-400">Status</span>
              </div>
              <p className="text-xl font-bold text-[#00ff41]">Complete</p>
            </div>
          </div>

          {/* Submissions Status */}
          <div
            className="backdrop-blur-lg p-6 rounded-xl"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(28, 171, 242, 0.2)",
            }}
          >
            <h4 className="text-lg font-semibold text-[#1cabf2] mb-4">
              Your Submissions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: "rgba(0, 255, 65, 0.1)",
                  border: "1px solid rgba(0, 255, 65, 0.3)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-[#00ff41]" />
                <span className="text-[#00ff41] font-medium">
                  Code Submitted
                </span>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: "rgba(0, 255, 65, 0.1)",
                  border: "1px solid rgba(0, 255, 65, 0.3)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-[#00ff41]" />
                <span className="text-[#00ff41] font-medium">
                  GitHub Linked
                </span>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: "rgba(0, 255, 65, 0.1)",
                  border: "1px solid rgba(0, 255, 65, 0.3)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-[#00ff41]" />
                <span className="text-[#00ff41] font-medium">Deployed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button
            onClick={handleDownloadCertificate}
            className="px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              boxShadow: "0 0 30px rgba(28, 171, 242, 0.4)",
              color: "#000",
            }}
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>

          <button
            onClick={handleShareResults}
            className="px-8 py-4 rounded-xl font-bold backdrop-blur-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 255, 247, 0.4)",
              color: "#00fff7",
            }}
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </div>

        {/* Top 3 Winners */}
        <div className="mb-12">
          <h3
            className="text-3xl font-bold text-center mb-8"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🏆 Top Performers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topWinners.map((winner) => (
              <div
                key={winner.rank}
                className="backdrop-blur-xl p-6 rounded-2xl text-center"
                style={{
                  background:
                    winner.rank === 1
                      ? "rgba(255, 107, 53, 0.1)"
                      : winner.rank === 2
                      ? "rgba(200, 200, 200, 0.1)"
                      : "rgba(205, 127, 50, 0.1)",
                  border:
                    winner.rank === 1
                      ? "1px solid rgba(255, 107, 53, 0.4)"
                      : winner.rank === 2
                      ? "1px solid rgba(200, 200, 200, 0.4)"
                      : "1px solid rgba(205, 127, 50, 0.4)",
                  boxShadow:
                    winner.rank === 1
                      ? "0 8px 32px rgba(255, 107, 53, 0.2)"
                      : winner.rank === 2
                      ? "0 8px 32px rgba(200, 200, 200, 0.2)"
                      : "0 8px 32px rgba(205, 127, 50, 0.2)",
                }}
              >
                {/* Rank Badge */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl"
                    style={{
                      background:
                        winner.rank === 1
                          ? "linear-gradient(135deg, #ff6b35 0%, #ffd700 100%)"
                          : winner.rank === 2
                          ? "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)"
                          : "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)",
                      color: "#000",
                    }}
                  >
                    {winner.rank}
                  </div>
                </div>

                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-xl mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
                    color: "#000",
                  }}
                >
                  {winner.initials}
                </div>

                <h4 className="text-xl font-bold text-white mb-2">
                  {winner.team}
                </h4>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{
                    background:
                      "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {winner.score}
                </p>
                <p className="text-sm text-gray-400">points</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="mb-12">
          <h3
            className="text-3xl font-bold text-center mb-8"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            <Medal className="inline w-8 h-8 mr-2" />
            Complete Leaderboard
          </h3>

          <div
            className="backdrop-blur-xl rounded-2xl p-6"
            style={{
              background: "rgba(10, 10, 31, 0.6)",
              border: "1px solid rgba(28, 171, 242, 0.2)",
              boxShadow: "0 8px 32px rgba(28, 171, 242, 0.2)",
            }}
          >
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                <p className="text-gray-400">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/30">
                      <th className="pb-4 text-left text-cyan-400 font-semibold">
                        Rank
                      </th>
                      <th className="pb-4 text-left text-cyan-400 font-semibold">
                        Team
                      </th>
                      <th className="pb-4 text-right text-cyan-400 font-semibold">
                        Score
                      </th>
                      <th className="pb-4 text-right text-cyan-400 font-semibold">
                        Submissions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
                      >
                        <td className="py-4">
                          <div
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-gradient-to-br ${getRankStyle(
                              entry.rank
                            )}`}
                          >
                            {getRankBadge(entry.rank)}
                          </div>
                        </td>
                        <td className="py-4 font-medium text-white">
                          {entry.team}
                        </td>
                        <td className="py-4 text-right font-bold text-cyan-400">
                          {entry.score}
                        </td>
                        <td className="py-4 text-right text-gray-400">
                          {entry.submissions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Contest Statistics */}
        <div
          className="backdrop-blur-xl p-8 rounded-2xl mb-12"
          style={{
            background: "rgba(10, 10, 31, 0.6)",
            border: "1px solid rgba(28, 171, 242, 0.2)",
            boxShadow: "0 8px 32px rgba(28, 171, 242, 0.2)",
          }}
        >
          <h3
            className="text-2xl font-bold text-center mb-8"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contest Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(28, 171, 242, 0.2)",
                  border: "1px solid rgba(28, 171, 242, 0.4)",
                }}
              >
                <Users className="w-8 h-8 text-[#1cabf2]" />
              </div>
              <p className="text-3xl font-bold text-[#1cabf2] mb-1">
                {contestStats.totalParticipants}
              </p>
              <p className="text-sm text-gray-400">Teams</p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0, 255, 247, 0.2)",
                  border: "1px solid rgba(0, 255, 247, 0.4)",
                }}
              >
                <Code className="w-8 h-8 text-[#00fff7]" />
              </div>
              <p className="text-3xl font-bold text-[#00fff7] mb-1">
                {contestStats.totalSubmissions}
              </p>
              <p className="text-sm text-gray-400">Submissions</p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0, 255, 65, 0.2)",
                  border: "1px solid rgba(0, 255, 65, 0.4)",
                }}
              >
                <CheckCircle className="w-8 h-8 text-[#00ff41]" />
              </div>
              <p className="text-3xl font-bold text-[#00ff41] mb-1">
                {contestStats.problemsSolved}
              </p>
              <p className="text-sm text-gray-400">Solved</p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255, 107, 53, 0.2)",
                  border: "1px solid rgba(255, 107, 53, 0.4)",
                }}
              >
                <Clock className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <p className="text-2xl font-bold text-[#ff6b35] mb-1">
                {contestStats.contestDuration}
              </p>
              <p className="text-sm text-gray-400">Duration</p>
            </div>
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center">
          <h3
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #1cabf2 0%, #00d9ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Thank You for Participating
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Your skills and dedication made AlgoVibe 2026 a success. Stay
            connected for future competitions and opportunities.
          </p>

          <div className="mt-8">
            <p className="text-gray-300 mb-4">
              We'd love to hear your feedback!
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSe7sa-INTuAfUKREtN8OQzjxc36lxYZwO42jQ60gfNldk-4Cw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-semibold backdrop-blur-lg transition-all hover:scale-105 inline-flex items-center gap-2"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(28, 171, 242, 0.4)",
                color: "#1cabf2",
              }}
            >
              Provide Feedback
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
