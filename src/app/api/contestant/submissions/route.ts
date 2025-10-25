import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = user.email ?? ''
  const match = email.match(/^team-(\d+)@algovibe\.com$/)
  if (!match) {
    return NextResponse.json({ error: 'Invalid user email' }, { status: 401 })
  }
  const teamId = parseInt(match[1], 10)

  const { data, error } = await supabase
    .from('submissions')
    .select(`
      submission_id,
      code,
      github_link,
      deployment_link,
      status,
      score,
      feedback,
      submitted_at,
      problem:problems(problem_id, title)
    `)
    .eq('team_id', teamId)
    .order('submitted_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
