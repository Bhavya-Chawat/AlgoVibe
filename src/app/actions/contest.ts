"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { aiEvaluateCode } from "./aiCodeEvaluator";

export async function getContestStatus() {
  const adminClient = createAdminClient();

  const { data: contest, error } = await adminClient
    .from("contest")
    .select("is_active, start_time, duration_minutes, end_time")
    .single();

  if (error || !contest) {
    return { success: false, error: "Failed to load contest status" };
  }

  const contestStart = new Date(contest.start_time);
  const contestEnd =
    contest.end_time !== null
      ? new Date(contest.end_time)
      : new Date(
          contestStart.getTime() + (contest.duration_minutes || 0) * 60000
        );

  const now = new Date();

  return {
    success: true,
    contest: {
      is_active: contest.is_active,
      start_time: contest.start_time,
      duration_minutes: contest.duration_minutes,
      end_time: contestEnd.toISOString(),
      has_started: now >= contestStart,
      has_ended: now > contestEnd,
    },
  };
}

// Updated getTeamContestData to only return latest submission per problem+type
export async function getTeamContestData(teamId: number) {
  const supabase = createAdminClient();

  const { data: teamProblem, error: teamProblemError } = await supabase
    .from("team_problems")
    .select("problem:problems(problem_id, title, description)")
    .eq("team_id", teamId)
    .maybeSingle();

  const problem = Array.isArray(teamProblem?.problem)
    ? teamProblem.problem[0] ?? null
    : teamProblem?.problem ?? null;

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select()
    .eq("team_id", teamId)
    .order("submitted_at", { ascending: false });

  if (submissionsError || !submissions) {
    return {
      problem,
      submissions: [],
      error: teamProblemError || submissionsError || null,
    };
  }

  // Filter latest unique submissions per problem_id + submission_type
  const latestMap = new Map<string, (typeof submissions)[0]>();

  for (const sub of submissions) {
    const key = `${sub.problem_id}_${sub.submission_type}`;
    if (!latestMap.has(key)) {
      latestMap.set(key, sub);
    }
  }

  return {
    problem,
    submissions: Array.from(latestMap.values()),
    error: teamProblemError || submissionsError || null,
  };
}

export async function submitSubmission(submissionData: {
  submission?: string | { submission: string; [key: string]: any };
  submission_type?: "code" | "github" | "deployment";
}) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const email = user.email ?? "";
  const match = email.match(/^team-(\d+)@algovibe\.com$/);

  if (!match) {
    return { success: false, error: "Invalid user email format" };
  }

  const teamId = parseInt(match[1], 10);

  const contestStatus = await getContestStatus();

  if (!contestStatus.success) {
    return {
      success: false,
      error: contestStatus.error || "Contest info unavailable",
    };
  }

  const contest = contestStatus.contest!;

  if (!contest.is_active) {
    return { success: false, error: "Contest is not active", contest };
  }
  if (!contest.has_started) {
    return { success: false, error: "Contest has not started", contest };
  }
  if (contest.has_ended) {
    return { success: false, error: "Contest has ended", contest };
  }
  if (!submissionData.submission) {
    return { success: false, error: "Submission content is required", contest };
  }

  const submissionType = submissionData.submission_type || "code";

  // Sanitize submission input: only for github/deployment, not for code submit
  let rawSubmission: string;
  if (submissionType === "code") {
    // Accept code submission as is
    if (typeof submissionData.submission === "string") {
      rawSubmission = submissionData.submission;
    } else if (
      typeof submissionData.submission === "object" &&
      submissionData.submission !== null &&
      typeof submissionData.submission.submission === "string"
    ) {
      rawSubmission = submissionData.submission.submission;
    } else {
      return { success: false, error: "Invalid submission format", contest };
    }
  } else {
    // For github or deployment, expect only a string (e.g., URL)
    if (typeof submissionData.submission !== "string") {
      return { success: false, error: "Invalid submission format", contest };
    }
    rawSubmission = submissionData.submission;
  }

  const { data: teamProblem, error: problemError } = await adminClient
    .from("team_problems")
    .select("problem_id")
    .eq("team_id", teamId)
    .single();

  if (problemError || !teamProblem) {
    return {
      success: false,
      error: "No problem assigned to this team",
      contest,
    };
  }

  let status: "ACCEPTED" | "REJECTED" | "PENDING";
  let feedback = "";

  if (submissionType === "code") {
    const { data: problem, error: probDescErr } = await adminClient
      .from("problems")
      .select("description")
      .eq("problem_id", teamProblem.problem_id)
      .single();

    if (probDescErr || !problem) {
      return {
        success: false,
        error: "Problem description unavailable",
        contest,
      };
    }

    // Call AI evaluator imported from separate file
    const aiResult = await aiEvaluateCode(problem.description, rawSubmission);

    // Type guard the result (fixing the TS error)
    if (typeof aiResult === "object" && "verdict" in aiResult) {
      status = aiResult.verdict === "correct" ? "ACCEPTED" : "REJECTED";
      feedback = aiResult.feedback || "";
    } else {
      status = "PENDING";
      feedback = "Evaluation pending or failed.";
    }
  } else {
    status = "ACCEPTED";
    feedback = "Submission received.";
  }

  const { data: existing, error: fetchErr } = await adminClient
    .from("submissions")
    .select()
    .eq("team_id", teamId)
    .eq("problem_id", teamProblem.problem_id)
    .eq("submission_type", submissionType)
    .maybeSingle();

  let submission;
  let upsertError;

  if (existing) {
    const { data: updated, error: updateErr } = await adminClient
      .from("submissions")
      .update({
        submission: rawSubmission,
        status,
        feedback,
      })
      .eq("submission_id", existing.submission_id)
      .select()
      .single();
    submission = updated;
    upsertError = updateErr;
  } else {
    const { data: inserted, error: insertErr } = await adminClient
      .from("submissions")
      .insert({
        team_id: teamId,
        problem_id: teamProblem.problem_id,
        submission: rawSubmission,
        submission_type: submissionType,
        status,
        feedback,
      })
      .select()
      .single();
    submission = inserted;
    upsertError = insertErr;
  }

  if (upsertError) {
    return { success: false, error: upsertError.message, contest };
  }

  revalidatePath("/contest");

  return { success: true, submission, contest };
}
