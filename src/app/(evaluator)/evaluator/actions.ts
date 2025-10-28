"use server";

import { createAdminClient } from "@/lib/supabase/server";

// Get all teams with their members
export async function getAllTeams() {
  const supabase = createAdminClient();

  const { data: teams, error } = await supabase
    .from("teams")
    .select(
      `
      team_id,
      team_name,
      created_at,
      members (
        member_id,
        name,
        usn,
        role
      )
    `
    )
    .order("team_name");

  if (error) {
    console.error("Error fetching teams:", error);
    return { success: false, error: "Failed to fetch teams" };
  }

  // Transform data to include leader info and member count
  const teamsWithDetails = teams.map((team) => {
    const leader = team.members.find((member: any) => member.role === "Leader");
    return {
      team_id: team.team_id,
      team_name: team.team_name,
      leader: leader ? leader.name : "No Leader Assigned",
      member_count: team.members.length,
      members: team.members,
    };
  });

  return { success: true, teams: teamsWithDetails };
}

// Get assigned problem for a specific team
export async function getTeamProblem(teamId: number) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("team_problems")
    .select(
      `
      problem:problems(
        problem_id,
        title,
        description
      )
    `
    )
    .eq("team_id", teamId)
    .single();

  if (error) {
    console.error("Error fetching team problem:", error);
    return { success: false, error: "Failed to fetch team problem" };
  }

  return { success: true, problem: data?.problem || null };
}

// Get all submissions for a specific team
export async function getTeamSubmissions(teamId: number) {
  const supabase = createAdminClient();

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(
      `
      submission_id,
      team_id,
      problem_id,
      submission,
      status,
      score,
      feedback,
      submitted_at,
      submission_type,
      member:members(
        name,
        usn
      )
    `
    )
    .eq("team_id", teamId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching team submissions:", error);
    return { success: false, error: "Failed to fetch team submissions" };
  }

  return { success: true, submissions: submissions || [] };
}

// Assign score to all submissions of a team for a specific problem
export async function assignScoreToTeamSubmissions(
  teamId: number,
  problemId: number,
  score: number,
  feedback: string
) {
  const supabase = createAdminClient();

  // Get all submissions for this team and problem
  const { data: submissions, error: fetchError } = await supabase
    .from("submissions")
    .select("submission_id")
    .eq("team_id", teamId)
    .eq("problem_id", problemId);

  if (fetchError) {
    console.error("Error fetching submissions:", fetchError);
    return { success: false, error: "Failed to fetch submissions" };
  }

  // Update all submissions with the same score and feedback
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      score: score,
      feedback: feedback,
      evaluated_at: new Date().toISOString(),
    })
    .in(
      "submission_id",
      submissions.map((s) => s.submission_id)
    );

  if (updateError) {
    console.error("Error updating submissions:", updateError);
    return { success: false, error: "Failed to update submissions" };
  }

  return { success: true, message: "Scores assigned successfully" };
}
