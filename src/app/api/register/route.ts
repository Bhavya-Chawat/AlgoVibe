import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { registrationSchema, type RegistrationData } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    // Content type check
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content type must be application/json' },
        { status: 415 }
      )
    }

    const body = await request.json()
    
    // Schema validation
    const validatedData: RegistrationData = registrationSchema.parse(body)
    
    // Check for existing team
    const { data: existingTeam, error: searchError } = await supabase
      .from('registrations')
      .select('team_name')
      .eq('team_name', validatedData.teamName)
      .maybeSingle()

    if (searchError) {
      console.error('Team search error:', searchError)
      return NextResponse.json(
        { error: 'Error checking team name' },
        { status: 500 }
      )
    }

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Team name already exists' },
        { status: 409 }
      )
    }
    
    // Validate team member emails are unique
    const emails = validatedData.teamMembers.map(member => member.email)
    if (new Set(emails).size !== emails.length) {
      return NextResponse.json(
        { error: 'Duplicate email addresses found' },
        { status: 400 }
      )
    }
    
    // Insert registration
    const { data, error: insertError } = await supabase
      .from('registrations')
      .insert([
        {
          team_name: validatedData.teamName,
          college: validatedData.college,
          team_size: validatedData.teamSize,
          team_members: validatedData.teamMembers,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()
    
    if (insertError) {
      console.error('Registration error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        message: 'Registration successful',
        teamId: data.id,
        teamName: data.team_name
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
