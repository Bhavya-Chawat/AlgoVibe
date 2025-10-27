import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getContestStatus, getTeamContestData } from "@/app/actions/contest";
import ContestPageClient from "./ContestPageClient";

export default async function ContestPage() {
  // Authenticate user
  const user = await getCurrentUser();

  // Check for roles and access
  if (
    !user ||
    (user.role !== "admin" && user.role !== "evaluator" && user.role !== "contestant")
  ) {
    redirect("/unauthorized");
  }

  if (user.role !== "contestant") {
    redirect("/unauthorized");
  }

  // Extract teamId from email
  const email = user.email ?? "";
  const teamIdMatch = email.match(/^team-(\d+)@algovibe\.com$/);
  if (!teamIdMatch) redirect("/unauthorized");

  const teamId = parseInt(teamIdMatch[1], 10);
  if (isNaN(teamId)) redirect("/unauthorized");

  // Fetch contest status
  const contestStatus = await getContestStatus();
  if (!contestStatus.success || !contestStatus.contest?.is_active) {
    redirect("/pre-contest");
    return null; // to satisfy TS
  }

  // Fetch team's problem and submissions
  const { problem, submissions } = await getTeamContestData(teamId);

  return (
    <ContestPageClient
      problem={problem}
      initialSubmissions={submissions}
      teamId={teamId}
    />
  );
}
