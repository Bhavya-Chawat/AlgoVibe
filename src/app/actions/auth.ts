"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(teamOrEmail: string, password: string) {
  const supabase = await createClient();

  const rawTeamName = teamOrEmail.includes("@")
    ? teamOrEmail.split("@")[0]
    : teamOrEmail;

  const trimmed = rawTeamName.trim();

  console.log("[AUTH] Login attempt for:", trimmed);

  if (!trimmed) {
    return {
      success: false,
      message: "Team name is required",
      debug: "Empty team name provided",
    };
  }

  // First, check if we can access the table at all (RLS check)
  const { count, error: countError } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true });

  console.log("[AUTH] Table access check:", {
    count,
    error: countError,
    canAccess: !countError && count !== null,
  });

  if (countError) {
    console.error("[AUTH] Cannot access teams table:", countError);
    return {
      success: false,
      message: "Database configuration error",
      debug: `Cannot access teams table: ${countError.message}. This is likely an RLS (Row Level Security) issue. Check that anonymous users can SELECT from the teams table.`,
    };
  }

  if (count === 0) {
    return {
      success: false,
      message: "No teams found in database",
      debug:
        "The teams table is empty or RLS is blocking access. If you have teams in the database, disable RLS on the teams table or add a policy allowing anonymous SELECT access.",
    };
  }

  console.log(`[AUTH] Teams table accessible, ${count} teams found`);

  let team: any = null;

  // Try exact match
  console.log("[AUTH] Attempting exact match for:", trimmed);
  let res = await supabase
    .from("teams")
    .select("team_id, team_name, pass")
    .eq("team_name", trimmed)
    .maybeSingle();

  console.log("[AUTH] Exact match result:", {
    error: res.error,
    hasData: !!res.data,
  });

  if (res.data) {
    team = res.data;
    console.log("[AUTH] Found team via exact match:", team.team_name);
  }

  // Try case-insensitive match if exact match fails
  if (!team && !res.error) {
    console.log("[AUTH] Attempting case-insensitive match for:", trimmed);
    res = await supabase
      .from("teams")
      .select("team_id, team_name, pass")
      .ilike("team_name", trimmed)
      .maybeSingle();

    console.log("[AUTH] Case-insensitive match result:", {
      error: res.error,
      hasData: !!res.data,
    });

    if (res.data) {
      team = res.data;
      console.log(
        "[AUTH] Found team via case-insensitive match:",
        team.team_name
      );
    }
  }

  // Check for actual errors
  if (res.error) {
    console.error("[AUTH] Database error:", res.error);
    return {
      success: false,
      message: "Database error occurred",
      debug: `Database error: ${res.error.message}. Code: ${
        res.error.code || "N/A"
      }`,
    };
  }

  if (!team) {
    console.error("[AUTH] No team found for:", trimmed);

    // Fetch sample team names for debugging
    const { data: allTeams, error: fetchError } = await supabase
      .from("teams")
      .select("team_name")
      .limit(10);

    if (fetchError) {
      return {
        success: false,
        message: "Invalid team name or password",
        debug: `Team "${trimmed}" not found. Could not fetch team list: ${fetchError.message}. This might be an RLS issue.`,
      };
    }

    const teamsList = allTeams?.map((t) => t.team_name).join(", ") || "none";

    return {
      success: false,
      message: "Invalid team name or password",
      debug: `Team "${trimmed}" not found. Available teams: [${teamsList}]. Check spelling and capitalization. Total teams in DB: ${count}`,
    };
  }

  console.log("[AUTH] Team found:", {
    team_id: team.team_id,
    team_name: team.team_name,
    hasPassword: !!team.pass,
  });

  // Verify password
  if (team.pass !== password) {
    console.error("[AUTH] Password mismatch for team:", team.team_name);
    return {
      success: false,
      message: "Invalid team name or password",
      debug: `Password incorrect. DB password: "${team.pass}", Input: "${password}"`,
    };
  }

  console.log("[AUTH] Password verified for team:", team.team_name);

  const email = `team-${team.team_id}@algovibe.com`;
  console.log("[AUTH] Using auth email:", email);

  // Attempt sign-in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.warn(
      "[AUTH] Sign-in failed, attempting signup:",
      signInError.message
    );

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          team_id: team.team_id,
          team_name: team.team_name,
        },
      },
    });

    if (signUpError) {
      console.error("[AUTH] Sign-up failed:", signUpError);
      return {
        success: false,
        message: "Authentication failed",
        debug: `Sign-up error: ${signUpError.message}`,
      };
    }

    const { error: secondSignInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (secondSignInError) {
      console.error("[AUTH] Second sign-in failed:", secondSignInError);
      return {
        success: false,
        message: "Authentication failed after account creation",
        debug: `Second sign-in error: ${secondSignInError.message}`,
      };
    }
  }

  console.log("[AUTH] Login successful!");
  revalidatePath("/", "layout");
  redirect("/pre-contest");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
