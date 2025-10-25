import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { code, github_link, deployment_link } = body

  // Require at least one submission field
  if (!code && !github_link && !deployment_link) {
    return NextResponse.json(
      { error: 'At least one submission field is required' },
      { status: 400 }
    )
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('member_id, team_id')
    .eq('email', user.email!)
    .single()

  if (memberError || !member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  const { data: teamProblem, error: problemError } = await supabase
    .from('team_problems')
    .select('problem_id')
    .eq('team_id', member.team_id)
    .single()

  if (problemError || !teamProblem) {
    return NextResponse.json(
      { error: 'No problem assigned to your team' },
      { status: 404 }
    )
  }

  const { data: contest } = await supabase
    .from('contest')
    .select('is_active, end_time')
    .single()

  if (!contest?.is_active || new Date() > new Date(contest.end_time)) {
    return NextResponse.json({ error: 'Contest is not active' }, { status: 403 })
  }

  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .insert({
      team_id: member.team_id,
      member_id: member.member_id,
      problem_id: teamProblem.problem_id,
      code,
      github_link,
      deployment_link,
      status: 'PENDING',
    })
    .select()
    .single()

  if (submissionError) {
    return NextResponse.json({ error: submissionError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, submission })
}
