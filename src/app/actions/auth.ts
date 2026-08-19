"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Contestant login - Uses team name and password from teams table
 * Creates/uses Supabase Auth account automatically
 */
export async function login(teamOrEmail: string, password: string) {
  const supabase = await createClient();

  // Extract team name (handle email-like inputs)
  const rawTeamName = teamOrEmail.includes("@")
    ? teamOrEmail.split("@")[0]
    : teamOrEmail;

  const trimmed = rawTeamName.trim();

  console.log("[AUTH] Login attempt for:", trimmed);

  if (!trimmed) {
    return {
      success: false,
      message: "Team name is required",
    };
  }

  // Verify table access
  const { count, error: countError } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("[AUTH] Cannot access teams table:", countError);
    return {
      success: false,
      message: "Database configuration error",
    };
  }

  if (count === 0) {
    return {
      success: false,
      message: "No teams found in database",
    };
  }

  console.log(`[AUTH] Teams table accessible, ${count} teams found`);

  let team: any = null;

  // Try exact match first
  let res = await supabase
    .from("teams")
    .select("team_id, team_name, pass")
    .eq("team_name", trimmed)
    .maybeSingle();

  if (res.data) {
    team = res.data;
    console.log("[AUTH] Found team via exact match");
  }

  // Try case-insensitive match if exact fails
  if (!team && !res.error) {
    res = await supabase
      .from("teams")
      .select("team_id, team_name, pass")
      .ilike("team_name", trimmed)
      .maybeSingle();

    if (res.data) {
      team = res.data;
      console.log("[AUTH] Found team via case-insensitive match");
    }
  }

  // Handle database errors
  if (res.error) {
    console.error("[AUTH] Database error:", res.error);
    return {
      success: false,
      message: "Database error occurred",
    };
  }

  // Team not found
  if (!team) {
    return {
      success: false,
      message: "Invalid team name or password",
    };
  }

  // Verify password (plain text comparison)
  if (team.pass !== password) {
    console.error("[AUTH] Password mismatch");
    return {
      success: false,
      message: "Invalid team name or password",
    };
  }

  console.log("[AUTH] Password verified for team:", team.team_name);

  // Generate Supabase Auth email
  const email = `team-${team.team_id}@algovibe.com`;

  // Attempt sign-in
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    console.log(
      "[AUTH] Sign-in failed, attempting signup:",
      signInError.message
    );

    // Try creating the account first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            team_id: team.team_id,
            team_name: team.team_name,
          },
          emailRedirectTo: undefined, // Disable email confirmation
        },
      }
    );

    if (signUpError) {
      console.error("[AUTH] Sign-up failed:", signUpError);
      return {
        success: false,
        message: "Authentication failed",
      };
    }

    console.log("[AUTH] Account created, attempting sign-in again");

    // Try signing in again after account creation
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
      };
    }
  }

  console.log("[AUTH] Login successful for team:", team.team_name);

  revalidatePath("/", "layout");
  redirect("/pre-contest");
}

/**
 * Admin/Evaluator login - Uses email and password from Supabase Auth
 * Validates role from user_roles table
 */
export async function loginStaff(email: string, password: string) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  console.log("[AUTH] Staff login attempt for:", email);

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Invalid email format",
    };
  }

  // Check if user exists in user_roles table
  const { data: userRole, error: roleError } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("email", email)
    .single();

  if (roleError || !userRole) {
    console.error("[AUTH] User not found in user_roles:", roleError?.message);
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  // Verify role is admin or evaluator
  if (userRole.role !== "admin" && userRole.role !== "evaluator") {
    console.error("[AUTH] Unauthorized role:", userRole.role);
    return {
      success: false,
      message: "Unauthorized access",
    };
  }

  console.log("[AUTH] User role verified:", userRole.role);

  // Attempt sign-in with Supabase Auth
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("[AUTH] Sign-in error:", signInError.message);
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  console.log("[AUTH] Staff login successful for:", email);

  revalidatePath("/", "layout");

  // Redirect based on role
  if (userRole.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/evaluator");
  }
}

/**
 * Logout - Signs out from Supabase Auth
 * Works for all user types (contestant, admin, evaluator)
 */
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[AUTH] Logout error:", error);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Get current user from Supabase Auth
 */
export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    // AuthSessionMissingError is expected for unauthenticated visitors
    if (
      error.name !== "AuthSessionMissingError" &&
      !error.message?.includes("Auth session missing")
    ) {
      console.error("[AUTH] Get user error:", error);
    }
    return null;
  }

  return user;
}

/**
 * Get current user with their role
 * Checks user_roles table for admin/evaluator, defaults to contestant
 */
export async function getUserWithRole() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // Check user_roles table for role
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("email", user.email!)
    .single();

  const role = userRole?.role || "contestant";

  return {
    ...user,
    role,
  };
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  const userWithRole = await getUserWithRole();
  return userWithRole?.role === "admin";
}

/**
 * Check if current user is evaluator or admin
 */
export async function isEvaluator() {
  const userWithRole = await getUserWithRole();
  return userWithRole?.role === "evaluator" || userWithRole?.role === "admin";
}

/**
 * Check if current user is contestant
 */
export async function isContestant() {
  const userWithRole = await getUserWithRole();
  return userWithRole?.role === "contestant";
}

/**
 * Get team info for current contestant
 */
export async function getTeamInfo() {
  const user = await getUser();

  if (!user || !user.email) {
    return null;
  }

  const adminClient = createAdminClient();

  // Extract team_id from email (team-{id}@algovibe.com)
  const teamIdMatch = user.email.match(/^team-(\d+)@/);

  if (teamIdMatch) {
    const teamId = parseInt(teamIdMatch[1]);

    const { data: team } = await adminClient
      .from("teams")
      .select(
        `
        *,
        members (
          member_id,
          name,
          email,
          usn,
          role
        )
      `
      )
      .eq("team_id", teamId)
      .single();

    return team;
  }

  // Fallback: search by member email
  const { data: member } = await adminClient
    .from("members")
    .select(
      `
      team_id,
      team:teams (
        *,
        members (
          member_id,
          name,
          email,
          usn,
          role
        )
      )
    `
    )
    .eq("email", user.email)
    .single();

  return member?.team || null;
}
