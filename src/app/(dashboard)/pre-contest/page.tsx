import { redirect } from "next/navigation";
import ContestHeader from "@/components/layout/ContestHeader";
import PreContestCountdown from "@/components/dashboard/PreContestCountdown";
import TeamDetailsCard from "@/components/dashboard/TeamDetailsCard";
import ContestInfoSection from "@/components/dashboard/ContestInfoSection";
import { getTeamByAuthUser } from "@/lib/data/teams";
import { getUser } from "@/app/actions/auth";
import GlitchTitle from "@/components/dashboard/GlitchTitle";
import { createAdminClient } from "@/lib/supabase/server";

export default async function PreContestPage() {
  // Check authentication
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = createAdminClient();

  // Fetch contest active status
  const { data: contest } = await supabase
    .from("contest")
    .select("is_active")
    .single();

  // If contest is active, redirect to contest page
  if (contest?.is_active) {
    redirect("/contest");
  }

  // Fetch team data for the user
  const teamData = await getTeamByAuthUser();

  if (!teamData) {
    return (
      <div className="relative min-h-screen bg-hack-black text-center flex flex-col items-center justify-center">
        <ContestHeader />
        <h1 className="text-3xl font-bold text-alert-red mb-4">Team Not Found</h1>
        <p className="text-gray-400 mb-6">
          Unable to load your team data. Please contact support.
        </p>
        <a href="/login" className="text-cyber-blue-400 hover:text-cyber-blue-300 underline">
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
            <TeamDetailsCard teamName={teamData.team_name} teamMembers={transformedMembers} />
          </div>

          <div className="max-w-6xl mx-auto mb-20">
            <ContestInfoSection />
          </div>
        </div>
      </main>
    </div>
  );
}
