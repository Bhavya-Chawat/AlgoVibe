"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const PROMPT_TEMPLATE = (problemDescription: string, userCode: string) => `
You are an expert code reviewer.

Given this problem:
${problemDescription}

And this code submission:
${userCode}

Evaluate ONLY the correctness and style.

Respond ONLY as JSON:
{
  "verdict": "correct" | "incorrect",
  "feedback": "String, brief and constructive",
  "issues": ["String - list of issue descriptions, if any"]
}
`;

async function aiEvaluateCode(problemDescription: string, codeText: string) {
  const prompt = PROMPT_TEMPLATE(problemDescription, codeText);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0,
  });

  const content = completion.choices[0]?.message?.content || "";
  try {
    return JSON.parse(content);
  } catch {
    return {
      verdict: "incorrect",
      feedback: "Could not parse AI response.",
      issues: ["AI output could not be parsed as JSON."],
    };
  }
}

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

  return {
    problem,
    submissions: submissionsError || !submissions ? [] : submissions,
    error: teamProblemError || submissionsError || null,
  };
}

export async function submitSubmission(submissionData: {
  submission?: string;
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

  // Prepare status and feedback
  let status: "ACCEPTED" | "REJECTED" | "PENDING";
  let feedback = "";

  if (submissionType === "code") {
    // Get problem description for AI review
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

    // Evaluate code submission via AI
    const aiResult = await aiEvaluateCode(
      problem.description,
      submissionData.submission
    );

    status = aiResult.verdict === "correct" ? "ACCEPTED" : "REJECTED";
    feedback = aiResult.feedback || "";
    // You can save aiResult.issues in another column if the schema allows,
    // or ignore if you only need verdict and feedback.
  } else {
    // Non-code submissions are always accepted
    status = "ACCEPTED";
    feedback = "Submission received.";
  }

  // Upsert logic: update if row exists, insert if not
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
    // Update
    const { data: updated, error: updateErr } = await adminClient
      .from("submissions")
      .update({
        submission: submissionData.submission,
        status,
        feedback,
      })
      .eq("id", existing.id)
      .select()
      .single();
    submission = updated;
    upsertError = updateErr;
  } else {
    // Insert
    const { data: inserted, error: insertErr } = await adminClient
      .from("submissions")
      .insert({
        team_id: teamId,
        problem_id: teamProblem.problem_id,
        submission: submissionData.submission,
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
