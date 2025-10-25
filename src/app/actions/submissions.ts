"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function submitCode(submissionData: {
  code?: string;
  github_link?: string;
  deployment_link?: string;
  teamId: number;
}) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  // Validate at least one field
  if (
    !submissionData.code &&
    !submissionData.github_link &&
    !submissionData.deployment_link
  ) {
    return {
      success: false,
      error: "At least one submission field is required",
    };
  }

  // Get member info
  const { data: member, error: memberError } = await adminClient
    .from("members")
    .select("member_id, team_id")
    .eq("email", user.email!)
    .single();

  if (memberError || !member) {
    return {
      success: false,
      error: "Member not found",
    };
  }

  // Get team's problem
  const { data: teamProblem, error: problemError } = await adminClient
    .from("team_problems")
    .select("problem_id")
    .eq("team_id", member.team_id)
    .single();

  if (problemError || !teamProblem) {
    return {
      success: false,
      error: "No problem assigned to your team",
    };
  }

  // Check contest is active
  const { data: contest } = await adminClient
    .from("contest")
    .select("is_active, end_time")
    .single();

  if (!contest?.is_active) {
    return {
      success: false,
      error: "Contest is not active",
    };
  }

  if (new Date() > new Date(contest.end_time)) {
    return {
      success: false,
      error: "Contest has ended",
    };
  }

  // Create submission
  const { data: submission, error: submissionError } = await adminClient
    .from("submissions")
    .insert({
      team_id: member.team_id,
      member_id: member.member_id,
      problem_id: teamProblem.problem_id,
      code: submissionData.code || null,
      github_link: submissionData.github_link || null,
      deployment_link: submissionData.deployment_link || null,
      status: "PENDING",
    })
    .select()
    .single();

  if (submissionError) {
    return {
      success: false,
      error: submissionError.message,
    };
  }

  revalidatePath("/contest");

  return {
    success: true,
    submission,
  };
}
