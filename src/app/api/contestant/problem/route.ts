import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { marked } from 'marked'

// Basic sanitizer fallback
function sanitizeHtml(html: string) {
  return html.replace(/<script.*?>.*?<\/script>/gi, '')
}

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

  const { data: teamProblem, error } = await supabase
    .from('team_problems')
    .select('problem:problems(problem_id, title, description)') // without !inner here
    .eq('team_id', teamId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Handle problem possibly being an array
  const problemData = Array.isArray(teamProblem?.problem)
    ? teamProblem.problem[0]
    : teamProblem?.problem

  if (!problemData) {
    return NextResponse.json(null)
  }

  const sanitizedTitle = sanitizeHtml(problemData.title)
  const descriptionHTML = marked.parse(problemData.description)

  return NextResponse.json({
    problem_id: problemData.problem_id,
    title: sanitizedTitle,
    description: descriptionHTML,
  })
}
