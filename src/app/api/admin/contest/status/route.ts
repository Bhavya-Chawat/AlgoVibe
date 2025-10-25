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
  const { data: contest, error } = await adminClient
    .from('contest')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const now = new Date()
  const startTime = contest.start_time ? new Date(contest.start_time) : null
  const endTime = contest.end_time ? new Date(contest.end_time) : null

  let status = 'pre'
  let timeRemaining = contest.duration_minutes * 60

  if (startTime && endTime) {
    if (now < startTime) status = 'pre'
    else if (now >= endTime) status = 'ended'
    else if (contest.is_active) status = 'live'
    else status = 'paused'

    if (endTime > now) {
      timeRemaining = Math.floor((endTime.getTime() - now.getTime()) / 1000)
    } else {
      timeRemaining = 0
    }
  }

  return NextResponse.json({
    status,
    timeRemaining,
    startTime: contest.start_time,
    endTime: contest.end_time,
    isActive: contest.is_active,
    durationMinutes: contest.duration_minutes
  })
}
