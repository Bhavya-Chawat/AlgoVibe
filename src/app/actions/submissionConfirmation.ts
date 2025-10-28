"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

type TeamMember = Database["public"]["Tables"]["members"]["Row"];
type Team = Database["public"]["Tables"]["teams"]["Row"];

interface TeamDetails {
  team: Team;
  members: TeamMember[];
}

// Updated Submission interface to match the actual database structure
interface Submission {
  submission_id: number;
  team_id: number;
  problem_id: number;
  submission: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  submission_type: "code" | "github" | "deployment";
}

export async function getTeamDetails(teamId: number): Promise<{
  success: boolean;
  data?: TeamDetails;
  error?: string;
}> {
  const supabase = await createClient();

  try {
    // Fetch team details
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", teamId)
      .single();

    if (teamError) {
      console.error("Error fetching team:", teamError);
      return { success: false, error: "Failed to fetch team details" };
    }

    if (!teamData) {
      return { success: false, error: "Team not found" };
    }

    // Fetch team members
    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select("*")
      .eq("team_id", teamId)
      .order("role");

    if (membersError) {
      console.error("Error fetching members:", membersError);
      return { success: false, error: "Failed to fetch team members" };
    }

    return {
      success: true,
      data: {
        team: teamData,
        members: membersData,
      },
    };
  } catch (error) {
    console.error("Unexpected error in getTeamDetails:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getSubmissionStatus(teamId: number): Promise<{
  success: boolean;
  data?: {
    codeSubmitted: boolean;
    githubSubmitted: boolean;
    deploymentSubmitted: boolean;
    submissions: Submission[];
  };
  error?: string;
}> {
  // Use admin client to bypass RLS and access all submissions
  const supabase = createAdminClient();

  try {
    console.log("Fetching submissions for team ID:", teamId);

    // Check if the Supabase client is properly initialized
    console.log("Supabase client initialized:", !!supabase);

    // Fetch all submissions for the team
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("team_id", teamId)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
      });
      return { success: false, error: "Failed to fetch submission status" };
    }

    console.log("Retrieved submissions:", submissions);
    console.log("Submission count:", submissions?.length);

    // Handle case where submissions is null or undefined
    const validSubmissions = submissions || [];

    // Determine which submissions have been made
    let codeSubmitted = false;
    let githubSubmitted = false;
    let deploymentSubmitted = false;

    for (const submission of validSubmissions) {
      if (submission.submission_type === "code") {
        codeSubmitted = true;
      } else if (submission.submission_type === "github") {
        githubSubmitted = true;
      } else if (submission.submission_type === "deployment") {
        deploymentSubmitted = true;
      }
    }

    console.log(
      "Submission status - Code:",
      codeSubmitted,
      "GitHub:",
      githubSubmitted,
      "Deployment:",
      deploymentSubmitted
    );

    return {
      success: true,
      data: {
        codeSubmitted,
        githubSubmitted,
        deploymentSubmitted,
        submissions: validSubmissions,
      },
    };
  } catch (error) {
    console.error("Unexpected error in getSubmissionStatus:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
