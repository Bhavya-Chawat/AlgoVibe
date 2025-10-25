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

  const { data: member } = await adminClient
    .from('members')
    .select('team_id')
    .eq('email', user.email!)
    .single()

  if (!member) {
    return NextResponse.json(
      { error: 'Team not found' },
      { status: 404 }
    )
  }

  const { data: submissions, error } = await adminClient
    .from('submissions')
    .select(`
      *,
      problem:problems (problem_id, title)
    `)
    .eq('team_id', member.team_id)
    .order('submitted_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(submissions)
}
