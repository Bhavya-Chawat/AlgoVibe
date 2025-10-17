// src/lib/supabase/queries.ts
import { createClient } from './client'
import type { RegistrationInsert, Section } from '@/types/registration'
import type { Database } from '@/types/database'

type TeamRow = Database['public']['Tables']['teams']['Row']
type MemberRow = Database['public']['Tables']['members']['Row']
type MemberInsert = Database['public']['Tables']['members']['Insert']
export type TeamWithMembers = { team: TeamRow; members: MemberRow[] }

const supabase = createClient()

const toSection = (s?: string): Section | null => {
  if (!s) return null
  const up = s.toUpperCase()
  return up === 'B' ? 'B' : 'A'
}

export async function registerTeam(payload: RegistrationInsert): Promise<TeamWithMembers> {
  // 1) Insert team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ team_name: payload.team_name.trim() })
    .select('team_id, team_name')
    .single()
  if (teamError) throw new Error(teamError.message)

  // 2) Insert members
  const memberRows: MemberInsert[] = payload.members.map((m) => ({
    team_id: team.team_id,
    name: m.name.trim(),
    usn: m.usn ? m.usn.toUpperCase() : null,
    email: m.email ? m.email.toLowerCase() : null,
    phone_number: m.phone_number ?? null,
    section: toSection(m.section || undefined),
    github_profile: m.github_profile ?? null,
    linkedin_profile: m.linkedin_profile ?? null,
    role: m.role,
  }))

  if (memberRows.length > 0) {
    const { error: membersError } = await supabase.from('members').insert(memberRows)
    if (membersError) throw new Error(membersError.message)
  }

  // 3) Read back members
  const { data: members, error: readErr } = await supabase
    .from('members')
    .select('member_id, team_id, name, usn, email, phone_number, section, github_profile, linkedin_profile, role')
    .eq('team_id', team.team_id)
  if (readErr) throw new Error(readErr.message)

  return { team, members: members ?? [] }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const normalized = email.toLowerCase()
  const { count, error } = await supabase
    .from('members')
    .select('member_id', { head: true, count: 'exact' })
    .eq('email', normalized)
  if (error) throw new Error('Failed to check email existence')
  return (count ?? 0) > 0
}

export async function getTeamByEmail(email: string): Promise<TeamWithMembers | null> {
  const normalized = email.toLowerCase()

  // locate a member with that email
  const { data: member, error: mErr } = await supabase
    .from('members')
    .select('team_id')
    .eq('email', normalized)
    .limit(1)
    .maybeSingle()
  if (mErr) throw new Error('Failed to fetch member by email')
  if (!member) return null

  // fetch team with embedded members
  const { data: teamWithMembers, error: tErr } = await supabase
    .from('teams')
    .select('team_id, team_name, members(*)')
    .eq('team_id', member.team_id)
    .single()
  if (tErr) throw new Error('Failed to fetch team details')

  const { team_id, team_name, members } = teamWithMembers as unknown as {
    team_id: number
    team_name: string
    members: MemberRow[]
  }

  return { team: { team_id, team_name }, members: members ?? [] }
}
