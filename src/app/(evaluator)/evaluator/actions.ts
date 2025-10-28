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

// Assign detailed scores to all submissions of a team for a specific problem
export async function assignDetailedScoresToTeamSubmissions(
  teamId: number,
  problemId: number,
  scores: {
    visualizationQuality: number;
    coreLogicEfficiency: number;
    webAppUX: number;
    engineeringRepo: number;
  },
  feedback: string,
  evaluatorName: string
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

  // Calculate total score
  const totalScore =
    scores.visualizationQuality +
    scores.coreLogicEfficiency +
    scores.webAppUX +
    scores.engineeringRepo;

  // Check if a score record already exists for this team and problem
  const { data: existingScores, error: fetchScoresError } = await supabase
    .from("scores")
    .select("score_id")
    .eq("team_id", teamId)
    .eq("problem_id", problemId)
    .limit(1);

  let scoreError = null;

  if (fetchScoresError) {
    console.error("Error checking existing scores:", fetchScoresError);
    return { success: false, error: "Failed to check existing scores" };
  }

  if (existingScores && existingScores.length > 0) {
    // Update existing score record
    const { error: updateError } = await supabase
      .from("scores")
      .update({
        visualization_quality_score: scores.visualizationQuality,
        core_logic_efficiency_score: scores.coreLogicEfficiency,
        web_app_ux_score: scores.webAppUX,
        engineering_repo_score: scores.engineeringRepo,
        total_score: totalScore,
        feedback: feedback,
        evaluator_name: evaluatorName,
        evaluated: true,
        evaluated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("score_id", existingScores[0].score_id);

    scoreError = updateError;
  } else {
    // Create a new score record for the team/problem combination
    const { error: insertError } = await supabase.from("scores").insert({
      team_id: teamId,
      problem_id: problemId,
      visualization_quality_score: scores.visualizationQuality,
      core_logic_efficiency_score: scores.coreLogicEfficiency,
      web_app_ux_score: scores.webAppUX,
      engineering_repo_score: scores.engineeringRepo,
      total_score: totalScore,
      feedback: feedback,
      evaluator_name: evaluatorName,
      evaluated: true,
      evaluated_at: new Date().toISOString(),
    });

    scoreError = insertError;
  }

  if (scoreError) {
    console.error("Error saving scores:", scoreError);
    return { success: false, error: "Failed to save scores" };
  }

  // Update all submissions with the total score and feedback
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      score: totalScore,
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

// Get scores for a specific team and problem
export async function getTeamScores(teamId: number, problemId: number) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("team_id", teamId)
    .eq("problem_id", problemId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching team scores:", error);
    return { success: false, error: "Failed to fetch team scores" };
  }

  return { success: true, scores: data?.[0] || null };
}
