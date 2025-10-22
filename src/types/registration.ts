// src/types/registration.ts
export type Section = "A" | "B";
export type MemberRole = "Leader" | "Member";

export type TeamMember = {
  name: string;
  usn?: string;
  email?: string;
  phone_number?: string;
  section?: Section;
  github_profile?: string;
  linkedin_profile?: string;
  role: MemberRole;
};

// Shape used by the DB insert layer (matches Supabase `teams` table)
export type RegistrationInsert = {
  team_name: string;
  pass: string; // new: plaintext team password column
  members: TeamMember[]; // must be 2–3 with exactly one Leader
};

// Shape received from the client (UI form payload)
export type RegistrationData = {
  teamName: string;
  teamPassword: string; // new: form field mapped to `pass`
  teamMembers: TeamMember[];
};
