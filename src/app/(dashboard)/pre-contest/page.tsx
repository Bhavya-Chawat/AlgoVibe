import { redirect } from "next/navigation";
import ContestHeader from "@/components/layout/ContestHeader";
import PreContestCountdown from "@/components/dashboard/PreContestCountdown";
import TeamDetailsCard from "@/components/dashboard/TeamDetailsCard";
import ContestInfoSection from "@/components/dashboard/ContestInfoSection";
import { getTeamByAuthUser } from "@/lib/data/teams";
import { getUser } from "@/app/actions/auth";
import GlitchTitle from "@/components/dashboard/GlitchTitle";
import { getContestStatus } from "@/app/actions/contest";

export default async function PreContestPage() {
  // Check authentication
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // Call the contest server action to get the contest info
  const contestResult = await getContestStatus();

  // If contest info not returned or error
  if (!contestResult || contestResult.success === false) {
    if (contestResult?.contest?.is_active) {
      redirect("/contest");
    }
  } else if (contestResult.contest?.is_active) {
    redirect("/contest");
  }

  // Fetch team data for the user
  const teamData = await getTeamByAuthUser();

  if (!teamData) {
    return (
      <div className="relative min-h-screen bg-hack-black text-center flex flex-col items-center justify-center">
        <ContestHeader />
        <h1 className="text-3xl font-bold text-alert-red mb-4">
          Team Not Found
        </h1>
        <p className="text-gray-400 mb-6">
          Unable to load your team data. Please contact support.
        </p>
        <a
          href="/login"
          className="text-cyber-blue-400 hover:text-cyber-blue-300 underline"
        >
          Return to Login
        </a>
      </div>
    );
  }

  const transformedMembers = teamData.members.map((member) => ({
    id: member.member_id.toString(),
    name: member.name,
    role: member.role as "Leader" | "Member",
    email: member.email || "",
    phone: member.phone_number || "",
    section: member.section || "",
    usn: member.usn || "",
    github: member.github_profile || "",
    linkedin: member.linkedin_profile || "",
  }));

  return (
    <div className="relative min-h-screen bg-hack-black overflow-hidden">
      {/* Subtle Background Grid Pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20 grid-pattern"
      ></div>

      <div className="relative z-20">
        <ContestHeader />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-28 pb-20">
        <div className="w-full max-w-6xl space-y-12">
          {/* Header Title */}
          <div className="text-center pt-6">
            <GlitchTitle text="ALGOVIBE 2026" />
            <p className="text-lg md:text-2xl text-gray-300 font-semibold mt-3">
              Get ready for the ultimate Hackathon Competition
            </p>
            <div className="mt-6 h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent"></div>
          </div>

          {/* Countdown Timer */}
          <div>
            <PreContestCountdown />
          </div>

          {/* Team Details */}
          <div className="max-w-4xl mx-auto">
            <TeamDetailsCard
              teamName={teamData.team_name}
              teamMembers={transformedMembers}
            />
          </div>

          {/* Contest Guidelines */}
          <div className="max-w-6xl mx-auto">
            <ContestInfoSection />
          </div>

          {/* Example Project Card */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel-strong p-8 rounded-3xl border border-cyber-blue-400/30 shadow-2xl glow-card">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold font-heading">
                  <span className="text-white">Sample Benchmark </span>
                  <span className="text-gradient">Project</span>
                </h2>
                <p className="text-gray-300 mt-2 text-sm">
                  Check out a benchmark submission to understand expected deliverable quality
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href="https://samurai-search.netlify.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel p-6 hover:glass-panel-strong transition-all duration-500 hover:scale-[1.03] relative overflow-hidden rounded-2xl border border-neon-blue/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-blue">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neon-blue font-bold font-mono">Live Prototype</span>
                        <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors font-heading">
                          Deployed Web App
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-cyber-blue-400 font-mono break-all group-hover:text-white transition-colors">
                      https://samurai-search.netlify.app/
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-neon-blue/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </a>

                <a 
                  href="https://github.com/gshlok/SearchStory" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel p-6 hover:glass-panel-strong transition-all duration-500 hover:scale-[1.03] relative overflow-hidden rounded-2xl border border-matrix-green/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-matrix-green/10 border border-matrix-green/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-matrix-green">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                          <path d="M9 18c-4.51 2-5-2-7-2"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-matrix-green font-bold font-mono">Source Code</span>
                        <h3 className="text-lg font-bold text-white group-hover:text-matrix-green transition-colors font-heading">
                          GitHub Repository
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-matrix-green font-mono break-all group-hover:text-white transition-colors">
                      https://github.com/gshlok/SearchStory
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-matrix-green/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}