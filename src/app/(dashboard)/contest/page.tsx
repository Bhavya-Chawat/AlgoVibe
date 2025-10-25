import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/app/actions/auth'
import ContestPageClient from './ContestPageClient'
import { createAdminClient } from '@/lib/supabase/server'

export default async function ContestPage() {
  const user = await getUserWithRole()

  // Verify contestant access
  if (!user || user.role !== 'contestant') {
    redirect('/unauthorized')
  }

  // Get user's team info
  const supabase = createAdminClient()
  
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('team_id')
    .eq('email', user.email!)
    .single()

  if (memberError || !member) {
    redirect('/unauthorized')
  }

  // Get team's problem - Split into two queries for cleaner types
  const { data: teamProblem } = await supabase
    .from('team_problems')
    .select('problem_id')
    .eq('team_id', member.team_id)
    .single()

  let problem = null

  if (teamProblem?.problem_id) {
    const { data: problemData } = await supabase
      .from('problems')
      .select('problem_id, title, description')
      .eq('problem_id', teamProblem.problem_id)
      .single()

    problem = problemData
  }

  // Get team's submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      submission_id,
      code,
      github_link,
      deployment_link,
      status,
      score,
      feedback,
      submitted_at
    `)
    .eq('team_id', member.team_id)
    .order('submitted_at', { ascending: false })

  return (
    <ContestPageClient 
      problem={problem}
      initialSubmissions={submissions || []}
      teamId={member.team_id}
    />
  )
}
