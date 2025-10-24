import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PreContestCountdown from "@/components/dashboard/PreContestCountdown";
import TeamDetailsCard from "@/components/dashboard/TeamDetailsCard";
import ContestInfoSection from "@/components/dashboard/ContestInfoSection";
import { getTeamByAuthUser } from "@/lib/data/teams";
import { getUser } from "@/app/actions/auth";
import GlitchTitle from "@/components/dashboard/GlitchTitle";

export default async function DashboardPage() {
  // Check authentication
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch team data from database
  const teamData = await getTeamByAuthUser();

  if (!teamData) {
    return (
      <div className="relative min-h-screen bg-hack-black">
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
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
        </div>
        <Footer />
      </div>
    );
  }

  // Transform members to match component props
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
    <div className="relative min-h-screen bg-hack-black">
      {/* Background Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(28, 171, 242, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 171, 242, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="w-full max-w-6xl">
            {/* Title Section with Glitch Effect */}
            <div className="text-center mb-12">
              <GlitchTitle text="ALGOVIBE 2025" />
              <p className="text-xl md:text-2xl text-gray-400">
                Get ready for the ultimate algorithmic visualization challenge
              </p>
              <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyber-blue-400 to-transparent"></div>
            </div>

            {/* Countdown Component */}
            <div className="mb-12">
              <PreContestCountdown />
            </div>

            {/* Team Details Card with Real Database Data */}
            <div className="max-w-4xl mx-auto mb-12">
              <TeamDetailsCard
                teamName={teamData.team_name}
                teamMembers={transformedMembers}
              />
            </div>

            {/* Contest Information Section */}
            <div className="max-w-6xl mx-auto">
              <ContestInfoSection />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
