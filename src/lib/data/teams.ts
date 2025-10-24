import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type TeamMember = {
  member_id: number;
  name: string;
  usn: string | null;
  email: string | null;
  phone_number: string | null;
  section: "A" | "B" | null;
  github_profile: string | null;
  linkedin_profile: string | null;
  role: "Leader" | "Member";
};

export type Team = {
  team_id: number;
  team_name: string;
  created_at: string;
  members: TeamMember[];
};

export const getTeamByAuthUser = cache(async (): Promise<Team | null> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("[DATA] Auth user:", {
    user: user?.email,
    error: authError,
  });

  if (authError || !user) {
    console.error("[DATA] No authenticated user");
    return null;
  }

  const emailMatch = user.email?.match(/^team-(\d+)@algovibe\.com$/);
  if (!emailMatch) {
    console.error("[DATA] Invalid email format:", user.email);
    return null;
  }

  const teamId = parseInt(emailMatch[1]);
  console.log("[DATA] Extracted team_id:", teamId);

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("team_id, team_name, created_at")
    .eq("team_id", teamId)
    .single();

  console.log("[DATA] Team query result:", {
    team,
    error: teamError,
  });

  if (teamError || !team) {
    console.error("[DATA] Team not found");
    return null;
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("*")
    .eq("team_id", teamId)
    .order("role", { ascending: false });

  console.log("[DATA] Members query result:", {
    count: members?.length || 0,
    error: membersError,
  });

  if (membersError) {
    return { ...team, members: [] };
  }

  return {
    ...team,
    members: members || [],
  };
});
