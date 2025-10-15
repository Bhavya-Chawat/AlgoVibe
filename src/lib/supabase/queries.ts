import { createClient } from './client';
import type { RegistrationFormData, DatabaseRegistration } from '@/types/registration';

const supabase = createClient();

export async function createRegistration(data: RegistrationFormData): Promise<DatabaseRegistration> {
  // Transform form data to match database schema
  const registrationData = {
    team_leader_name: data.teamLeaderName.trim(),
    team_leader_usn: data.teamLeaderUSN.toUpperCase(),
    team_leader_email: data.teamLeaderEmail.toLowerCase(),
    team_leader_section: data.teamLeaderSection.toUpperCase(),
    ...(data.member1Name && {
      member1_name: data.member1Name.trim(),
      member1_usn: data.member1USN.toUpperCase(),
      member1_email: data.member1Email.toLowerCase(),
      member1_section: data.member1Section.toUpperCase(),
    }),
    ...(data.member2Name && {
      member2_name: data.member2Name.trim(),
      member2_usn: data.member2USN.toUpperCase(),
      member2_email: data.member2Email.toLowerCase(),
      member2_section: data.member2Section.toUpperCase(),
    })
  };

  const { data: result, error } = await supabase
    .from('registrations')
    .insert(registrationData)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('A team member is already registered with this email');
    }
    throw new Error(error.message);
  }

  if (!result) {
    throw new Error('Failed to create registration');
  }

  return result as DatabaseRegistration;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from('registrations')
    .select('id')
    .or(`team_leader_email.eq.${normalizedEmail},member1_email.eq.${normalizedEmail},member2_email.eq.${normalizedEmail}`)
    .maybeSingle();

  if (error) {
    throw new Error('Failed to check email existence');
  }

  return data !== null;
}

export async function getTeamByEmail(email: string): Promise<DatabaseRegistration | null> {
  const normalizedEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from('registrations')
    .select()
    .or(`team_leader_email.eq.${normalizedEmail},member1_email.eq.${normalizedEmail},member2_email.eq.${normalizedEmail}`)
    .maybeSingle();

  if (error) {
    throw new Error('Failed to fetch team details');
  }

  return data as DatabaseRegistration | null;
}