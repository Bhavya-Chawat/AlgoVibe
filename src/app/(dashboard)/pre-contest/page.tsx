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
  // Note: You might want to rename submitCode to getContestStatus if you separate concerns.
  const contestResult = await getContestStatus(); // Call without submission data just to get contest status

  // If contest info not returned or error
  if (!contestResult || contestResult.success === false) {
    // If contest is active, redirect to contest page
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
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-20">
        <ContestHeader />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-14">
            <GlitchTitle text="ALGOVIBE 2025" />
            <p className="text-lg md:text-2xl text-gray-400 mt-2">
              Get ready for the ultimate algorithmic visualization challenge
            </p>
            <div className="mt-6 h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent"></div>
          </div>

          <div className="mb-12">
            <PreContestCountdown />
          </div>

          <div className="max-w-4xl mx-auto mb-14">
            <TeamDetailsCard
              teamName={teamData.team_name}
              teamMembers={transformedMembers}
            />
          </div>

          <div className="max-w-6xl mx-auto mb-20">
            <ContestInfoSection />
          </div>

          {/* Example Project Card */}
          <div className="max-w-4xl mx-auto mb-14">
            <div className="glass-panel-strong p-6 md:p-8 rounded-2xl border border-cyber-blue-400/30">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="text-white">Example </span>
                  <span className="text-gradient">Project</span>
                </h2>
                <p className="text-gray-400 mt-2">
                  Check out a sample project to understand the expected deliverables
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href="https://samurai-search.netlify.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel p-6 hover:glass-panel-strong transition-all duration-500 hover:scale-105 relative overflow-hidden rounded-xl border border-neon-blue/30"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-blue">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors">
                      Deployed Link
                    </h3>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    https://samurai-search.netlify.app/
                  </p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-neon-blue/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </a>

                <a 
                  href="https://github.com/gshlok/SearchStory" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel p-6 hover:glass-panel-strong transition-all duration-500 hover:scale-105 relative overflow-hidden rounded-xl border border-matrix-green/30"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-matrix-green/10 border border-matrix-green/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-matrix-green">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-matrix-green transition-colors">
                      GitHub Repository
                    </h3>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    https://github.com/gshlok/SearchStory
                  </p>
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