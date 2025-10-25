import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()

  // Find member by email
  const { data: member, error: memberError } = await adminClient
    .from('members')
    .select('team_id, member_id')
    .eq('email', user.email!)
    .single()

  if (memberError || !member) {
    return NextResponse.json(
      { error: 'Team not found. Please contact admin.' },
      { status: 404 }
    )
  }

  // Get team's assigned problem
  const { data: teamProblem, error: teamProblemError } = await adminClient
    .from('team_problems')
    .select(`
      *,
      problem:problems (*)
    `)
    .eq('team_id', member.team_id)
    .single()

  if (teamProblemError) {
    // Assign random problem
    const { data: problems } = await adminClient
      .from('problems')
      .select('problem_id')

    if (!problems || problems.length === 0) {
      return NextResponse.json(
        { error: 'No problems available' },
        { status: 404 }
      )
    }

    const randomProblem = problems[Math.floor(Math.random() * problems.length)]

    await adminClient
      .from('team_problems')
      .insert({
        team_id: member.team_id,
        problem_id: randomProblem.problem_id
      })

    const { data: newProblem } = await adminClient
      .from('problems')
      .select('*')
      .eq('problem_id', randomProblem.problem_id)
      .single()

    return NextResponse.json(newProblem)
  }

  return NextResponse.json(teamProblem.problem)
}
