import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/server";

export async function getUserRole(
  email: string | undefined
): Promise<"admin" | "evaluator" | "contestant"> {
  if (!email) return "contestant"; // fallback for no email

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("email", email)
    .maybeSingle(); // changed from single() to maybeSingle()

  if (error) {
    // Log error if needed but return contestant role safely
    console.error(`[getUserRole] error:`, error.message);
    return "contestant";
  }

  if (!data) {
    // no matching user_roles record found, default contestant
    return "contestant";
  }

  return data.role as "admin" | "evaluator" | "contestant";
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const role = await getUserRole(user.email!);

  return {
    ...user,
    role,
  };
}
