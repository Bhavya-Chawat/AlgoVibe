import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await getUserRole(user.email!)
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'

  const adminClient = createAdminClient()
  let query = adminClient
    .from('submissions')
    .select(`
      *,
      team:teams (team_id, team_name),
      member:members (member_id, name, email),
      problem:problems (problem_id, title)
    `)
    .order('submitted_at', { ascending: false })

  if (filter !== 'all') {
    query = query.eq('status', filter.toUpperCase())
  }

  const { data: submissions, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(submissions)
}
