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

  const adminClient = createAdminClient()

  const { data: contest } = await adminClient
    .from('contest')
    .select('*')
    .single()

  const { count: totalTeams } = await adminClient
    .from('teams')
    .select('*', { count: 'exact', head: true })

  const { count: activeSubmissions } = await adminClient
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING')

  let timeRemaining = '00:00:00'
  let contestStatus = 'ended'

  if (contest && contest.end_time && contest.is_active) {
    const now = new Date()
    const end = new Date(contest.end_time)
    
    if (end > now) {
      contestStatus = 'live'
      const remaining = Math.floor((end.getTime() - now.getTime()) / 1000)
      const hours = Math.floor(remaining / 3600)
      const mins = Math.floor((remaining % 3600) / 60)
      const secs = remaining % 60
      timeRemaining = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
  }

  return NextResponse.json({
    totalTeams: totalTeams || 0,
    activeSubmissions: activeSubmissions || 0,
    contestStatus,
    timeRemaining
  })
}
