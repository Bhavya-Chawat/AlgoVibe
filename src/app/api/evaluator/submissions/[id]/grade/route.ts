import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await getUserRole(user.email!)
  if (role !== 'evaluator' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { score, feedback, status } = body

  if (score === undefined || score === null) {
    return NextResponse.json(
      { error: 'Score is required' },
      { status: 400 }
    )
  }

  if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
    return NextResponse.json(
      { error: 'Valid status is required (ACCEPTED or REJECTED)' },
      { status: 400 }
    )
  }

  const adminClient = createAdminClient()
  
  // Get evaluator's member_id if exists
  const { data: evaluatorMember } = await adminClient
    .from('members')
    .select('member_id')
    .eq('email', user.email!)
    .single()

  const { data, error } = await adminClient
    .from('submissions')
    .update({
      score,
      feedback,
      status,
      evaluated_at: new Date().toISOString(),
      evaluated_by: evaluatorMember?.member_id || null
    })
    .eq('submission_id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, submission: data })
}
