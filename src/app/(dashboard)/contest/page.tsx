import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ContestPageClient from "./ContestPageClient";
import { createAdminClient } from "@/lib/supabase/server";

export default async function ContestPage() {
  // Get current authenticated user & role
  const user = await getCurrentUser();

  if (
    !user ||
    (user.role !== "admin" && user.role !== "evaluator" && user.role !== "contestant")
  ) {
    redirect("/unauthorized");
  }

  // Only allow contestants to access contest page
  if (user.role !== "contestant") {
    redirect("/unauthorized");
  }

  // Parse teamId from email: "team-{teamId}@algovibe.com"
  const email = user.email;
  if (!email) {
    redirect("/unauthorized");
  }

  const teamIdMatch = email.match(/^team-(\d+)@algovibe\.com$/);
  if (!teamIdMatch) {
    redirect("/unauthorized");
  }

  const teamId = parseInt(teamIdMatch[1], 10);
  if (isNaN(teamId)) {
    redirect("/unauthorized");
  }

  const supabase = createAdminClient();

  // Check if contest is active
  const { data: contest, error: contestError } = await supabase
    .from("contest")
    .select("is_active")
    .single();

  if (contestError || !contest?.is_active) {
    redirect("/pre-contest");
  }

  // Fetch assigned problem for the team, problem might be an array, so handle accordingly
  const { data: teamProblem, error: teamProblemError } = await supabase
    .from("team_problems")
    .select("problem:problems(problem_id, title, description)")
    .eq("team_id", teamId)
    .maybeSingle();

  // Normalize problem to be a single object or null
  const problem = Array.isArray(teamProblem?.problem)
    ? teamProblem.problem[0] ?? null
    : teamProblem?.problem ?? null;

  // Fetch submissions for this team with problem details
  const { data: submissionsData, error: submissionsError } = await supabase
    .from("submissions")
    .select(`
      submission_id,
      code,
      github_link,
      deployment_link,
      status,
      score,
      feedback,
      submitted_at,
      problem:problems(problem_id, title)
    `)
    .eq("team_id", teamId)
    .order("submitted_at", { ascending: false });

  const submissions = submissionsError || !submissionsData ? [] : submissionsData;

  return (
    <ContestPageClient
      problem={problem}
      initialSubmissions={submissions}
      teamId={teamId}
    />
  );
}
