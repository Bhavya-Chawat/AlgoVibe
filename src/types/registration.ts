// src/types/registration.ts
export type Section = 'A' | 'B'
export type MemberRole = 'Leader' | 'Member'

export type TeamMember = {
  name: string
  usn?: string
  email?: string
  phone_number?: string
  section?: Section
  github_profile?: string
  linkedin_profile?: string
  role: MemberRole
}

export type RegistrationInsert = {
  team_name: string
  members: TeamMember[] // must be 2–3 with exactly one Leader
}

export type RegistrationData = {
  teamName: string
  teamMembers: TeamMember[]
}
