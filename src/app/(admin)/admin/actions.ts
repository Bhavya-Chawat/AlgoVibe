"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Contest Management Functions

export async function startContest(durationMinutes: number = 90) {
  const adminClient = createAdminClient();
  
  try {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    console.log("Starting contest with params:", {
      is_active: true,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes
    });

    // First try to update existing contest record
    const { data, error } = await adminClient
      .from("contest")
      .update({
        is_active: true,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("contest_id", 3) // Use contest_id = 3 as requested
      .select()
      .single();

    // If no record exists, insert a new one
    if (error && error.code === "PGRST116") {
      // No rows found
      const { data: newData, error: insertError } = await adminClient
        .from("contest")
        .insert({
          contest_id: 3, // Use contest_id = 3 as requested
          is_active: true,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to insert contest - Supabase error:", insertError);
        throw new Error(insertError.message);
      }

      console.log("Contest inserted successfully:", newData);
      revalidatePath("/admin");
      revalidatePath("/admin/contest");
      return { success: true, data: newData };
    }

    if (error) {
      console.error("Failed to start contest - Supabase error:", error);
      throw new Error(error.message);
    }

    console.log("Contest started successfully:", data);

    revalidatePath("/admin");
    revalidatePath("/admin/contest");

    return { success: true, data };
  } catch (error) {
    console.error("Failed to start contest:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function stopContest() {
  const adminClient = createAdminClient();
  
  try {
    const endTime = new Date().toISOString();
    console.log("Stopping contest with end time:", endTime);

    // Update contest with proper end time
    const { data, error } = await adminClient
      .from("contest")
      .update({
        is_active: false,
        end_time: endTime,
      })
      .eq("contest_id", 3) // Use contest_id = 3 as requested
      .select()
      .single();

    if (error) {
      console.error("Failed to stop contest - Supabase error:", error);
      throw new Error(error.message);
    }

    console.log("Contest stopped successfully:", data);

    revalidatePath("/admin");
    revalidatePath("/admin/contest");

    return { success: true, data };
  } catch (error) {
    console.error("Failed to stop contest:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function resetContest() {
  const adminClient = createAdminClient();
  
  try {
    console.log("Resetting contest");

    const { data, error } = await adminClient
      .from("contest")
      .update({ 
        is_active: false,
        start_time: null,
        end_time: null,
        duration_minutes: 90
      })
      .eq("contest_id", 3) // Use contest_id = 3 as requested
      .select()
      .single();

    if (error) {
      console.error("Failed to reset contest - Supabase error:", error);
      throw new Error(error.message);
    }

    console.log("Contest reset successfully:", data);

    revalidatePath("/admin");
    revalidatePath("/admin/contest");
    
    return { success: true, data };
  } catch (error) {
    console.error("Failed to reset contest:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getContestStatus() {
  const adminClient = createAdminClient();
  
  try {
    console.log("Fetching contest status");

    const { data, error } = await adminClient
      .from("contest")
      .select("*")
      .eq("contest_id", 3) // Use contest_id = 3 as requested
      .single();

    if (error) {
      console.error("Failed to get contest status - Supabase error:", error);
      throw new Error(error.message);
    }

    console.log("Contest status fetched successfully:", data);
    
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get contest status:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Team Management Functions

export async function getTeams() {
  const adminClient = createAdminClient();

  try {
    const { data: teams, error } = await adminClient
      .from("teams")
      .select(
        `
        *,
        members (
          member_id,
          name,
          email,
          usn,
          role,
          section
        ),
        submissions (
          submission_id
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const teamsWithStatus = teams.map((team) => ({
      ...team,
      status: team.members && team.members.length > 0 ? "active" : "pending",
      submissionCount: team.submissions ? team.submissions.length : 0,
    }));

    return { success: true, data: teamsWithStatus };
  } catch (error) {
    console.error("Failed to get teams:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getTeamById(teamId: number) {
  const adminClient = createAdminClient();

  try {
    const { data: team, error } = await adminClient
      .from("teams")
      .select(
        `
        *,
        members (
          member_id,
          name,
          email,
          usn,
          role,
          section,
          phone_number,
          github_profile,
          linkedin_profile
        )
      `
      )
      .eq("team_id", teamId)
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to get team:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Problem Management Functions

export async function getProblems() {
  const adminClient = createAdminClient();

  try {
    const { data: problems, error } = await adminClient
      .from("problems")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return { success: true, data: problems };
  } catch (error) {
    console.error("Failed to get problems:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getProblemById(problemId: number) {
  const adminClient = createAdminClient();

  try {
    const { data: problem, error } = await adminClient
      .from("problems")
      .select("*")
      .eq("problem_id", problemId)
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: problem };
  } catch (error) {
    console.error("Failed to get problem:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createProblem(title: string, description: string) {
  const adminClient = createAdminClient();

  try {
    const { data: problem, error } = await adminClient
      .from("problems")
      .insert({
        title,
        description,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath("/admin/problem");

    return { success: true, data: problem };
  } catch (error) {
    console.error("Failed to create problem:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProblem(
  problemId: number,
  title: string,
  description: string
) {
  const adminClient = createAdminClient();

  try {
    const { data: problem, error } = await adminClient
      .from("problems")
      .update({
        title,
        description,
      })
      .eq("problem_id", problemId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath("/admin/problem");

    return { success: true, data: problem };
  } catch (error) {
    console.error("Failed to update problem:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteProblem(problemId: number) {
  const adminClient = createAdminClient();

  try {
    const { error } = await adminClient
      .from("problems")
      .delete()
      .eq("problem_id", problemId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/problem");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete problem:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function assignProblemToTeam(teamId: number, problemId: number) {
  const adminClient = createAdminClient();

  try {
    // First check if team already has a problem assigned
    const { data: existing } = await adminClient
      .from("team_problems")
      .select("*")
      .eq("team_id", teamId)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing assignment
      const { data, error } = await adminClient
        .from("team_problems")
        .update({ problem_id: problemId })
        .eq("team_id", teamId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      result = data;
    } else {
      // Create new assignment
      const { data, error } = await adminClient
        .from("team_problems")
        .insert({
          team_id: teamId,
          problem_id: problemId,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      result = data;
    }

    revalidatePath("/admin/problem");
    revalidatePath("/admin/teams");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to assign problem to team:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Submission Management Functions

export async function getSubmissions(filter: string = "all") {
  const adminClient = createAdminClient();

  try {
    let query = adminClient
      .from("submissions")
      .select(
        `
        *,
        team:teams (team_id, team_name),
        member:members (member_id, name, email),
        problem:problems (problem_id, title)
      `
      )
      .order("submitted_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter.toUpperCase());
    }

    const { data: submissions, error } = await query;

    if (error) throw new Error(error.message);

    return { success: true, data: submissions };
  } catch (error) {
    console.error("Failed to get submissions:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateSubmissionStatus(
  submissionId: number,
  status: "ACCEPTED" | "REJECTED" | "PENDING",
  feedback?: string,
  score?: number
) {
  const adminClient = createAdminClient();

  try {
    const updateData: any = { status };

    if (feedback !== undefined) {
      updateData.feedback = feedback;
    }

    if (score !== undefined) {
      updateData.score = score;
    }

    // Add evaluated_by and evaluated_at if status is changing from PENDING
    if (status !== "PENDING") {
      updateData.evaluated_by = 1; // In a real app, this would be the actual admin user ID
      updateData.evaluated_at = new Date().toISOString();
    }

    const { data: submission, error } = await adminClient
      .from("submissions")
      .update(updateData)
      .eq("submission_id", submissionId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    revalidatePath("/admin");
    revalidatePath("/admin/submissions");

    return { success: true, data: submission };
  } catch (error) {
    console.error("Failed to update submission status:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Analytics Functions

export async function getAnalytics() {
  const adminClient = createAdminClient();

  try {
    // Get total teams
    const { count: totalTeams } = await adminClient
      .from("teams")
      .select("*", { count: "exact", head: true });

    // Get active submissions
    const { count: activeSubmissions } = await adminClient
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING");

    // Get accepted submissions
    const { count: acceptedSubmissions } = await adminClient
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "ACCEPTED");

    // Get rejected submissions
    const { count: rejectedSubmissions } = await adminClient
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "REJECTED");

    // Get contest status
    const { data: contest } = await adminClient
      .from("contest")
      .select("*")
      .single();

    let timeRemaining = "00:00:00";
    let contestStatus = "ended";

    if (contest && contest.end_time && contest.is_active) {
      const now = new Date();
      const end = new Date(contest.end_time);

      if (end > now) {
        contestStatus = "live";
        const remaining = Math.floor((end.getTime() - now.getTime()) / 1000);
        const hours = Math.floor(remaining / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        const secs = remaining % 60;
        timeRemaining = `${String(hours).padStart(2, "0")}:${String(
          mins
        ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }
    }

    return {
      success: true,
      data: {
        totalTeams: totalTeams || 0,
        activeSubmissions: activeSubmissions || 0,
        acceptedSubmissions: acceptedSubmissions || 0,
        rejectedSubmissions: rejectedSubmissions || 0,
        contestStatus,
        timeRemaining,
      },
    };
  } catch (error) {
    console.error("Failed to get analytics:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Recent Activity Functions

export async function getRecentActivity() {
  const adminClient = createAdminClient();

  try {
    const { data: submissions, error } = await adminClient
      .from("submissions")
      .select(
        `
        *,
        team:teams (team_name),
        member:members (name),
        problem:problems (title)
      `
      )
      .order("submitted_at", { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);

    // Transform submissions to activity items
    const recentActivity = submissions.map((submission) => {
      let action = "";
      let status = "pending";

      switch (submission.submission_type) {
        case "code":
          action = "Submitted Code Solution";
          break;
        case "github":
          action = "Submitted GitHub Link";
          break;
        case "deployment":
          action = "Submitted Deployment";
          break;
        default:
          action = "Submitted Solution";
      }

      switch (submission.status) {
        case "ACCEPTED":
          status = "success";
          break;
        case "REJECTED":
          status = "error";
          break;
        case "PENDING":
          status = "pending";
          break;
      }

      // Calculate time ago
      const submittedAt = new Date(submission.submitted_at);
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - submittedAt.getTime()) / 1000
      );

      let timeAgo = "";
      if (diffInSeconds < 60) {
        timeAgo = `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
      } else {
        timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
      }

      // Fix: Use a more robust way to access team name
      let teamName = "Unknown Team";
      if (submission.team && typeof submission.team === "object") {
        if (Array.isArray(submission.team) && submission.team.length > 0) {
          teamName = submission.team[0].team_name || "Unknown Team";
        } else if (submission.team.team_name) {
          teamName = submission.team.team_name;
        }
      }

      return {
        team: teamName,
        action,
        time: timeAgo,
        status,
      };
    });

    return { success: true, data: recentActivity };
  } catch (error) {
    console.error("Failed to get recent activity:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Top Performers Functions

export async function getTopPerformers() {
  const adminClient = createAdminClient();

  try {
    // Get teams with their total scores from the scores table
    const { data: scores, error: scoresError } = await adminClient
      .from("scores")
      .select(
        `
        team_id,
        team:teams (
          team_name
        ),
        total_score
      `
      )
      .order("total_score", { ascending: false });

    if (scoresError) throw new Error(scoresError.message);

    // Get all teams to ensure we have names for all teams
    const { data: allTeams, error: teamsError } = await adminClient
      .from("teams")
      .select("team_id, team_name");

    if (teamsError) throw new Error(teamsError.message);

    // Create a map of team_id to team_name for quick lookup
    const teamNameMap = new Map<number, string>();
    allTeams.forEach((team) => {
      teamNameMap.set(team.team_id, team.team_name);
    });

    // Group scores by team and calculate total scores
    const teamScoresMap = new Map();

    scores.forEach((score) => {
      const teamId = score.team_id;
      // Get team name from the map, fallback to scores data if available, otherwise "Unknown Team"
      let teamName = teamNameMap.get(teamId) || "Unknown Team";

      // If we have team data from the scores query, use it as a fallback
      if (teamName === "Unknown Team" && score.team) {
        if (Array.isArray(score.team) && score.team.length > 0) {
          teamName = score.team[0].team_name || "Unknown Team";
        } else if (
          typeof score.team === "object" &&
          "team_name" in score.team
        ) {
          teamName = (score.team as { team_name: string }).team_name;
        }
      }

      if (teamScoresMap.has(teamId)) {
        // Add to existing team score
        const existingTeam = teamScoresMap.get(teamId);
        existingTeam.totalScore += score.total_score || 0;
        existingTeam.submissions += 1;
      } else {
        // Create new team entry
        teamScoresMap.set(teamId, {
          team_id: teamId,
          team_name: teamName,
          totalScore: score.total_score || 0,
          submissions: 1,
        });
      }
    });

    // Convert map to array and sort by total score
    const teamScores = Array.from(teamScoresMap.values());
    teamScores.sort((a, b) => b.totalScore - a.totalScore);

    // Take top 5 and format for display
    const topPerformers = teamScores.slice(0, 5).map((team, index) => ({
      rank: index + 1,
      team: team.team_name,
      score: team.totalScore,
      submissions: team.submissions,
      badge: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "",
    }));

    return { success: true, data: topPerformers };
  } catch (error) {
    console.error("Failed to get top performers:", error);
    return { success: false, error: (error as Error).message };
  }
}
