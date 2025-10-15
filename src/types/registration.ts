export interface TeamMember {
  name: string;
  usn: string;
  email: string;
  section: string;
}

export interface RegistrationFormData {
  teamLeaderName: string;
  teamLeaderUSN: string;
  teamLeaderEmail: string;
  teamLeaderSection: string;
  member1Name: string;
  member1USN: string;
  member1Email: string;
  member1Section: string;
  member2Name: string;
  member2USN: string;
  member2Email: string;
  member2Section: string;
}

export interface RegistrationPayload {
  team_leader_name: string;
  team_leader_usn: string;
  team_leader_email: string;
  team_leader_section: string;
  member1_name?: string;
  member1_usn?: string;
  member1_email?: string;
  member1_section?: string;
  member2_name?: string;
  member2_usn?: string;
  member2_email?: string;
  member2_section?: string;
}